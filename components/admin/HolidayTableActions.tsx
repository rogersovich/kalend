"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Holiday {
  id: string;
  name: string;
  date: string; // ISO date string
  type: string;
  description?: string | null;
}

const TYPE_OPTIONS = [
  { value: "national", label: "Nasional" },
  { value: "joint-leave", label: "Cuti Bersama" },
  { value: "regional", label: "Regional" },
];

function toInputDate(isoString: string) {
  return isoString.slice(0, 10);
}

export default function HolidayTableActions({ holiday }: { holiday: Holiday }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [name, setName] = useState(holiday.name);
  const [date, setDate] = useState(toInputDate(holiday.date));
  const [type, setType] = useState(holiday.type);
  const [description, setDescription] = useState(holiday.description ?? "");

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEdit() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/holidays/${holiday.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, date, type, description: description || null }),
      });
      if (!res.ok) throw new Error("Gagal menyimpan");
      setEditOpen(false);
      startTransition(() => router.refresh());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/holidays/${holiday.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      setDeleteOpen(false);
      startTransition(() => router.refresh());
    } catch {
      setError("Gagal menghapus");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-xs">
        <button
          onClick={() => { setEditOpen(true); setError(null); }}
          className="rounded p-1 text-ink/40 transition-colors hover:bg-surface-soft hover:text-ink"
          title="Edit"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => { setDeleteOpen(true); setError(null); }}
          className="rounded p-1 text-ink/40 transition-colors hover:bg-error/10 hover:text-error"
          title="Hapus"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-title-md font-semibold text-ink">
              Edit Hari Libur
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-md py-xs">
            <div className="flex flex-col gap-xs">
              <label className="font-mono text-caption uppercase tracking-widest text-ink/60">
                Nama
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="rounded-lg border border-hairline bg-canvas px-md py-sm font-display text-body-sm text-ink outline-none focus:border-ink"
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-mono text-caption uppercase tracking-widest text-ink/60">
                Tanggal
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="rounded-lg border border-hairline bg-canvas px-md py-sm font-mono text-body-sm text-ink outline-none focus:border-ink"
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-mono text-caption uppercase tracking-widest text-ink/60">
                Tipe
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="rounded-lg border border-hairline bg-canvas px-md py-sm font-display text-body-sm text-ink outline-none focus:border-ink"
              >
                {TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-xs">
              <label className="font-mono text-caption uppercase tracking-widest text-ink/60">
                Deskripsi <span className="normal-case text-ink/30">(opsional)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="resize-none rounded-lg border border-hairline bg-canvas px-md py-sm font-display text-body-sm text-ink outline-none focus:border-ink"
              />
            </div>

            {error && (
              <p className="font-mono text-caption text-error">{error}</p>
            )}
          </div>

          <DialogFooter className="gap-xs">
            <button
              onClick={() => setEditOpen(false)}
              className="rounded-lg border border-hairline px-md py-sm font-display text-body-sm text-ink/60 transition-colors hover:text-ink"
            >
              Batal
            </button>
            <button
              onClick={handleEdit}
              disabled={saving || !name || !date}
              className="flex items-center gap-xs rounded-lg bg-ink px-md py-sm font-display text-body-sm font-medium text-white transition-colors hover:bg-primary-active disabled:opacity-50"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Simpan
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-title-md font-semibold text-ink">
              Hapus Hari Libur?
            </DialogTitle>
          </DialogHeader>

          <p className="font-display text-body-sm text-ink/60">
            <span className="font-semibold text-ink">{holiday.name}</span> akan dihapus permanen dan tidak bisa dikembalikan.
          </p>

          {error && (
            <p className="font-mono text-caption text-error">{error}</p>
          )}

          <DialogFooter className="gap-xs">
            <button
              onClick={() => setDeleteOpen(false)}
              className="rounded-lg border border-hairline px-md py-sm font-display text-body-sm text-ink/60 transition-colors hover:text-ink"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting || isPending}
              className="flex items-center gap-xs rounded-lg bg-error px-md py-sm font-display text-body-sm font-medium text-white transition-colors hover:bg-error/80 disabled:opacity-50"
            >
              {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Hapus
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
