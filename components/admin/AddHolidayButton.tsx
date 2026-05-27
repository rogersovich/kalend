"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Props {
  country: string;
  year: number;
}

const TYPE_OPTIONS = [
  { value: "national", label: "Nasional" },
  { value: "joint-leave", label: "Cuti Bersama" },
  { value: "regional", label: "Regional" },
];

export default function AddHolidayButton({ country, year }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState(`${year}-01-01`);
  const [type, setType] = useState("national");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleOpen() {
    setName("");
    setDate(`${year}-01-01`);
    setType("national");
    setDescription("");
    setError(null);
    setOpen(true);
  }

  async function handleSubmit() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/holidays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryCode: country, name, date, type, description: description || undefined }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Gagal menyimpan");
      }
      setOpen(false);
      startTransition(() => router.refresh());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-xs rounded-lg bg-ink px-md py-sm font-display text-body-sm font-medium text-white transition-colors hover:bg-primary-active"
      >
        <Plus className="h-4 w-4" />
        Tambah Hari Libur
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-title-md font-semibold text-ink">
              Tambah Hari Libur
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
                placeholder="cth. Hari Kemerdekaan"
                className="rounded-lg border border-hairline bg-canvas px-md py-sm font-display text-body-sm text-ink outline-none focus:border-ink placeholder:text-ink/30"
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
                placeholder="cth. Ditetapkan berdasarkan SKB..."
                className="resize-none rounded-lg border border-hairline bg-canvas px-md py-sm font-display text-body-sm text-ink outline-none focus:border-ink placeholder:text-ink/30"
              />
            </div>

            {error && (
              <p className="font-mono text-caption text-error">{error}</p>
            )}
          </div>

          <DialogFooter className="gap-xs">
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-hairline px-md py-sm font-display text-body-sm text-ink/60 transition-colors hover:text-ink"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving || isPending || !name || !date}
              className="flex items-center gap-xs rounded-lg bg-ink px-md py-sm font-display text-body-sm font-medium text-white transition-colors hover:bg-primary-active disabled:opacity-50"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Tambah
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
