import { HolidayData } from "@/lib/calendar/holidays";
import { MONTH_NAMES_ID, DAY_NAMES_FULL_ID } from "@/lib/calendar/constants";
import { Badge } from "@/components/ui/badge";

interface Props {
  year: number;
  holidays: HolidayData[];
}

function formatDate(date: Date) {
  return `${date.getDate()} ${MONTH_NAMES_ID[date.getMonth()]}`;
}

function getDayName(date: Date) {
  return DAY_NAMES_FULL_ID[date.getDay()];
}

const TYPE_CONFIG = {
  national: { label: "Libur", cls: "bg-error/10 text-error border-error/20" },
  "joint-leave": { label: "Cuti", cls: "bg-badge-orange/10 text-badge-orange border-badge-orange/20" },
  regional: { label: "Regional", cls: "bg-badge-emerald/10 text-badge-emerald border-badge-emerald/20" },
} as const;

const COL = "grid-cols-[140px_1fr_80px]";

interface GroupedHoliday extends HolidayData {
  regions: Array<{ code: string; name: string | null }>;
}

function HolidayRow({ h, border = true }: { h: GroupedHoliday; border?: boolean }) {
  const d = new Date(h.date);
  const cfg = TYPE_CONFIG[h.type as keyof typeof TYPE_CONFIG] ?? TYPE_CONFIG.national;
  const regionsStr = h.regions.length > 0
    ? ` (${h.regions.map((r) => r.code).join(", ")})`
    : "";
  return (
    <div className={`grid ${COL} items-center px-md py-xs hover:bg-surface-soft sm:py-sm sm:px-lg ${border ? "border-t border-hairline" : ""}`}>
      {/* Tanggal */}
      <div>
        <p className="font-mono text-[10px] text-muted sm:text-caption">{getDayName(d)}</p>
        <p className="font-display text-[13px] font-semibold text-ink sm:text-body-sm">{formatDate(d)}</p>
      </div>
      {/* Nama */}
      <span className="font-display text-[12px] text-ink/70 sm:text-body-sm">
        {h.name}
        {regionsStr && (
          <span className="ml-1.5 font-mono text-[10px] text-badge-emerald bg-badge-emerald/10 px-1 py-[1px] rounded">
            {h.regions.map((r) => r.code).join(", ")}
          </span>
        )}
      </span>
      {/* Jenis */}
      <div className="flex justify-end">
        <Badge variant="outline" className={`text-[10px] px-[6px] py-[2px] sm:text-caption ${cfg.cls}`}>
          {cfg.label}
        </Badge>
      </div>
    </div>
  );
}

export default function YearHolidayList({ year, holidays }: Props) {
  const list = holidays
    .filter((h) => h.type === "national" || h.type === "joint-leave" || h.type === "regional")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (list.length === 0) return null;

  // Group holidays by date, name, type
  const groupedList: GroupedHoliday[] = [];
  for (const h of list) {
    const dStr = new Date(h.date).toISOString().slice(0, 10);
    const existing = groupedList.find(
      (item) =>
        new Date(item.date).toISOString().slice(0, 10) === dStr &&
        item.name === h.name &&
        item.type === h.type
    );
    if (existing) {
      if (h.regionCode) {
        existing.regions.push({ code: h.regionCode, name: h.regionName });
      }
    } else {
      groupedList.push({
        ...h,
        regions: h.regionCode ? [{ code: h.regionCode, name: h.regionName }] : [],
      });
    }
  }

  const nationalCount = list.filter((h) => h.type === "national").length;
  const jointCount = list.filter((h) => h.type === "joint-leave").length;
  const regionalCount = groupedList.filter((h) => h.type === "regional").length;
  const first = groupedList[0];
  const last = groupedList[groupedList.length - 1];

  return (
    <section className="mt-xl sm:mt-xxl">
      {/* Heading */}
      <div className="mb-md sm:mb-lg">
        <h2 className="mb-xs font-display text-title-lg font-normal text-ink sm:text-headline">
          Daftar Hari Libur Tahun {year}
        </h2>
        <p className="font-display text-[12px] text-ink/60 sm:text-[13px]">
          Sepanjang tahun {year}, terdapat{" "}
          <strong className="font-semibold text-ink">{nationalCount} hari libur nasional</strong>
          {jointCount > 0 && (
            <>
              {" "}dan <strong className="font-semibold text-ink">{jointCount} cuti bersama</strong>
            </>
          )}
          {regionalCount > 0 && (
            <>
              {" "}dan <strong className="font-semibold text-ink">{regionalCount} hari libur regional</strong>
            </>
          )}
          {" "}yang ditetapkan pemerintah.{" "}
          Hari libur pertama jatuh pada{" "}
          <strong className="font-semibold text-ink">{formatDate(new Date(first.date))} ({first.name})</strong>{" "}
          dan terakhir pada{" "}
          <strong className="font-semibold text-ink">{formatDate(new Date(last.date))} ({last.name})</strong>.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-hairline">
        {/* Scrollable wrapper for mobile */}
        <div className="overflow-x-auto">
          <div className="min-w-[480px]">
            {/* Header */}
            <div className={`grid ${COL} bg-surface-soft px-md py-xs sm:py-sm sm:px-lg`}>
              {["Tanggal", "Nama", "Jenis"].map((label, i) => (
                <span
                  key={label}
                  className={`font-mono text-[10px] uppercase tracking-widest text-ink/50 sm:text-caption ${i === 2 ? "text-right" : ""}`}
                >
                  {label}
                </span>
              ))}
            </div>

            {/* Rows */}
            {groupedList.map((h, i) => (
              <HolidayRow key={`${new Date(h.date).toISOString().slice(0, 10)}_${h.name}_${h.type}`} h={h} border={i > 0} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

