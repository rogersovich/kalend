import Link from "next/link";
import { LongWeekendPeriod, DayType } from "@/lib/calendar/longweekend";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";
import { cn } from "@/lib/utils";

interface LongWeekendListProps {
  periods: LongWeekendPeriod[];
  country: string;
  minDays: number;
}

// Day type chips — functional colors kept (red=holiday, orange=cuti is meaningful info)
const DAY_TYPE_CONFIG: Record<DayType, { label: string; className: string }> = {
  holiday:      { label: "Libur",   className: "bg-error/15 text-error" },
  "joint-leave":{ label: "Cuti",    className: "bg-badge-orange/15 text-badge-orange" },
  weekend:      { label: "Weekend", className: "bg-black/8 text-ink" },
  workday:      { label: "Kerja",   className: "bg-black/5 text-ink/50" },
};

// Card bg by period length — longer = more saturated block
function getPeriodBg(totalDays: number): string {
  if (totalDays >= 5) return "bg-block-lime";
  if (totalDays >= 4) return "bg-block-mint";
  return "bg-block-cream";
}

function formatRange(start: Date, end: Date): string {
  const sDay = start.getDate();
  const sMonth = MONTH_NAMES_ID[start.getMonth()];
  const eDay = end.getDate();
  const eMonth = MONTH_NAMES_ID[end.getMonth()];
  const eYear = end.getFullYear();

  if (start.getMonth() === end.getMonth()) {
    return `${sDay}–${eDay} ${sMonth} ${eYear}`;
  }
  return `${sDay} ${sMonth} – ${eDay} ${eMonth} ${eYear}`;
}

export default function LongWeekendList({ periods, country, minDays }: LongWeekendListProps) {
  const filtered = periods.filter((p) => p.totalDays >= minDays);
  const qs = country !== "ID" ? `?country=${country}` : "";

  if (filtered.length === 0) {
    return (
      <p className="py-xl text-center font-display text-body text-ink">
        Tidak ada long weekend dengan minimal {minDays} hari.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-md">
      {filtered.map((period, i) => {
        const year = period.startDate.getFullYear();
        const monthSlug = MONTH_NAMES_ID[period.startDate.getMonth()].toLowerCase();
        const dayLink = `/${year}/${monthSlug}/${period.startDate.getDate()}${qs}`;

        return (
          <div key={i} className={`${getPeriodBg(period.totalDays)} rounded-lg p-md sm:p-lg`}>
            <div className="mb-sm flex items-start justify-between gap-sm sm:mb-md sm:gap-md">
              <div>
                <Link
                  href={dayLink}
                  className="font-display text-headline font-normal text-ink transition-opacity hover:opacity-70 sm:text-display-sm"
                >
                  {period.totalDays} hari
                </Link>
                <p className="font-display text-body-sm text-ink">
                  {formatRange(period.startDate, period.endDate)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-xs">
                {period.holidays.length > 0 && (
                  <span className="font-mono text-caption text-ink/60">
                    {period.holidays.length} libur nasional
                  </span>
                )}
                {period.jointLeaves.length > 0 && (
                  <span className="font-mono text-caption text-ink/60">
                    {period.jointLeaves.length} cuti bersama
                  </span>
                )}
              </div>
            </div>

            {/* Day breakdown */}
            <div className="flex flex-wrap gap-[3px]">
              {period.days.map((day, j) => {
                const cfg = DAY_TYPE_CONFIG[day.type];
                const dateLabel = `${day.date.getDate()} ${MONTH_NAMES_ID[day.date.getMonth()]}`;
                return (
                  <span
                    key={j}
                    title={`${dateLabel} — ${cfg.label}`}
                    className={cn(
                      "flex flex-col items-center rounded-md px-[6px] py-[3px] text-center",
                      cfg.className
                    )}
                  >
                    <span className="text-[9px] font-medium leading-none">{cfg.label}</span>
                    <span className="mt-[2px] font-mono text-[11px] font-semibold leading-none">
                      {day.date.getDate()}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
