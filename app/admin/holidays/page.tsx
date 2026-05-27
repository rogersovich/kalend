import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";
import HolidayFilters from "@/components/admin/HolidayFilters";
import HolidayTableActions from "@/components/admin/HolidayTableActions";
import AddHolidayButton from "@/components/admin/AddHolidayButton";

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
  regional: "bg-surface-soft text-ink/60",
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
      <main className="mx-auto max-w-content px-lg py-md sm:py-xl">
        <div className="mb-md">
          <Link href="/admin" className="inline-flex items-center gap-xs font-mono text-caption uppercase tracking-widest text-ink/60 transition-colors hover:text-ink">
            <ChevronLeft className="h-3 w-3" /> Admin
          </Link>
        </div>

        {/* Color block hero */}
        <div className="mb-lg rounded-lg bg-block-lime p-lg sm:mb-xl sm:p-xxl">
          <p className="mb-sm font-mono text-sm uppercase tracking-widest text-ink/60 sm:text-caption">Admin</p>
          <h1 className="mb-md font-display text-display-md font-normal text-ink leading-tight sm:text-display-lg">
            Hari Libur
          </h1>
          <div className="flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between sm:gap-md">
            <p className="font-display text-body-sm text-ink sm:text-body-lg">{holidays.length} data · {country} {year}</p>
            <HolidayFilters country={country} year={year} />
          </div>
        </div>

        <div className="mb-md flex justify-end">
          <AddHolidayButton country={country} year={year} />
        </div>

        <div className="overflow-hidden rounded-lg border border-hairline">
          <div className="max-h-[600px] overflow-auto">
            <table className="w-full min-w-[520px] text-left">
              <thead className="bg-surface-soft">
                <tr>
                  {["Tanggal", "Nama", "Tipe", "Region", "Aksi"].map((h) => (
                    <th key={h} className="px-md py-sm font-mono text-caption uppercase tracking-widest text-ink/60">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {holidays.map((h) => {
                  const d = new Date(h.date);
                  const dateStr = `${d.getDate()} ${MONTH_NAMES_ID[d.getMonth()]} ${d.getFullYear()}`;
                  return (
                    <tr key={h.id} className="border-t border-hairline hover:bg-surface-soft">
                      <td className="px-md py-sm font-mono text-caption text-ink">{dateStr}</td>
                      <td className="px-md py-sm font-display text-body-sm text-ink">{h.name}</td>
                      <td className="px-md py-sm">
                        <span className={`rounded-pill px-sm py-xxs font-mono text-caption ${TYPE_CLASSES[h.type] ?? "bg-surface-soft text-ink/60"}`}>
                          {TYPE_LABELS[h.type] ?? h.type}
                        </span>
                      </td>
                      <td className="px-md py-sm font-mono text-caption text-ink/60">
                        {h.region?.name ?? "—"}
                      </td>
                      <td className="px-md py-sm">
                        <HolidayTableActions
                          holiday={{ id: h.id, name: h.name, date: h.date.toISOString(), type: h.type, description: h.description }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {holidays.length === 0 && (
            <p className="py-xl text-center font-display text-body text-ink">
              Tidak ada data hari libur untuk {country} {year}.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
