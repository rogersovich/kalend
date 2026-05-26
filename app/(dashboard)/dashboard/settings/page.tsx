"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

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
    // Sign out — actual deletion requires server-side with service role key
    await supabase.auth.signOut();
    router.push("/");
  }

  if (!user) return null;

  return (
    <div className="flex flex-col gap-xl">
      <h1 className="font-display text-display-sm font-semibold text-ink">Pengaturan Akun</h1>

      {/* Profile */}
      <div className="rounded-xl border border-hairline bg-canvas p-lg">
        <h2 className="mb-md font-display text-title-sm font-semibold text-ink">Profil</h2>

        {success && (
          <div className="mb-4 rounded-lg bg-success/10 px-3 py-2 text-body-sm text-success">
            Perubahan berhasil disimpan.
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-error/10 px-3 py-2 text-body-sm text-error">{error}</div>
        )}

        <form onSubmit={handleUpdateName} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-caption font-medium text-ink">Nama lengkap</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full max-w-sm rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-caption font-medium text-ink">Email</label>
            <p className="text-body-sm text-muted">{user.email}</p>
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-brand-accent px-md py-sm text-body-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan perubahan"}
            </button>
          </div>
        </form>
      </div>

      {/* Danger zone */}
      <div className="rounded-xl border border-error/30 bg-canvas p-lg">
        <h2 className="mb-1 font-display text-title-sm font-semibold text-error">Zona Berbahaya</h2>
        <p className="mb-md text-body-sm text-muted">
          Tindakan di bawah ini tidak dapat dibatalkan.
        </p>

        {!deleteConfirm ? (
          <button
            onClick={() => setDeleteConfirm(true)}
            className="rounded-lg border border-error/30 px-md py-sm text-body-sm font-medium text-error transition-colors hover:bg-error/10"
          >
            Hapus akun
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-body-sm text-error">Yakin ingin menghapus akun?</p>
            <button
              onClick={handleDeleteAccount}
              className="rounded-lg bg-error px-md py-sm text-body-sm font-medium text-white"
            >
              Ya, hapus
            </button>
            <button
              onClick={() => setDeleteConfirm(false)}
              className="text-caption text-muted hover:underline"
            >
              Batal
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
