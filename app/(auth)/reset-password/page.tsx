"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CalendarDays } from "lucide-react";

const inputCls = "w-full rounded-md border border-hairline bg-canvas px-[14px] py-[12px] text-body-sm text-ink placeholder:text-muted outline-none focus-visible:ring-2 focus-visible:ring-ink transition-colors";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
      else setError("Link reset password tidak valid atau sudah kedaluwarsa.");
    });
  // supabase.auth is stable — created once via createClient()
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-lg">
      <div className="w-full max-w-sm">
        <div className="mb-xl flex flex-col items-center gap-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <CalendarDays size={20} />
          </div>
          <span className="font-display text-title-md font-semibold text-ink">Kalend</span>
        </div>

        <div className="rounded-lg border border-hairline bg-canvas p-lg">
          <h1 className="mb-xs font-display text-headline font-medium text-ink">Buat password baru</h1>
          <p className="mb-lg font-display text-body-sm text-muted">Masukkan password baru untuk akunmu.</p>

          {error && (
            <div className="mb-md rounded-md bg-error/10 px-md py-sm font-display text-body-sm text-error">
              {error}
            </div>
          )}

          {ready ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-sm">
              <div>
                <label className="mb-xs block font-mono text-caption uppercase tracking-widest text-muted">Password baru</label>
                <input type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 karakter" className={inputCls} />
              </div>
              <div>
                <label className="mb-xs block font-mono text-caption uppercase tracking-widest text-muted">Konfirmasi password</label>
                <input type="password" required minLength={8} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Ulangi password" className={inputCls} />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-xs w-full rounded-pill bg-primary py-xs font-display text-button font-medium text-white transition-colors hover:bg-primary-active disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan password baru"}
              </button>
            </form>
          ) : !error ? (
            <p className="font-display text-body-sm text-muted">Memverifikasi link...</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
