import Link from "next/link";
import { HolidayData } from "@/lib/calendar/holidays";
import { MONTH_NAMES_ID, DAY_NAMES_ID } from "@/lib/calendar/constants";
import DayCell from "./DayCell";

interface MonthMiniProps {
  year: number;
  month: number; // 1-12
  holidays: HolidayData[];
  country: string;
}

function buildMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: Array<{ date: Date | null; inMonth: boolean }> = [];

  // Leading empty cells
  for (let i = 0; i < firstDay; i++) {
    const d = new Date(year, month - 1, -(firstDay - 1 - i));
    cells.push({ date: d, inMonth: false });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month - 1, d), inMonth: true });
  }

  // Trailing cells to complete 6 rows × 7 = 42 or 5 rows × 7 = 35
  const total = cells.length <= 35 ? 35 : 42;
  let nextDay = 1;
  while (cells.length < total) {
    cells.push({ date: new Date(year, month, nextDay++), inMonth: false });
  }

  return cells;
}

function getHolidaysForDate(holidays: HolidayData[], date: Date): HolidayData[] {
  const ds = date.toISOString().slice(0, 10);
  return holidays.filter((h) => h.date.toISOString().slice(0, 10) === ds);
}

const today = new Date();
today.setHours(0, 0, 0, 0);

export default function MonthMini({ year, month, holidays, country }: MonthMiniProps) {
  const cells = buildMonthDays(year, month);
  const monthName = MONTH_NAMES_ID[month - 1];
  const countryParam = country === "ID" ? "" : `?country=${country}`;
  const monthSlug = monthName.toLowerCase();

  return (
    <div className="rounded-lg border border-hairline bg-canvas p-3 hover:border-brand-accent/30 hover:shadow-soft transition-all">
      <Link
        href={`/${year}/${monthSlug}${countryParam}`}
        className="mb-3 block text-center text-body-sm font-semibold text-ink hover:text-brand-accent transition-colors"
      >
        {monthName}
      </Link>

      {/* Day headers */}
      <div className="mb-1 grid grid-cols-7">
        {DAY_NAMES_ID.map((d) => (
          <div key={d} className="text-center text-[9px] font-medium uppercase text-muted">
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          if (!cell.date) return <div key={i} />;
          const isToday = cell.date.getTime() === today.getTime();
          const dayHolidays = cell.inMonth ? getHolidaysForDate(holidays, cell.date) : [];
          return (
            <DayCell
              key={i}
              date={cell.date}
              holidays={dayHolidays}
              isCurrentMonth={cell.inMonth}
              isToday={isToday}
              size="mini"
            />
          );
        })}
      </div>
    </div>
  );
}
