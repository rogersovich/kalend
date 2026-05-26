import Link from "next/link";
import { HolidayData } from "@/lib/calendar/holidays";
import { MONTH_NAMES_ID, DAY_NAMES_ID } from "@/lib/calendar/constants";
import { cn } from "@/lib/utils";

interface MiniCalendarSidebarProps {
  activeDate: Date;
  holidays: HolidayData[];
  country: string;
}

function buildMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: Array<{ date: Date | null }> = [];
  for (let i = 0; i < firstDay; i++) cells.push({ date: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ date: new Date(year, month - 1, d) });
  const total = cells.length <= 35 ? 35 : 42;
  while (cells.length < total) cells.push({ date: null });
  return cells;
}

export default function MiniCalendarSidebar({
  activeDate,
  holidays,
  country,
}: MiniCalendarSidebarProps) {
  const year = activeDate.getFullYear();
  const month = activeDate.getMonth() + 1;
  const cells = buildMonthDays(year, month);
  const monthSlug = MONTH_NAMES_ID[month - 1].toLowerCase();
  const qs = country !== "ID" ? `?country=${country}` : "";

  const holidayDates = new Set(
    holidays.map((h) => {
      const d = new Date(h.date);
      return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
    })
  );

  return (
    <div className="rounded-lg bg-block-cream p-md">
      <p className="mb-sm text-center font-mono text-caption uppercase tracking-widest text-ink/60">
        {MONTH_NAMES_ID[month - 1]} {year}
      </p>

      <div className="mb-xs grid grid-cols-7">
        {DAY_NAMES_ID.map((d) => (
          <div key={d} className="text-center font-mono text-[9px] font-medium text-ink/50">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          if (!cell.date) return <div key={i} className="h-6" />;

          const d = cell.date;
          const isActive = d.getDate() === activeDate.getDate();
          const dayStr = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
          const isHoliday = holidayDates.has(dayStr);
          const isWeekend = d.getDay() === 0 || d.getDay() === 6;

          return (
            <Link
              key={i}
              href={`/${year}/${monthSlug}/${d.getDate()}${qs}`}
              className={cn(
                "flex h-6 w-full items-center justify-center rounded-full font-mono text-[11px] transition-colors",
                isActive && "bg-primary text-white font-semibold",
                !isActive && isHoliday && "text-error font-semibold",
                !isActive && isWeekend && !isHoliday && "text-ink/40",
                !isActive && !isHoliday && !isWeekend && "text-ink",
                !isActive && "hover:bg-black/10"
              )}
            >
              {d.getDate()}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
