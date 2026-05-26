import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Kelola Hari Libur — Admin Kalend",
  robots: { index: false },
};
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";

interface Props {
  searchParams: { country?: string; year?: string };
}

const TYPE_LABELS: Record<string, string> = {
  national: "Nasional",
  "joint-leave": "Cuti Bersama",
  regional: "Regional",
};

const TYPE_CLASSES: Record<string, string> = {
  national: "bg-error/10 text-error",
  "joint-leave": "bg-badge-orange/10 text-badge-orange",
  regional: "bg-brand-accent/10 text-brand-accent",
};

export default async function AdminHolidaysPage({ searchParams }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const country = searchParams.country ?? "ID";
  const year = Number(searchParams.year ?? new Date().getFullYear());

  const countryRecord = await prisma.country.findUnique({ where: { code: country } });
  if (!countryRecord) redirect("/admin");

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  const holidays = await prisma.holiday.findMany({
    where: {
      countryId: countryRecord.id,
      date: { gte: startDate, lte: endDate },
    },
    include: { region: { select: { name: true } } },
    orderBy: { date: "asc" },
  });

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-content px-lg py-xl">
        <div className="mb-md">
          <Link href="/admin" className="flex items-center gap-1 text-caption text-muted hover:text-ink">
            <ChevronLeft className="h-3 w-3" /> Admin
          </Link>
        </div>

        <div className="mb-lg flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-title-md font-semibold text-ink">
            Hari Libur ({holidays.length})
          </h1>

          <div className="flex gap-3">
            <select
              defaultValue={country}
              onChange={(e) => { window.location.href = `/admin/holidays?country=${e.target.value}&year=${year}`; }}
              className="rounded-lg border border-hairline bg-surface-soft px-3 py-1.5 text-body-sm text-ink outline-none"
            >
              <option value="ID">Indonesia</option>
              <option value="MY">Malaysia</option>
            </select>
            <select
              defaultValue={year}
              onChange={(e) => { window.location.href = `/admin/holidays?country=${country}&year=${e.target.value}`; }}
              className="rounded-lg border border-hairline bg-surface-soft px-3 py-1.5 text-body-sm text-ink outline-none"
            >
              {Array.from({ length: 11 }, (_, i) => 2020 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-hairline">
          <table className="w-full text-left">
            <thead className="bg-surface-soft">
              <tr>
                {["Tanggal", "Nama", "Tipe", "Region"].map((h) => (
                  <th key={h} className="px-4 py-3 text-caption font-semibold text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holidays.map((h) => {
                const d = new Date(h.date);
                const dateStr = `${d.getDate()} ${MONTH_NAMES_ID[d.getMonth()]} ${d.getFullYear()}`;
                return (
                  <tr key={h.id} className="border-t border-hairline hover:bg-surface-soft">
                    <td className="px-4 py-3 font-mono text-body-sm text-ink">{dateStr}</td>
                    <td className="px-4 py-3 text-body-sm text-ink">{h.name}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-caption font-medium ${TYPE_CLASSES[h.type] ?? "bg-surface-soft text-muted"}`}>
                        {TYPE_LABELS[h.type] ?? h.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-caption text-muted">
                      {h.region?.name ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {holidays.length === 0 && (
            <p className="py-xl text-center text-body-sm text-muted">
              Tidak ada data hari libur untuk {country} {year}.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
