"use client";

import { useEffect, useState } from "react";
import { Plus, CalendarPlus } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const COLOR_OPTIONS = [
  { value: "#6366f1", label: "Indigo" },
  { value: "#ec4899", label: "Pink" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#10b981", label: "Emerald" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#ef4444", label: "Red" },
];

const inputCls =
  "w-full rounded-md border border-hairline bg-canvas px-md py-sm font-display text-body-sm text-ink placeholder:text-muted outline-none focus-visible:ring-2 focus-visible:ring-ink/20 transition-colors";

interface FormData {
  title: string;
  date: string;
  endDate: string;
  color: string;
  note: string;
}

interface AddEventButtonProps {
  onSuccess?: () => void;
}

export default function AddEventButton({ onSuccess }: AddEventButtonProps = {}) {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    title: "",
    date: "",
    endDate: "",
    color: "#6366f1",
    note: "",
  });

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setLoggedIn(!!data.user));
  }, []);

  function handleOpenAttempt() {
    if (!loggedIn) {
      toast.error("Login dulu untuk menambah event");
      return;
    }
    setForm({ title: "", date: "", endDate: "", color: "#6366f1", note: "" });
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      toast.success("Event berhasil ditambahkan");
      setOpen(false);
      onSuccess?.();
    } else {
      const json = await res.json();
      toast.error(json.error ?? "Gagal menambahkan event");
    }
    setLoading(false);
  }

  if (loggedIn === null) return null;

  return (
    <>
      <button
        onClick={handleOpenAttempt}
        className="flex w-full items-center justify-center gap-xs rounded-lg border border-hairline py-sm text-body-sm font-medium text-ink"
      >
        <Plus className="h-4 w-4" />
        Tambah Event
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mb-xs flex h-10 w-10 items-center justify-center rounded-full bg-block-cream">
              <CalendarPlus className="h-5 w-5 text-ink" />
            </div>
            <DialogTitle className="font-display text-headline font-medium text-ink">
              Tambah Event Baru
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-md">
            {/* Title */}
            <div className="flex flex-col gap-xs">
              <label className="font-mono text-caption uppercase tracking-widest text-muted">
                Judul <span className="text-error">*</span>
              </label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Nama event"
                className={inputCls}
              />
            </div>

            {/* Date range */}
            <div className="grid grid-cols-2 gap-sm">
              <div className="flex flex-col gap-xs">
                <label className="font-mono text-caption uppercase tracking-widest text-muted">
                  Mulai <span className="text-error">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={inputCls}
                />
              </div>
              <div className="flex flex-col gap-xs">
                <label className="font-mono text-caption uppercase tracking-widest text-muted">
                  Selesai
                </label>
                <input
                  type="date"
                  min={form.date}
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Color */}
            <div className="flex flex-col gap-xs">
              <label className="font-mono text-caption uppercase tracking-widest text-muted">
                Warna
              </label>
              <div className="flex gap-sm">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    title={c.label}
                    onClick={() => setForm({ ...form, color: c.value })}
                    className="h-7 w-7 rounded-full transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c.value,
                      outline: form.color === c.value ? `2px solid ${c.value}` : "none",
                      outlineOffset: "2px",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="flex flex-col gap-xs">
              <label className="font-mono text-caption uppercase tracking-widest text-muted">
                Catatan
              </label>
              <textarea
                rows={3}
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                placeholder="Catatan tambahan (opsional)"
                className="resize-none rounded-md border border-hairline bg-canvas px-md py-sm font-display text-body-sm text-ink placeholder:text-muted outline-none focus-visible:ring-2 focus-visible:ring-ink/20 transition-colors"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-sm pt-xs">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="flex-1 rounded-pill border border-hairline px-lg py-xs font-display text-body-sm font-medium text-muted transition-colors hover:text-ink disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-pill bg-ink px-lg py-xs font-display text-body-sm font-medium text-canvas transition-opacity hover:opacity-80 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan Event"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
