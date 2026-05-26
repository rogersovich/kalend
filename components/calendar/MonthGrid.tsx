"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HolidayData } from "@/lib/calendar/holidays";
import { DAY_NAMES_ID, MONTH_NAMES_ID } from "@/lib/calendar/constants";
import DayCell from "./DayCell";
import { createClient } from "@/lib/supabase/client";

interface MonthGridProps {
  year: number;
  month: number;
  holidays: HolidayData[];
  country: string;
}


function buildMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: Array<{ date: Date; inMonth: boolean }> = [];

  for (let i = 0; i < firstDay; i++) {
    cells.push({ date: new Date(year, month - 1, -(firstDay - 1 - i)), inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month - 1, d), inMonth: true });
  }
  const total = cells.length <= 35 ? 35 : 42;
  let nextDay = 1;
  while (cells.length < total) {
    cells.push({ date: new Date(year, month, nextDay++), inMonth: false });
  }
  return cells;
}

function getHolidaysForDate(holidays: HolidayData[], date: Date): HolidayData[] {
  const ds = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
  return holidays.filter((h) => {
    const hd = new Date(h.date);
    const hds = `${hd.getFullYear()}-${String(hd.getMonth()+1).padStart(2,"0")}-${String(hd.getDate()).padStart(2,"0")}`;
    return hds === ds;
  });
}

function toDateStr(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
}

const todayDate = new Date();

export default function MonthGrid({ year, month, holidays, country }: MonthGridProps) {
  const router = useRouter();
  const cells = buildMonthDays(year, month);
  const qs = country !== "ID" ? `?country=${country}` : "";
  const monthSlug = MONTH_NAMES_ID[month - 1].toLowerCase();
  const [userEventMap, setUserEventMap] = useState<Map<string, string[]>>(new Map());

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const res = await fetch("/api/events");
      if (!res.ok) return;
      const json = await res.json();
      const events: Array<{ date: string; color: string | null }> = json.data ?? [];

      const map = new Map<string, string[]>();
      for (const ev of events) {
        const ds = ev.date.slice(0, 10);
        const evDate = new Date(ds);
        if (evDate.getFullYear() === year && evDate.getMonth() + 1 === month) {
          const colors = map.get(ds) ?? [];
          colors.push(ev.color ?? "#6366f1");
          map.set(ds, colors);
        }
      }
      setUserEventMap(map);
    });
  }, [year, month]);

  function navigateToDay(date: Date) {
    const d = date.getDate();
    router.push(`/${year}/${monthSlug}/${d}${qs}`);
  }

  return (
    <div className="rounded-lg border border-hairline overflow-hidden">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-hairline bg-surface-soft">
        {DAY_NAMES_ID.map((d) => (
          <div
            key={d}
            className="py-xs text-center text-caption font-semibold uppercase text-muted"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, i) => {
          const isToday =
            cell.date.getDate() === todayDate.getDate() &&
            cell.date.getMonth() === todayDate.getMonth() &&
            cell.date.getFullYear() === todayDate.getFullYear();
          const dayHolidays = cell.inMonth ? getHolidaysForDate(holidays, cell.date) : [];
          const eventColors = cell.inMonth ? (userEventMap.get(toDateStr(cell.date)) ?? []) : [];

          return (
            <DayCell
              key={i}
              date={cell.date}
              holidays={dayHolidays}
              isCurrentMonth={cell.inMonth}
              isToday={isToday}
              showWeton={cell.inMonth}
              size="full"
              eventColors={eventColors}
              onClick={cell.inMonth ? () => navigateToDay(cell.date) : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
