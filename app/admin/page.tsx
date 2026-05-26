import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Upload, CalendarDays, Globe } from "lucide-react";

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
          <h1 className="font-display text-title-md font-semibold text-ink">Admin Panel</h1>
          <p className="text-body-sm text-muted">Kelola data kalender Kalend.</p>
        </div>

        <div className="grid grid-cols-1 gap-md sm:grid-cols-3">
          {cards.map(({ href, label, desc, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-md rounded-xl border border-hairline bg-canvas p-lg transition-shadow hover:shadow-soft"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-ink">{label}</p>
                <p className="text-caption text-muted">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
