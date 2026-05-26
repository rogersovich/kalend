"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CalendarDays } from "lucide-react";

const inputCls = "w-full rounded-md border border-hairline bg-canvas px-[14px] py-[12px] text-body-sm text-ink placeholder:text-muted outline-none focus-visible:ring-2 focus-visible:ring-ink transition-colors";

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
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-lg">
      <div className="w-full max-w-sm">
        <div className="mb-xl flex flex-col items-center gap-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <CalendarDays size={20} />
          </div>
          <span className="font-display text-title-md font-semibold text-ink">Kalend</span>
        </div>

        <div className="rounded-lg border border-hairline bg-canvas p-lg">
          {sent ? (
            <div className="text-center">
              <div className="mx-auto mb-md flex h-12 w-12 items-center justify-center rounded-full bg-surface-soft text-ink">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
              <h2 className="mb-xs font-display text-headline font-medium text-ink">Email terkirim</h2>
              <p className="font-display text-body-sm text-muted">
                Cek inbox <strong>{email}</strong> untuk link reset password.
              </p>
              <Link href="/login" className="mt-md inline-block font-display text-caption text-ink underline underline-offset-2 hover:opacity-70">
                Kembali ke login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="mb-xs font-display text-headline font-medium text-ink">Lupa password?</h1>
              <p className="mb-lg font-display text-body-sm text-muted">
                Masukkan email dan kami akan mengirim link reset password.
              </p>

              {error && (
                <div className="mb-md rounded-md bg-error/10 px-md py-sm font-display text-body-sm text-error">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-sm">
                <div>
                  <label className="mb-xs block font-mono text-caption uppercase tracking-widest text-muted">Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="kamu@email.com" className={inputCls} />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-xs w-full rounded-pill bg-primary py-xs font-display text-button font-medium text-white transition-colors hover:bg-primary-active disabled:opacity-50"
                >
                  {loading ? "Mengirim..." : "Kirim link reset"}
                </button>
              </form>

              <p className="mt-lg text-center font-display text-caption text-muted">
                Ingat password?{" "}
                <Link href="/login" className="text-ink underline underline-offset-2 hover:opacity-70">
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
