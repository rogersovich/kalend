import { HolidayData } from "@/lib/calendar/holidays";
import { DAY_NAMES_FULL_ID, MONTH_NAMES_ID } from "@/lib/calendar/constants";
import { Badge } from "@/components/ui/badge";

interface DayHeroProps {
  date: Date;
  holidays: HolidayData[];
}

export default function DayHero({ date, holidays }: DayHeroProps) {
  const dayName = DAY_NAMES_FULL_ID[date.getDay()];
  const day = date.getDate();
  const monthName = MONTH_NAMES_ID[date.getMonth()];
  const year = date.getFullYear();

  const nationalHoliday = holidays.find((h) => h.type === "national");
  const jointLeave = holidays.find((h) => h.type === "joint-leave");

  return (
    <div className="rounded-xl border border-hairline bg-canvas p-xl">
      <div className="flex flex-wrap items-start gap-sm">
        {nationalHoliday && (
          <Badge className="bg-error/10 text-error border-error/20" variant="outline">
            🔴 Hari Libur Nasional
          </Badge>
        )}
        {jointLeave && (
          <Badge className="bg-badge-orange/10 text-badge-orange border-badge-orange/20" variant="outline">
            🟠 Cuti Bersama
          </Badge>
        )}
      </div>

      <h1 className="mt-sm font-display text-display-md font-semibold text-ink">
        {dayName}, {day} {monthName} {year}
      </h1>

      {nationalHoliday && (
        <p className="mt-xs text-title-md text-muted">{nationalHoliday.name}</p>
      )}
      {!nationalHoliday && jointLeave && (
        <p className="mt-xs text-title-md text-muted">{jointLeave.name}</p>
      )}
    </div>
  );
}
