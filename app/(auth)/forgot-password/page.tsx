"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CalendarDays } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    setSent(true);
    setLoading(false);
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
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h2 className="mb-2 font-display text-title-sm font-semibold text-ink">Email terkirim</h2>
              <p className="text-body-sm text-muted">
                Cek inbox <strong>{email}</strong> untuk link reset password.
              </p>
              <Link href="/login" className="mt-4 inline-block text-caption text-brand-accent hover:underline">
                Kembali ke login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="mb-1 font-display text-title-sm font-semibold text-ink">Lupa password?</h1>
              <p className="mb-6 text-body-sm text-muted">
                Masukkan email dan kami akan mengirim link reset password.
              </p>

              {error && (
                <div className="mb-4 rounded-lg bg-error/10 px-3 py-2 text-body-sm text-error">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full rounded-lg bg-brand-accent py-2 text-body-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? "Mengirim..." : "Kirim link reset"}
                </button>
              </form>

              <p className="mt-5 text-center text-caption text-muted">
                Ingat password?{" "}
                <Link href="/login" className="text-brand-accent hover:underline">
                  Masuk
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
