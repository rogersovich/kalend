"use client";

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

const MONTH_COLORS: Record<number, string> = {
  1:  "bg-block-cream",
  2:  "bg-block-pink",
  3:  "bg-block-mint",
  4:  "bg-block-lime",
  5:  "bg-block-mint",
  6:  "bg-block-lilac",
  7:  "bg-block-coral",
  8:  "bg-block-coral",
  9:  "bg-block-cream",
  10: "bg-block-lime",
  11: "bg-block-lilac",
  12: "bg-block-pink",
};


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
  const cells = buildMonthDays(year, month);
  const qs = country !== "ID" ? `?country=${country}` : "";
  const monthSlug = MONTH_NAMES_ID[month - 1].toLowerCase();
  const [userEventMap, setUserEventMap] = useState<Map<string, { color: string; title: string }[]>>(new Map());

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const res = await fetch("/api/events");
      if (!res.ok) return;
      const json = await res.json();
      const events: Array<{ date: string; color: string | null; title: string }> = json.data ?? [];

      const map = new Map<string, { color: string; title: string }[]>();
      for (const ev of events) {
        const ds = ev.date.slice(0, 10);
        const evDate = new Date(ds);
        if (evDate.getFullYear() === year && evDate.getMonth() + 1 === month) {
          const arr = map.get(ds) ?? [];
          arr.push({ color: ev.color ?? "#6366f1", title: ev.title });
          map.set(ds, arr);
        }
      }
      setUserEventMap(map);
    });
  }, [year, month]);

const headerBg = MONTH_COLORS[month];

  return (
    <div className="overflow-hidden rounded-lg border border-hairline">
      {/* Day headers */}
      <div className={`grid grid-cols-7 border-b border-hairline ${headerBg}`}>
        {DAY_NAMES_ID.map((d) => (
          <div
            key={d}
            className="py-sm text-center font-mono text-caption font-semibold uppercase tracking-widest text-ink"
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
          const dayEvents = cell.inMonth ? (userEventMap.get(toDateStr(cell.date)) ?? []) : [];

          const dayHref = cell.inMonth
            ? `/${year}/${monthSlug}/${cell.date.getDate()}${qs}`
            : undefined;
          return (
            <DayCell
              key={i}
              date={cell.date}
              holidays={dayHolidays}
              isCurrentMonth={cell.inMonth}
              isToday={isToday}
              showWeton={cell.inMonth}
              size="full"
              events={dayEvents}
              isLastRow={i >= cells.length - 7}
              isLastCol={i % 7 === 6}
              href={dayHref}
            />
          );
        })}
      </div>
    </div>
  );
}
