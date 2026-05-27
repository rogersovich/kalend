"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Calendar, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navLinks = [
  { href: "/2026", label: "Kalender" },
  { href: "/tools", label: "Tools" },
  { href: "/blog", label: "Blog" },
];

export default function Navbar() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const supabase = useRef(createClient()).current;

  async function fetchRole(userId: string) {
    const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
    setRole(data?.role ?? "user");
  }

  useEffect(() => {
    // getSession reads from cookie cache — no network roundtrip
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchRole(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchRole(session.user.id);
      else setRole(null);
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const displayName = user?.user_metadata?.full_name ?? user?.email?.split("@")[0] ?? "Akun";
  const homeLink = role === "admin" ? "/admin" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 h-14 w-full border-b border-hairline bg-canvas">
      <div className="mx-auto flex h-full max-w-content items-center justify-between px-lg">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-xs font-display text-title-sm font-semibold text-ink"
        >
          <Calendar className="h-5 w-5" aria-hidden />
          Kalend
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-xs md:flex" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-sm py-xs text-nav-link text-ink/60 transition-colors hover:bg-surface-soft hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA — black+white pill pair */}
        <div className="hidden items-center gap-xs md:flex">
          {user ? (
            <>
              <Link
                href={homeLink}
                className="flex items-center gap-xs rounded-full px-sm py-xs text-body-sm text-ink/60 transition-colors hover:bg-surface-soft hover:text-ink"
              >
                <User className="h-4 w-4" />
                {displayName}
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
                Keluar
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/login">Masuk</Link>
              </Button>
              <Button variant="default" size="sm" asChild>
                <Link href="/register">Mulai gratis</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-soft md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="border-b border-hairline bg-canvas md:hidden">
          <nav className="mx-auto flex max-w-content flex-col px-lg py-md" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-sm py-xs text-nav-link text-ink/60 transition-colors hover:bg-surface-soft hover:text-ink"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-md flex flex-col gap-xs border-t border-hairline pt-md">
              {user ? (
                <>
                  <Link
                    href={homeLink}
                    className="flex items-center gap-xs rounded-full px-sm py-xs text-body-sm text-ink/60 hover:bg-surface-soft hover:text-ink"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    {displayName}
                  </Link>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    Keluar
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" size="sm" className="w-full" asChild>
                    <Link href="/login">Masuk</Link>
                  </Button>
                  <Button variant="default" size="sm" className="w-full" asChild>
                    <Link href="/register">Mulai gratis</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
