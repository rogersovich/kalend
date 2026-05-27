"use client";

import { useState } from "react";
import { toast } from "sonner";

const COLOR_OPTIONS = [
  { value: "#6366f1", label: "Indigo" },
  { value: "#ec4899", label: "Pink" },
  { value: "#f59e0b", label: "Amber" },
  { value: "#10b981", label: "Emerald" },
  { value: "#3b82f6", label: "Blue" },
  { value: "#ef4444", label: "Red" },
];

interface EventFormData {
  title: string;
  date: string;
  endDate: string;
  color: string;
  note: string;
}

interface EventFormProps {
  initial?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
}

export default function EventForm({ initial, onSubmit, onCancel, submitLabel = "Simpan" }: EventFormProps) {
  const [form, setForm] = useState<EventFormData>({
    title: initial?.title ?? "",
    date: initial?.date ?? "",
    endDate: initial?.endDate ?? "",
    color: initial?.color ?? "#6366f1",
    note: initial?.note ?? "",
  });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Terjadi kesalahan");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      <div>
        <label className="mb-1 block text-caption font-medium text-ink">Judul *</label>
        <input
          type="text"
          required
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Nama event"
          className="w-full rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none placeholder:text-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-caption font-medium text-ink">Tanggal mulai *</label>
          <input
            type="date"
            required
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="w-full rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30"
          />
        </div>
        <div>
          <label className="mb-1 block text-caption font-medium text-ink">Tanggal selesai</label>
          <input
            type="date"
            value={form.endDate}
            min={form.date}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="w-full rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-caption font-medium text-ink">Warna</label>
        <div className="flex gap-2">
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

      <div>
        <label className="mb-1 block text-caption font-medium text-ink">Catatan</label>
        <textarea
          rows={3}
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          placeholder="Catatan tambahan (opsional)"
          className="w-full resize-none rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none placeholder:text-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-hairline px-4 py-2 text-body-sm font-medium text-muted transition-colors hover:text-ink"
        >
          Batal
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand-accent px-4 py-2 text-body-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
