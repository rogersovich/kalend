import Link from "next/link";
import { HolidayData } from "@/lib/calendar/holidays";
import { MONTH_NAMES_ID, DAY_NAMES_ID } from "@/lib/calendar/constants";
import DayCell from "./DayCell";

export type EventEntry = { color: string; title: string };

interface MonthMiniProps {
  year: number;
  month: number; // 1-12
  holidays: HolidayData[];
  country: string;
  eventMap?: Map<string, EventEntry[]>;
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

function toLocalDateStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getHolidaysForDate(holidays: HolidayData[], date: Date): HolidayData[] {
  const ds = toLocalDateStr(date);
  return holidays.filter((h) => toLocalDateStr(new Date(h.date)) === ds);
}

const today = new Date();
today.setHours(0, 0, 0, 0);

interface MonthItem {
  date: Date;
  label: string;
  kind: "national" | "joint-leave" | "regional" | "event";
  color?: string;
}

const MAX_VISIBLE = 5;

export default function MonthMini({ year, month, holidays, country, eventMap }: MonthMiniProps) {
  const cells = buildMonthDays(year, month);
  const monthName = MONTH_NAMES_ID[month - 1];
  const countryParam = country === "ID" ? "" : `?country=${country}`;
  const monthSlug = monthName.toLowerCase();

  // Build sorted list of all holidays + events for this month
  const items: MonthItem[] = [];
  for (const h of holidays) {
    const d = new Date(h.date);
    if (d.getMonth() + 1 === month && d.getFullYear() === year) {
      items.push({ date: d, label: h.name, kind: h.type as MonthItem["kind"] });
    }
  }
  if (eventMap) {
    const prefix = `${year}-${String(month).padStart(2, "0")}`;
    for (const [ds, evs] of eventMap.entries()) {
      if (!ds.startsWith(prefix)) continue;
      const d = new Date(ds);
      for (const ev of evs) {
        items.push({ date: d, label: ev.title, kind: "event", color: ev.color });
      }
    }
  }
  items.sort((a, b) => a.date.getTime() - b.date.getTime());

  const visible = items.slice(0, MAX_VISIBLE);
  const overflow = items.length - MAX_VISIBLE;

  return (
    <div className="rounded-lg border border-hairline bg-canvas p-2 transition-all hover:border-brand-accent/30 hover:shadow-soft sm:p-3">
      <Link
        href={`/${year}/${monthSlug}${countryParam}`}
        className="mb-2 block text-center text-[13px] font-bold text-ink transition-colors hover:text-accent-magenta sm:mb-3 sm:text-[15px]"
      >
        {monthName}
      </Link>

      {/* Day headers */}
      <div className="mb-1 grid grid-cols-7">
        {DAY_NAMES_ID.map((d) => (
          <div key={d} className="text-center text-[9px] sm:text-[11px] font-medium uppercase text-muted">
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
          const ds = toLocalDateStr(cell.date);
          const dayEvents = cell.inMonth ? (eventMap?.get(ds) ?? []) : [];
          const dayHref = cell.inMonth
            ? `/${year}/${monthSlug}/${cell.date.getDate()}${countryParam}`
            : undefined;
          return (
            <DayCell
              key={i}
              date={cell.date}
              holidays={dayHolidays}
              isCurrentMonth={cell.inMonth}
              isToday={isToday}
              size="mini"
              events={dayEvents}
              href={dayHref}
            />
          );
        })}
      </div>

      {/* Event/holiday list */}
      {items.length > 0 && (
        <div className="mt-2 flex flex-col gap-[8px] border-t border-hairline pt-2">
          {visible.map((item, i) => (
            <div key={i} className="flex items-start gap-[5px]">
              <span
                className={`mt-[3px] h-[6px] w-[6px] shrink-0 rounded-full ${
                  item.kind === "event"
                    ? ""
                    : item.kind === "national"
                    ? "bg-error"
                    : item.kind === "joint-leave"
                    ? "bg-badge-orange"
                    : "bg-ink/30"
                }`}
                style={item.kind === "event" && item.color ? { backgroundColor: item.color } : undefined}
              />
              <span className="min-w-0 truncate font-mono text-[11px] leading-tight text-ink/70 sm:text-[12px]">
                <span className="font-medium text-ink/40">{item.date.getDate()} · </span>
                {item.label}
              </span>
            </div>
          ))}
          {overflow > 0 && (
            <span className="font-mono text-[11px] sm:text-[12px] text-ink/40 sm:text-[10px]">+{overflow} lainnya</span>
          )}
        </div>
      )}
    </div>
  );
}
