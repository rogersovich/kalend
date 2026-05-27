"use client";

import { useEffect, useState } from "react";
import { HolidayData } from "@/lib/calendar/holidays";
import MonthMini, { EventEntry } from "./MonthMini";
import { createClient } from "@/lib/supabase/client";

interface YearGridClientProps {
  year: number;
  holidays: HolidayData[];
  country: string;
}

export default function YearGridClient({ year, holidays, country }: YearGridClientProps) {
  const [eventMap, setEventMap] = useState<Map<string, EventEntry[]>>(new Map());

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const res = await fetch("/api/events");
      if (!res.ok) return;
      const json = await res.json();
      const events: Array<{ date: string; color: string | null; title: string }> = json.data ?? [];

      const map = new Map<string, EventEntry[]>();
      for (const ev of events) {
        const ds = ev.date.slice(0, 10);
        if (!ds.startsWith(String(year))) continue;
        const arr = map.get(ds) ?? [];
        arr.push({ color: ev.color ?? "#6366f1", title: ev.title });
        map.set(ds, arr);
      }
      setEventMap(map);
    });
  }, [year]);

  return (
    <div className="grid grid-cols-1 gap-md sm:grid-cols-3 lg:grid-cols-3">
      {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
        const monthHolidays = holidays.filter((h) => {
          const d = new Date(h.date);
          return d.getMonth() + 1 === month && d.getFullYear() === year;
        });

        return (
          <MonthMini
            key={month}
            year={year}
            month={month}
            holidays={monthHolidays}
            country={country}
            eventMap={eventMap}
          />
        );
      })}
    </div>
  );
}
