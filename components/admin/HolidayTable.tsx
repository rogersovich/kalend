"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";
import HolidayTableActions from "./HolidayTableActions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Holiday {
  id: string;
  countryId: string;
  regionId: string | null;
  date: Date | string;
  type: string;
  name: string;
  description: string | null;
  isRecurring: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  region?: { name: string } | null;
}

interface HolidayTableProps {
  holidays: Holiday[];
}

const TYPE_LABELS: Record<string, string> = {
  national: "Nasional",
  "joint-leave": "Cuti Bersama",
  regional: "Regional",
};

const TYPE_CLASSES: Record<string, string> = {
  national: "bg-error/10 text-error",
  "joint-leave": "bg-badge-orange/10 text-badge-orange",
  regional: "bg-surface-soft text-ink/60",
};

export default function HolidayTable({ holidays }: HolidayTableProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAllSelected = holidays.length > 0 && selectedIds.size === holidays.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < holidays.length;

  function handleSelectAll() {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(holidays.map((h) => h.id)));
    }
  }

  function handleSelectItem(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  }

  async function handleBulkDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/holidays", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: Array.from(selectedIds) }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Gagal menghapus");
      }

      toast.success(`${selectedIds.size} hari libur berhasil dihapus`);
      setSelectedIds(new Set());
      setDeleteOpen(false);
      startTransition(() => router.refresh());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Terjadi kesalahan");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-hairline">
        <div className="max-h-[600px] overflow-auto">
          <table className="w-full min-w-[600px] text-left">
            <thead className="sticky top-0 bg-surface-soft shadow-[0_1px_0_0_rgba(0,0,0,0.1)]">
              {selectedIds.size > 0 ? (
                <tr>
                  <th className="w-12 px-md py-sm">
                    <input
                      type="checkbox"
                      ref={(el) => {
                        if (el) {
                          el.indeterminate = isSomeSelected;
                        }
                      }}
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-hairline bg-canvas text-ink focus:ring-ink"
                    />
                  </th>
                  <th colSpan={6} className="px-md py-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-display text-body-sm font-medium text-ink">
                        {selectedIds.size} terpilih
                      </span>
                      <button
                        onClick={() => { setDeleteOpen(true); setError(null); }}
                        className="flex items-center gap-xs rounded-pill bg-error/10 px-md py-xs font-mono text-caption font-medium text-error transition-colors hover:bg-error/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Hapus Terpilih
                      </button>
                    </div>
                  </th>
                </tr>
              ) : (
                <tr>
                  <th className="w-12 px-md py-sm">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-hairline bg-canvas text-ink focus:ring-ink"
                    />
                  </th>
                  <th className="w-12 px-md py-sm font-mono text-caption uppercase tracking-widest text-ink/60">No</th>
                  {["Tanggal", "Nama", "Tipe", "Region", "Aksi"].map((h) => (
                    <th key={h} className="px-md py-sm font-mono text-caption uppercase tracking-widest text-ink/60">{h}</th>
                  ))}
                </tr>
              )}
            </thead>
            <tbody>
              {holidays.map((h, i) => {
                const d = new Date(h.date);
                const dateStr = `${d.getDate()} ${MONTH_NAMES_ID[d.getMonth()]} ${d.getFullYear()}`;
                const isSelected = selectedIds.has(h.id);
                return (
                  <tr
                    key={h.id}
                    className={`border-t border-hairline hover:bg-surface-soft ${
                      isSelected ? "bg-surface-soft" : ""
                    }`}
                  >
                    <td className="px-md py-sm">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectItem(h.id)}
                        className="h-4 w-4 rounded border-hairline bg-canvas text-ink focus:ring-ink"
                      />
                    </td>
                    <td className="px-md py-sm font-mono text-caption text-ink/60">{i + 1}</td>
                    <td className="px-md py-sm font-mono text-caption text-ink">{dateStr}</td>
                    <td className="px-md py-sm font-display text-body-sm text-ink">{h.name}</td>
                    <td className="px-md py-sm">
                      <span className={`rounded-pill px-sm py-xxs font-mono text-caption ${TYPE_CLASSES[h.type] ?? "bg-surface-soft text-ink/60"}`}>
                        {TYPE_LABELS[h.type] ?? h.type}
                      </span>
                    </td>
                    <td className="px-md py-sm font-mono text-caption text-ink/60">
                      {h.region?.name ?? "—"}
                    </td>
                    <td className="px-md py-sm">
                      <HolidayTableActions
                        holiday={{
                          id: h.id,
                          name: h.name,
                          date: typeof h.date === "string" ? h.date : h.date.toISOString(),
                          type: h.type,
                          description: h.description
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {holidays.length === 0 && (
          <p className="py-xl text-center font-display text-body text-ink">
            Tidak ada data hari libur.
          </p>
        )}
      </div>

      {/* Bulk Delete Confirm Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-title-md font-semibold text-ink">
              Hapus Hari Libur?
            </DialogTitle>
          </DialogHeader>

          <p className="font-display text-body-sm text-ink/60">
            Sebanyak <span className="font-semibold text-ink">{selectedIds.size} hari libur</span> akan dihapus secara permanen dan tidak bisa dikembalikan.
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
              onClick={handleBulkDelete}
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
