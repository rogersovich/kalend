import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";

export const metadata: Metadata = {
  title: "Kelola Hari Libur — Admin Kalend",
  robots: { index: false },
};

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
  regional: "bg-surface-soft text-muted",
};

const selectCls = "rounded-md border border-hairline bg-canvas px-md py-xs font-display text-body-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink";

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
          <Link href="/admin" className="flex items-center gap-1 font-display text-body-sm text-muted hover:text-ink">
            <ChevronLeft className="h-3 w-3" /> Admin
          </Link>
        </div>

        <div className="mb-lg flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-display-lg font-normal text-ink">
            Hari Libur ({holidays.length})
          </h1>

          <div className="flex gap-sm">
            <select
              defaultValue={country}
              onChange={(e) => { window.location.href = `/admin/holidays?country=${e.target.value}&year=${year}`; }}
              className={selectCls}
            >
              <option value="ID">Indonesia</option>
              <option value="MY">Malaysia</option>
            </select>
            <select
              defaultValue={year}
              onChange={(e) => { window.location.href = `/admin/holidays?country=${country}&year=${e.target.value}`; }}
              className={selectCls}
            >
              {Array.from({ length: 11 }, (_, i) => 2020 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-hairline">
          <table className="w-full text-left">
            <thead className="bg-surface-soft">
              <tr>
                {["Tanggal", "Nama", "Tipe", "Region"].map((h) => (
                  <th key={h} className="px-md py-sm font-mono text-caption uppercase tracking-widest text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holidays.map((h) => {
                const d = new Date(h.date);
                const dateStr = `${d.getDate()} ${MONTH_NAMES_ID[d.getMonth()]} ${d.getFullYear()}`;
                return (
                  <tr key={h.id} className="border-t border-hairline hover:bg-surface-soft">
                    <td className="px-md py-sm font-mono text-body-sm text-ink">{dateStr}</td>
                    <td className="px-md py-sm font-display text-body-sm text-ink">{h.name}</td>
                    <td className="px-md py-sm">
                      <span className={`rounded-pill px-sm py-xxs font-mono text-caption ${TYPE_CLASSES[h.type] ?? "bg-surface-soft text-muted"}`}>
                        {TYPE_LABELS[h.type] ?? h.type}
                      </span>
                    </td>
                    <td className="px-md py-sm font-mono text-caption text-muted">
                      {h.region?.name ?? "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {holidays.length === 0 && (
            <p className="py-xl text-center font-display text-body-sm text-muted">
              Tidak ada data hari libur untuk {country} {year}.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
