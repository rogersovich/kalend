import { HolidayData } from "@/lib/calendar/holidays";
import { DAY_NAMES_FULL_ID, MONTH_NAMES_ID } from "@/lib/calendar/constants";

interface DayHeroProps {
  date: Date;
  holidays: HolidayData[];
}

function getBg(holidays: HolidayData[]): string {
  if (holidays.some((h) => h.type === "national")) return "bg-block-coral";
  if (holidays.some((h) => h.type === "joint-leave")) return "bg-block-cream";
  return "bg-block-mint";
}

export default function DayHero({ date, holidays }: DayHeroProps) {
  const dayName = DAY_NAMES_FULL_ID[date.getDay()];
  const day = date.getDate();
  const monthName = MONTH_NAMES_ID[date.getMonth()];
  const year = date.getFullYear();

  const nationalHoliday = holidays.find((h) => h.type === "national");
  const jointLeave = holidays.find((h) => h.type === "joint-leave");
  const holidayName = nationalHoliday?.name ?? jointLeave?.name ?? null;
  const holidayType = nationalHoliday
    ? "Hari Libur Nasional"
    : jointLeave
    ? "Cuti Bersama"
    : null;

  return (
    <div className={`${getBg(holidays)} rounded-lg p-xxl`}>
      <p className="mb-sm font-mono text-eyebrow uppercase tracking-widest text-ink/60">
        {holidayType ?? dayName}
      </p>
      <h1 className="font-display text-display-lg font-normal text-ink">
        {day} {monthName} {year}
      </h1>
      {holidayName && (
        <p className="mt-sm font-display text-headline text-ink">{holidayName}</p>
      )}
      {!holidayName && (
        <p className="mt-sm font-display text-body-lg text-ink">{dayName}</p>
      )}
    </div>
  );
}
