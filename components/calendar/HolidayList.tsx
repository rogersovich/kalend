import { HolidayData } from "@/lib/calendar/holidays";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";
import { Badge } from "@/components/ui/badge";

interface HolidayListProps {
  holidays: HolidayData[];
  month?: number;
}

const TYPE_LABEL: Record<string, { label: string; className: string }> = {
  national: {
    label: "Libur Nasional",
    className: "bg-error text-white border-error/20",
  },
  "joint-leave": {
    label: "Cuti Bersama",
    className: "bg-badge-orange text-white border-badge-orange/20",
  },
  regional: {
    label: "Libur Daerah",
    className: "bg-badge-emerald text-white border-badge-emerald/20",
  },
};

function formatDate(date: Date, month?: number): string {
  const d = new Date(date);
  const day = d.getDate();
  const m = MONTH_NAMES_ID[d.getMonth()];
  if (month !== undefined) return `${day} ${m}`;
  return `${day} ${m} ${d.getFullYear()}`;
}

export default function HolidayList({ holidays, month }: HolidayListProps) {
  if (holidays.length === 0) {
    return (
      <p className="text-body-sm text-muted italic">
        Tidak ada hari libur{month ? ` bulan ini` : ""}.
      </p>
    );
  }

  // Group holidays by date, name, type
  const groupedList: Array<HolidayData & { regions: Array<{ code: string; name: string | null }> }> = [];
  for (const h of holidays) {
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

  return (
    <ul className="flex flex-col gap-md">
      {groupedList.map((h) => {
        const meta = TYPE_LABEL[h.type] ?? TYPE_LABEL.national;
        const regionsStr = h.regions.length > 0
          ? ` (${h.regions.map((r) => r.code).join(", ")})`
          : "";
        return (
          <li key={`${new Date(h.date).toISOString().slice(0, 10)}_${h.name}_${h.type}`} className="flex flex-col gap-[4px]">
            <div className="flex items-start justify-between gap-xs">
              <span className="text-[13px] font-medium text-ink leading-snug">
                {h.name}
                {regionsStr && (
                  <span className="ml-1.5 font-mono text-[10px] text-badge-emerald bg-badge-emerald/10 px-1 py-[1px] rounded">
                    {h.regions.map((r) => r.code).join(", ")}
                  </span>
                )}
              </span>
              <Badge
                variant="outline"
                className={`shrink-0 text-[10px] px-[6px] py-[2px] ${meta.className}`}
              >
                {meta.label}
              </Badge>
            </div>
            <span className="text-caption text-muted">
              {formatDate(h.date, month)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
