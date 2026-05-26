"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CalendarDays } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(
    error === "auth_callback_failed" ? "Login gagal. Silakan coba lagi." : null
  );

  const supabase = createClient();

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setFormError(error.message);
      setLoading(false);
      return;
    }
    router.push("/dashboard");
    router.refresh();
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

  const inputCls = "w-full rounded-md border border-hairline bg-canvas px-[14px] py-[12px] text-body-sm text-ink placeholder:text-muted outline-none focus-visible:ring-2 focus-visible:ring-ink transition-colors";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-canvas px-lg">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-xl flex flex-col items-center gap-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
            <CalendarDays size={20} />
          </div>
          <span className="font-display text-title-md font-semibold text-ink">Kalend</span>
        </div>

        <div className="rounded-lg border border-hairline bg-canvas p-lg">
          <h1 className="mb-xs font-display text-headline font-medium text-ink">Masuk ke akun</h1>
          <p className="mb-lg font-display text-body-sm text-muted">Selamat datang kembali.</p>

          {formError && (
            <div className="mb-md rounded-md bg-error/10 px-md py-sm font-display text-body-sm text-error">
              {formError}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="flex flex-col gap-sm">
            <div>
              <label className="mb-xs block font-mono text-caption uppercase tracking-widest text-muted">Email</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="kamu@email.com" className={inputCls} />
            </div>
            <div>
              <div className="mb-xs flex items-center justify-between">
                <label className="font-mono text-caption uppercase tracking-widest text-muted">Password</label>
                <Link href="/forgot-password" className="font-display text-caption text-muted hover:text-ink hover:underline">
                  Lupa password?
                </Link>
              </div>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="mt-xs w-full rounded-pill bg-primary py-xs font-display text-button font-medium text-white transition-colors hover:bg-primary-active disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="my-md flex items-center gap-sm">
            <div className="h-px flex-1 bg-hairline" />
            <span className="font-mono text-caption text-muted">atau</span>
            <div className="h-px flex-1 bg-hairline" />
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="flex w-full items-center justify-center gap-sm rounded-pill border border-hairline bg-canvas py-xs font-display text-button font-medium text-ink transition-colors hover:bg-surface-soft disabled:opacity-50"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Lanjutkan dengan Google
          </button>

          <p className="mt-lg text-center font-display text-caption text-muted">
            Belum punya akun?{" "}
            <Link href="/register" className="text-ink underline underline-offset-2 hover:opacity-70">
              Daftar gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
