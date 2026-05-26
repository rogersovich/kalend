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
        <div className="mb-lg">
          <p className="mb-sm font-mono text-eyebrow uppercase tracking-widest text-muted">Admin</p>
          <h1 className="font-display text-display-lg font-normal text-ink">Admin Panel</h1>
          <p className="font-display text-body text-muted">Kelola data kalender Kalend.</p>
        </div>

        <div className="grid grid-cols-1 gap-md sm:grid-cols-3">
          {cards.map(({ href, label, desc, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="group flex items-center gap-md rounded-lg border border-hairline bg-canvas p-lg transition-shadow hover:shadow-elevated"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft text-ink transition-colors group-hover:bg-primary group-hover:text-white">
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-display font-medium text-ink">{label}</p>
                <p className="font-mono text-caption text-muted">{desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted/40 group-hover:text-ink" />
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
