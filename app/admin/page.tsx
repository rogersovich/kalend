import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, CalendarDays, Globe, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin — Kalend",
  robots: { index: false },
};

export default async function AdminPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [totalHolidays, totalCountries] = await Promise.all([
    prisma.holiday.count(),
    prisma.country.count({ where: { isActive: true } }),
  ]);

  const cards = [
    { href: "/admin/import", label: "Import Data", desc: "Upload JSON hari libur", icon: Upload },
    { href: "/admin/holidays", label: "Kelola Hari Libur", desc: `${totalHolidays} total data`, icon: CalendarDays },
    { href: "/admin/holidays?filter=countries", label: "Negara", desc: `${totalCountries} negara aktif`, icon: Globe },
  ];

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-content px-lg py-xl">
        {/* Color block hero */}
        <div className="mb-xl rounded-lg bg-block-coral p-xxl">
          <p className="mb-sm font-mono text-caption uppercase tracking-widest text-ink/60">Admin</p>
          <h1 className="mb-md font-display text-display-lg font-normal text-ink leading-tight">Admin Panel</h1>
          <p className="font-display text-body-lg text-ink">Kelola data kalender Kalend.</p>
        </div>

        <div className="grid grid-cols-1 gap-md sm:grid-cols-3">
          {cards.map(({ href, label, desc, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-md rounded-lg border border-hairline bg-canvas p-lg transition-opacity hover:opacity-80"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft text-ink">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display font-medium text-ink">{label}</p>
                <p className="font-mono text-caption text-ink/60">{desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-ink/30" />
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
