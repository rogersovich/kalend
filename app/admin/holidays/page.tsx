import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import HolidayFilters from "@/components/admin/HolidayFilters";
import AddHolidayButton from "@/components/admin/AddHolidayButton";
import HolidayTable from "@/components/admin/HolidayTable";

export const metadata: Metadata = {
  title: "Kelola Hari Libur — Admin Kalend",
  robots: { index: false },
};

interface Props {
  searchParams: { country?: string; year?: string; type?: string; region?: string };
}


export default async function AdminHolidaysPage({ searchParams }: Props) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const country = searchParams.country ?? "ID";
  const year = Number(searchParams.year ?? new Date().getFullYear());
  const type = searchParams.type;
  const regionCode = searchParams.region;

  const countryRecord = await prisma.country.findUnique({ where: { code: country } });
  if (!countryRecord) redirect("/admin");

  const startDate = new Date(`${year}-01-01`);
  const endDate = new Date(`${year}-12-31`);

  const holidays = await prisma.holiday.findMany({
    where: {
      countryId: countryRecord.id,
      date: { gte: startDate, lte: endDate },
      ...(type ? { type } : {}),
      ...(regionCode ? { region: { code: regionCode } } : {}),
    },
    include: { region: { select: { name: true } } },
    orderBy: { date: "asc" },
  });

  const regions = country === "MY"
    ? await prisma.region.findMany({ where: { countryId: countryRecord.id }, orderBy: { name: "asc" } })
    : [];

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
          <p className="font-display text-body-sm text-ink sm:text-body-lg">{holidays.length} data · {country} {year}</p>
        </div>

        {/* Unified Actions Toolbar */}
        <div className="mb-md flex flex-col gap-sm sm:flex-row sm:items-center sm:justify-between">
          <HolidayFilters
            country={country}
            year={year}
            type={type}
            region={regionCode}
            regions={regions.map((r) => ({ code: r.code, name: r.name }))}
          />
          <AddHolidayButton country={country} year={year} />
        </div>

        <HolidayTable holidays={holidays} />
      </main>
      <Footer />
    </>
  );
}
