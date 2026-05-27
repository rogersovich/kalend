"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import type { User } from "@supabase/supabase-js";

const inputCls = "w-full max-w-sm rounded-md border border-hairline bg-canvas px-[14px] py-[12px] font-display text-body-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink transition-colors";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      setUser(data.user);
      setName(data.user.user_metadata?.full_name ?? "");
    });
  // router and supabase.auth are stable refs — safe to omit
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Perubahan berhasil disimpan");
    }
    setLoading(false);
  }

  async function handleDeleteAccount() {
    setDeleting(true);
    const res = await fetch("/api/user", { method: "DELETE" });
    if (!res.ok) {
      const json = await res.json();
      toast.error(json.error ?? "Gagal menghapus akun");
      setDeleting(false);
      return;
    }
    await supabase.auth.signOut();
    router.push("/");
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-lg md:gap-xl">
      <h1 className="font-display text-display-sm font-normal text-ink">Pengaturan Akun</h1>

      {/* Profile */}
      <div className="rounded-lg border border-hairline bg-canvas p-md sm:p-lg">
        <h2 className="mb-md font-display text-headline font-medium text-ink">Profil</h2>

        <form onSubmit={handleUpdateName} className="flex flex-col gap-md">
          <div>
            <label className="mb-xs block font-mono text-caption uppercase tracking-widest text-muted">Nama lengkap</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="mb-xs block font-mono text-caption uppercase tracking-widest text-muted">Email</label>
            <p className="font-display text-body-sm text-muted">{user.email}</p>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-pill bg-primary px-lg py-sm font-display text-body-sm font-medium text-white transition-colors hover:bg-primary-active disabled:opacity-50 sm:w-auto sm:py-xs"
            >
              {loading ? "Menyimpan..." : "Simpan perubahan"}
            </button>
          </div>
        </form>
      </div>

      {/* Danger zone */}
      <div className="rounded-lg border border-error/30 bg-canvas p-md sm:p-lg">
        <h2 className="mb-xs font-display text-headline font-medium text-error">Zona Berbahaya</h2>
        <p className="mb-md font-display text-body-sm text-muted">Tindakan di bawah ini tidak dapat dibatalkan.</p>
        <button
          onClick={() => { setConfirmText(""); setDeleteOpen(true); }}
          className="w-full rounded-pill border border-error/30 px-lg py-sm font-display text-body-sm font-medium text-error transition-colors hover:bg-error/10 sm:w-auto sm:py-xs"
        >
          Hapus akun
        </button>
      </div>

      {/* Delete confirmation modal */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="mb-sm flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
              <AlertTriangle className="h-6 w-6 text-error" />
            </div>
            <DialogTitle className="font-display text-headline font-medium text-ink">
              Hapus akun secara permanen?
            </DialogTitle>
            <DialogDescription className="font-display text-body-sm text-muted">
              Semua data kamu akan dihapus secara permanen, termasuk:
            </DialogDescription>
          </DialogHeader>

          <ul className="flex flex-col gap-xs rounded-lg bg-error/5 px-md py-sm">
            {["Semua event pribadi", "Semua API key", "Riwayat penggunaan API", "Data profil"].map((item) => (
              <li key={item} className="flex items-center gap-xs font-display text-body-sm text-error">
                <span className="h-1 w-1 rounded-full bg-error" />
                {item}
              </li>
            ))}
          </ul>

          <p className="font-display text-body-sm text-muted">
            Ketik <strong className="text-ink">HAPUS</strong> untuk konfirmasi:
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="HAPUS"
            className="w-full rounded-md border border-hairline bg-canvas px-md py-sm font-mono text-body-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-error"
          />

          <DialogFooter className="flex gap-sm">
            <button
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
              className="flex-1 rounded-pill border border-hairline px-lg py-xs font-display text-body-sm font-medium text-muted transition-colors hover:text-ink disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deleting || confirmText !== "HAPUS"}
              className="flex-1 rounded-pill bg-error px-lg py-xs font-display text-body-sm font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-40"
            >
              {deleting ? "Menghapus..." : "Ya, hapus akun"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
