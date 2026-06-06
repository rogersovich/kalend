"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import AddEventButton from "./AddEventButton";

interface UserEvent {
  id: string;
  title: string;
  date: string;
  endDate: string | null;
  color: string | null;
  note: string | null;
}

interface DateEventSectionProps {
  dateStr: string; // YYYY-MM-DD
}

export default function DateEventSection({ dateStr }: DateEventSectionProps) {
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  const fetchEvents = useCallback(async () => {
    const res = await fetch("/api/events");
    if (!res.ok) return;
    const json = await res.json();
    const all: UserEvent[] = json.data ?? [];
    const filtered = all.filter((ev) => ev.date.slice(0, 10) === dateStr);
    setEvents(filtered);
    setLoggedIn(true);
  }, [dateStr]);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => {
        if (res.status === 401) {
          setLoggedIn(false);
          return null;
        }
        return res.json();
      })
      .then((json) => {
        if (!json) return;
        const all: UserEvent[] = json.data ?? [];
        const filtered = all.filter((ev) => ev.date.slice(0, 10) === dateStr);
        setEvents(filtered);
        setLoggedIn(true);
      })
      .catch(() => setLoggedIn(false));
  }, [dateStr]);

  return (
    <div className="rounded-lg border border-hairline bg-canvas p-lg">
      <h3 className="mb-sm font-mono text-caption uppercase tracking-widest text-muted">
        Event Saya
      </h3>

      {/* Login invitation */}
      {loggedIn === false && (
        <p className="mb-md font-display text-body-sm text-muted">
          Login untuk menambah event pribadi di tanggal ini.
        </p>
      )}

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
                {ev.note && (
                  <p className="truncate font-display text-[11px] text-muted">
                    {ev.note}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Empty state */}
      {loggedIn && events.length === 0 && (
        <div className="mb-md flex items-center gap-xs text-ink/40">
          <CalendarDays className="h-4 w-4 shrink-0" />
          <p className="font-display text-body-sm">Belum ada event di tanggal ini</p>
        </div>
      )}

      {loggedIn && (
        <AddEventButton onSuccess={fetchEvents} defaultDate={dateStr} />
      )}
    </div>
  );
}
