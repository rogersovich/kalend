"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CalendarDays } from "lucide-react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const supabase = createClient();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setFormError(error.message);
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
  }

  async function handleGoogleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    if (error) {
      setFormError(error.message);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface-soft px-4">
        <div className="w-full max-w-sm rounded-xl border border-hairline bg-canvas p-6 shadow-soft text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20,6 9,17 4,12" />
            </svg>
          </div>
          <h2 className="mb-2 font-display text-title-sm font-semibold text-ink">Cek email kamu</h2>
          <p className="text-body-sm text-muted">
            Link konfirmasi sudah dikirim ke <strong>{email}</strong>. Klik link tersebut untuk mengaktifkan akun.
          </p>
          <Link href="/login" className="mt-4 inline-block text-caption text-brand-accent hover:underline">
            Kembali ke halaman login
          </Link>
        </div>
      </div>
    );
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
          <h1 className="mb-1 font-display text-title-sm font-semibold text-ink">Buat akun gratis</h1>
          <p className="mb-6 text-body-sm text-muted">Mulai kelola kalender personalmu.</p>

          {formError && (
            <div className="mb-4 rounded-lg bg-error/10 px-3 py-2 text-body-sm text-error">
              {formError}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-caption font-medium text-ink">Nama lengkap</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Kamu"
                className="w-full rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none placeholder:text-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-caption font-medium text-ink">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kamu@email.com"
                className="w-full rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none placeholder:text-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-caption font-medium text-ink">Password</label>
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
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full rounded-lg bg-brand-accent py-2 text-body-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Daftar sekarang"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-hairline" />
            <span className="text-caption text-muted">atau</span>
            <div className="h-px flex-1 bg-hairline" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-hairline bg-canvas py-2 text-body-sm font-medium text-ink transition-colors hover:bg-surface-soft disabled:opacity-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Daftar dengan Google
          </button>

          <p className="mt-5 text-center text-caption text-muted">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-brand-accent hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
