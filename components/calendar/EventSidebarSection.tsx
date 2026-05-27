"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";
import AddEventButton from "./AddEventButton";

interface UserEvent {
  id: string;
  title: string;
  date: string;
  endDate: string | null;
  color: string | null;
  note: string | null;
}

interface EventSidebarSectionProps {
  year: number;
  month: number;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTH_NAMES_ID[d.getMonth()]}`;
}

export default function EventSidebarSection({ year, month }: EventSidebarSectionProps) {
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  const fetchEvents = useCallback(async () => {
    const res = await fetch("/api/events");
    if (!res.ok) return;
    const json = await res.json();
    const all: UserEvent[] = json.data ?? [];
    const filtered = all.filter((ev) => {
      const d = new Date(ev.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });
    setEvents(filtered);
    setLoggedIn(true);
  }, [year, month]);

  useEffect(() => {
    // Check auth first — if 401 or no data, user not logged in
    fetch("/api/events")
      .then((res) => {
        if (res.status === 401) { setLoggedIn(false); return null; }
        return res.json();
      })
      .then((json) => {
        if (!json) return;
        const all: UserEvent[] = json.data ?? [];
        const filtered = all.filter((ev) => {
          const d = new Date(ev.date);
          return d.getFullYear() === year && d.getMonth() + 1 === month;
        });
        setEvents(filtered);
        setLoggedIn(true);
      })
      .catch(() => setLoggedIn(false));
  }, [year, month]);

  return (
    <div className="rounded-lg bg-block-cream p-lg">
      <h3 className="mb-sm font-mono text-caption uppercase tracking-widest text-ink/60">
        Event Saya
      </h3>

      {/* Event list */}
      {loggedIn && events.length > 0 && (
        <ul className="mb-md flex flex-col gap-xs">
          {events.map((ev) => (
            <li key={ev.id} className="flex items-start gap-xs">
              <span
                className="mt-[5px] h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: ev.color ?? "#6366f1" }}
              />
              <div className="min-w-0">
                <p className="truncate font-display text-body-sm font-medium text-ink">
                  {ev.title}
                </p>
                <p className="font-mono text-caption text-ink/50">
                  {formatDate(ev.date)}
                  {ev.endDate && ev.endDate.slice(0, 10) !== ev.date.slice(0, 10)
                    ? ` – ${formatDate(ev.endDate)}`
                    : ""}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Empty state — only show if logged in */}
      {loggedIn && events.length === 0 && (
        <div className="mb-md flex items-center gap-xs text-ink/40">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <p className="font-display text-body-sm">Belum ada event bulan ini</p>
        </div>
      )}

      <AddEventButton onSuccess={fetchEvents} />
    </div>
  );
}
