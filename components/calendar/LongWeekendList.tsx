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
const DAY_TYPE_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dateBg: string; dateText: string }
> = {
  national: {
    label: "Libur",
    bg: "bg-error",
    text: "text-white",
    dateBg: "bg-white/90",
    dateText: "text-error",
  },
  "joint-leave": {
    label: "Cuti",
    bg: "bg-badge-orange",
    text: "text-white",
    dateBg: "bg-white/90",
    dateText: "text-badge-orange",
  },
  regional: {
    label: "Regional",
    bg: "bg-badge-emerald",
    text: "text-white",
    dateBg: "bg-white/90",
    dateText: "text-badge-emerald",
  },
  weekend: {
    label: "Weekend",
    bg: "bg-badge-orange",
    text: "text-white",
    dateBg: "bg-canvas",
    dateText: "text-badge-orange",
  },
  workday: {
    label: "Kerja",
    bg: "bg-black/5",
    text: "text-ink/50",
    dateBg: "bg-canvas",
    dateText: "text-ink/50",
  },
};

// Card bg by period length — longer = more saturated block
function getPeriodBg(totalDays: number): string {
  if (totalDays >= 5) return "bg-block-lime";
  if (totalDays >= 4) return "bg-block-lilac";
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

export default function LongWeekendList({
  periods,
  country,
  minDays,
}: LongWeekendListProps) {
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
        const monthSlug =
          MONTH_NAMES_ID[period.startDate.getMonth()].toLowerCase();
        const dayLink = `/${year}/${monthSlug}/${period.startDate.getDate()}${qs}`;

        const nationalHolidays = period.holidays.filter(
          (h) => h.type === "national",
        );
        const regionalHolidays = period.holidays.filter(
          (h) => h.type === "regional",
        );

        return (
          <div
            key={i}
            className={`${getPeriodBg(period.totalDays)} rounded-lg p-md sm:p-lg`}
          >
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
              <div className="flex flex-col items-end gap-[2px]">
                {nationalHolidays.length > 0 && (
                  <span className="font-mono text-caption text-ink/60">
                    {nationalHolidays.length} libur nasional
                  </span>
                )}
                {regionalHolidays.length > 0 && (
                  <span className="font-mono text-caption text-ink/60">
                    {regionalHolidays.length} libur daerah
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
            <div className="flex flex-wrap gap-xs">
              {period.days.map((day, j) => {
                const typeKey =
                  day.type === "holiday"
                    ? (day.holiday?.type ?? "national")
                    : day.type;
                const cfg = DAY_TYPE_CONFIG[typeKey] ?? DAY_TYPE_CONFIG.weekend;
                const dateLabel = `${day.date.getDate()} ${MONTH_NAMES_ID[day.date.getMonth()]}`;

                // Show region code inline inside chip title/tooltip if it's regional
                const chipLabel =
                  typeKey === "regional" && day.holiday?.regionCode
                    ? `${cfg.label} (${day.holiday.regionCode})`
                    : cfg.label;

                return (
                  <span
                    key={j}
                    title={`${dateLabel} — ${chipLabel}`}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full pl-2.5 pr-1 py-1 text-center shadow-sm border border-black/5",
                      cfg.bg,
                      cfg.text,
                    )}
                  >
                    <span className="text-[10px] font-semibold tracking-wide leading-none">
                      {chipLabel}
                    </span>
                    <span
                      className={cn(
                        "flex h-[18px] w-[18px] items-center justify-center rounded-full font-mono text-[9px] font-bold leading-none",
                        cfg.dateBg,
                        cfg.dateText,
                      )}
                    >
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
