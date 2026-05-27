"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, CalendarDays } from "lucide-react";
import { toast } from "sonner";
import EventForm from "@/components/dashboard/EventForm";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";

interface UserEvent {
  id: string;
  title: string;
  date: string;
  endDate: string | null;
  color: string | null;
  note: string | null;
}

type Mode = "list" | "create" | "edit";

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()} ${MONTH_NAMES_ID[d.getMonth()]} ${d.getFullYear()}`;
}

export default function EventsPage() {
  const [events, setEvents] = useState<UserEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("list");
  const [editing, setEditing] = useState<UserEvent | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/events");
    const json = await res.json();
    setEvents(json.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  async function handleCreate(data: { title: string; date: string; endDate: string; color: string; note: string }) {
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error ?? "Gagal membuat event");
    }
    await fetchEvents();
    setMode("list");
    toast.success("Event berhasil ditambahkan");
  }

  async function handleEdit(data: { title: string; date: string; endDate: string; color: string; note: string }) {
    if (!editing) return;
    const res = await fetch(`/api/events/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error ?? "Gagal memperbarui event");
    }
    await fetchEvents();
    setMode("list");
    setEditing(null);
    toast.success("Event berhasil diperbarui");
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus event ini?")) return;
    const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Event dihapus");
    } else {
      toast.error("Gagal menghapus event");
    }
    await fetchEvents();
  }

  if (mode === "create") {
    return (
      <div className="flex flex-col gap-xl">
        <h1 className="font-display text-display-sm font-normal text-ink">Tambah Event</h1>
        <div className="max-w-lg rounded-lg border border-hairline bg-canvas p-lg">
          <EventForm onSubmit={handleCreate} onCancel={() => setMode("list")} submitLabel="Tambah Event" />
        </div>
      </div>
    );
  }

  if (mode === "edit" && editing) {
    return (
      <div className="flex flex-col gap-xl">
        <h1 className="font-display text-display-sm font-normal text-ink">Edit Event</h1>
        <div className="max-w-lg rounded-lg border border-hairline bg-canvas p-lg">
          <EventForm
            initial={{
              title: editing.title,
              date: editing.date.slice(0, 10),
              endDate: editing.endDate?.slice(0, 10) ?? "",
              color: editing.color ?? "#6366f1",
              note: editing.note ?? "",
            }}
            onSubmit={handleEdit}
            onCancel={() => { setMode("list"); setEditing(null); }}
            submitLabel="Simpan Perubahan"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display-sm font-normal text-ink">Events</h1>
          <p className="mt-xs font-mono text-caption text-muted">Event pribadi tersimpan di kalender kamu</p>
        </div>
        <button
          onClick={() => setMode("create")}
          className="flex items-center gap-xs rounded-pill bg-primary px-lg py-xs font-display text-button font-medium text-white transition-colors hover:bg-primary-active"
        >
          <Plus className="h-4 w-4" />
          Tambah Event
        </button>
      </div>

      {loading ? (
        <div className="flex items-center gap-sm font-display text-body-sm text-muted">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-hairline border-t-ink" />
          Memuat event...
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center gap-sm rounded-lg border border-hairline bg-canvas py-xxl text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-soft">
            <CalendarDays className="h-7 w-7 text-muted" />
          </div>
          <div>
            <p className="font-display font-medium text-ink">Belum ada event</p>
            <p className="font-display text-body-sm text-muted">Tambahkan event pertama kamu</p>
          </div>
          <button
            onClick={() => setMode("create")}
            className="mt-xs inline-flex items-center gap-1 rounded-pill bg-primary px-lg py-xs font-display text-button font-medium text-white transition-colors hover:bg-primary-active"
          >
            <Plus className="h-4 w-4" />
            Tambah event
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-hairline bg-canvas">
          <div className="divide-y divide-hairline">
            {events.map((ev) => (
              <div key={ev.id} className="flex items-center gap-md px-lg py-md hover:bg-surface-soft/50">
                <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: ev.color ?? "#6366f1" }} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-body-sm font-medium text-ink">{ev.title}</p>
                  <p className="font-mono text-caption text-muted">
                    {formatDate(ev.date)}
                    {ev.endDate && ev.endDate !== ev.date && ` – ${formatDate(ev.endDate)}`}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-xs">
                  <button
                    onClick={() => { setEditing(ev); setMode("edit"); }}
                    className="rounded-full p-1.5 text-muted transition-colors hover:bg-surface-soft hover:text-ink"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="rounded-full p-1.5 text-muted transition-colors hover:bg-error/10 hover:text-error"
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
