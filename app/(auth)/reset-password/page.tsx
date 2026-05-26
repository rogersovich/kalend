"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CalendarDays } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // Supabase sets the session from the URL fragment on load
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      else setError("Link reset password tidak valid atau sudah kedaluwarsa.");
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Password tidak cocok.");
      return;
    }
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-soft px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent text-white">
            <CalendarDays size={20} />
          </div>
          <span className="font-display text-title-md font-semibold text-ink">Kalend</span>
        </div>

        <div className="rounded-xl border border-hairline bg-canvas p-6 shadow-soft">
          <h1 className="mb-1 font-display text-title-sm font-semibold text-ink">Buat password baru</h1>
          <p className="mb-6 text-body-sm text-muted">Masukkan password baru untuk akunmu.</p>

          {error && (
            <div className="mb-4 rounded-lg bg-error/10 px-3 py-2 text-body-sm text-error">
              {error}
            </div>
          )}

          {ready ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-caption font-medium text-ink">Password baru</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 karakter"
                  className="w-full rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none placeholder:text-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-caption font-medium text-ink">Konfirmasi password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Ulangi password"
                  className="w-full rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none placeholder:text-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full rounded-lg bg-brand-accent py-2 text-body-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan password baru"}
              </button>
            </form>
          ) : !error ? (
            <p className="text-body-sm text-muted">Memverifikasi link...</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
