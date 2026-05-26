import Link from "next/link";
import { LongWeekendPeriod, DayType } from "@/lib/calendar/longweekend";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";
import { cn } from "@/lib/utils";

interface LongWeekendListProps {
  periods: LongWeekendPeriod[];
  country: string;
  minDays: number;
}

const DAY_TYPE_CONFIG: Record<DayType, { label: string; className: string }> = {
  holiday: { label: "Libur", className: "bg-error/15 text-error border-error/20" },
  "joint-leave": { label: "Cuti", className: "bg-badge-orange/15 text-badge-orange border-badge-orange/20" },
  weekend: { label: "Weekend", className: "bg-surface-strong text-muted border-hairline" },
  workday: { label: "Kerja", className: "bg-surface-soft text-muted border-hairline" },
};

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
      <p className="py-xl text-center text-body-md text-muted">
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
          <div key={i} className="rounded-lg border border-hairline bg-canvas p-lg hover:border-brand-accent/30 hover:shadow-soft transition-all">
            <div className="mb-md flex items-start justify-between gap-md">
              <div>
                <Link href={dayLink} className="font-display text-title-md font-semibold text-ink hover:text-brand-accent transition-colors">
                  {period.totalDays} hari
                </Link>
                <p className="text-body-sm text-muted">{formatRange(period.startDate, period.endDate)}</p>
              </div>
              <div className="flex flex-col items-end gap-xs">
                {period.holidays.length > 0 && (
                  <span className="text-caption text-muted">{period.holidays.length} libur nasional</span>
                )}
                {period.jointLeaves.length > 0 && (
                  <span className="text-caption text-muted">{period.jointLeaves.length} cuti bersama</span>
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
                      "flex flex-col items-center rounded-md border px-[6px] py-[3px] text-center",
                      cfg.className
                    )}
                  >
                    <span className="text-[9px] font-medium leading-none">{cfg.label}</span>
                    <span className="font-mono text-[11px] font-semibold leading-none mt-[2px]">
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
