"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const inputCls = "w-full max-w-sm rounded-md border border-hairline bg-canvas px-[14px] py-[12px] font-display text-body-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink transition-colors";

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) { router.push("/login"); return; }
      setUser(data.user);
      setName(data.user.user_metadata?.full_name ?? "");
    });
  }, []);

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error } = await supabase.auth.updateUser({ data: { full_name: name } });
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  async function handleDeleteAccount() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-xl">
      <h1 className="font-display text-display-sm font-normal text-ink">Pengaturan Akun</h1>

      {/* Profile */}
      <div className="rounded-lg border border-hairline bg-canvas p-lg">
        <h2 className="mb-md font-display text-headline font-medium text-ink">Profil</h2>

        {success && (
          <div className="mb-md rounded-md bg-surface-soft px-md py-sm font-display text-body-sm text-semantic-success">
            Perubahan berhasil disimpan.
          </div>
        )}
        {error && (
          <div className="mb-md rounded-md bg-error/10 px-md py-sm font-display text-body-sm text-error">{error}</div>
        )}

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
              className="rounded-pill bg-primary px-lg py-xs font-display text-body-sm font-medium text-white transition-colors hover:bg-primary-active disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan perubahan"}
            </button>
          </div>
        </form>
      </div>

      {/* Danger zone */}
      <div className="rounded-lg border border-error/30 bg-canvas p-lg">
        <h2 className="mb-xs font-display text-headline font-medium text-error">Zona Berbahaya</h2>
        <p className="mb-md font-display text-body-sm text-muted">Tindakan di bawah ini tidak dapat dibatalkan.</p>

        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="rounded-pill border border-error/30 px-lg py-xs font-display text-body-sm font-medium text-error transition-colors hover:bg-error/10"
          >
            Hapus akun
          </button>
        ) : (
          <div className="flex items-center gap-sm">
            <p className="font-display text-body-sm text-error">Yakin ingin menghapus akun?</p>
            <button
              onClick={handleDeleteAccount}
              className="rounded-pill bg-error px-lg py-xs font-display text-button font-medium text-white"
            >
              Ya, hapus
            </button>
            <button
              onClick={() => setDeleteConfirm(false)}
              className="font-display text-caption text-muted hover:underline"
            >
              Batal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
