import { HolidayData } from "@/lib/calendar/holidays";
import { MONTH_NAMES_ID, DAY_NAMES_ID, DAY_NAMES_FULL_ID } from "@/lib/calendar/constants";
import { calculateLongWeekends, LongWeekendPeriod } from "@/lib/calendar/longweekend";
import { Badge } from "@/components/ui/badge";

interface Props {
  year: number;
  holidays: HolidayData[];
}

function toDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatDateRange(start: Date, end: Date) {
  const s = start.getDate();
  const e = end.getDate();
  const sm = MONTH_NAMES_ID[start.getMonth()];
  const em = MONTH_NAMES_ID[end.getMonth()];
  const yr = end.getFullYear();
  if (start.getMonth() === end.getMonth()) return `${s} - ${e} ${sm} ${yr}`;
  return `${s} ${sm} - ${e} ${em} ${yr}`;
}

function PeriodCard({
  period,
  holidayMap,
}: {
  period: LongWeekendPeriod;
  holidayMap: Map<string, HolidayData[]>;
}) {
  const hasWeekend = period.days.some((d) => d.type === "weekend");
  const hasSat = period.days.some((d) => d.type === "weekend" && d.date.getDay() === 6);
  const hasSun = period.days.some((d) => d.type === "weekend" && d.date.getDay() === 0);
  const weekendNote = hasSat && hasSun ? "*termasuk Sabtu & Minggu" : hasSat ? "*termasuk Sabtu" : hasSun ? "*termasuk Minggu" : null;

  return (
    <div className="rounded-lg border border-hairline bg-canvas">
      {/* Card header */}
      <div className="flex items-center justify-between gap-sm px-md py-sm sm:px-lg">
        <div className="flex flex-col gap-[2px]">
          <span className="font-display text-[13px] font-semibold text-ink sm:text-body-sm">
            {formatDateRange(period.startDate, period.endDate)}
          </span>
          {hasWeekend && weekendNote && (
            <span className="font-mono text-[10px] text-muted sm:text-caption">{weekendNote}</span>
          )}
        </div>
        <span className="shrink-0 rounded-pill bg-ink px-sm py-xxs font-mono text-[10px] font-medium text-white sm:text-caption">
          {period.totalDays} hari
        </span>
      </div>

      {/* Day rows */}
      <div className="border-t border-hairline">
        {period.days.map((day, i) => {
          const ds = toDateStr(day.date);
          const dayHolidays = holidayMap.get(ds) ?? [];
          const national = dayHolidays.find((h) => h.type === "national");
          const joint = dayHolidays.find((h) => h.type === "joint-leave");

          let dot = "bg-surface-strong border border-hairline";
          let name: string;
          let badgeCls: string | null = null;
          let typeLabel: string | null = null;

          if (day.type === "holiday" && national) {
            dot = "bg-error";
            name = national.name;
            badgeCls = "bg-error/10 text-error border-error/20";
            typeLabel = "Libur";
          } else if (day.type === "joint-leave" && joint) {
            dot = "bg-badge-orange";
            name = joint.name;
            badgeCls = "bg-badge-orange/10 text-badge-orange border-badge-orange/20";
            typeLabel = "Cuti";
          } else {
            name = DAY_NAMES_FULL_ID[day.date.getDay()];
          }

          return (
            <div
              key={ds}
              className={`flex items-center gap-sm px-md py-xs sm:px-lg sm:py-sm ${i > 0 ? "border-t border-hairline" : ""}`}
            >
              <span className="w-[28px] shrink-0 font-mono text-[10px] text-muted sm:w-[32px] sm:text-caption">
                {DAY_NAMES_ID[day.date.getDay()]}
              </span>
              <span className="w-[20px] shrink-0 font-display text-[13px] font-semibold text-ink sm:w-[24px] sm:text-body-sm">
                {day.date.getDate()}
              </span>
              <span className={`h-[6px] w-[6px] shrink-0 rounded-full ${dot}`} />
              <span className="min-w-0 flex-1 font-display text-[12px] text-ink/70 sm:text-body-sm">
                {name}
              </span>
              {typeLabel && badgeCls && (
                <Badge variant="outline" className={`shrink-0 text-[10px] px-[6px] py-[2px] sm:text-caption ${badgeCls}`}>
                  {typeLabel}
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function YearLongWeekendList({ year, holidays }: Props) {
  const periods = calculateLongWeekends(year, holidays, 3);
  if (periods.length === 0) return null;

  // Build holidayMap for lookup
  const holidayMap = new Map<string, HolidayData[]>();
  for (const h of holidays) {
    const key = toDateStr(new Date(h.date));
    holidayMap.set(key, [...(holidayMap.get(key) ?? []), h]);
  }

  const longest = periods.reduce((a, b) => (b.totalDays > a.totalDays ? b : a));
  const longestHolidays = [
    ...longest.holidays.map((h) => h.name),
    ...longest.jointLeaves.map((h) => h.name),
  ];

  return (
    <section className="mt-xl sm:mt-xxl">
      {/* Heading */}
      <div className="mb-md sm:mb-lg">
        <h2 className="mb-xs font-display text-title-lg font-normal text-ink sm:text-headline">
          Daftar Libur Panjang Tahun {year}
        </h2>
        <p className="font-display text-[12px] text-ink/60 sm:text-[13px]">
          Tahun {year} memiliki{" "}
          <strong className="font-semibold text-ink">{periods.length} periode libur panjang</strong>.{" "}
          <strong className="font-semibold text-ink">
            Libur panjang terpanjang berlangsung selama {longest.totalDays} hari
          </strong>
          , dari{" "}
          <strong className="font-semibold text-ink">
            {formatDateRange(longest.startDate, longest.endDate)}
          </strong>
          {longestHolidays.length > 0 && (
            <>
              , mencakup{" "}
              {longestHolidays.map((name, i) => (
                <span key={i}>
                  {i > 0 && i < longestHolidays.length - 1 && ", "}
                  {i > 0 && i === longestHolidays.length - 1 && " dan "}
                  <strong className="font-semibold text-ink">{name}</strong>
                </span>
              ))}
            </>
          )}
          . Setiap periode di bawah menampilkan susunan hari lengkap untuk membantu Anda merencanakan liburan dan pengajuan cuti.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-md sm:grid-cols-2 sm:gap-lg">
        {periods.map((period, i) => (
          <PeriodCard key={i} period={period} holidayMap={holidayMap} />
        ))}
      </div>
    </section>
  );
}
