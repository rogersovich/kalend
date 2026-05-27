import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Breadcrumb from "@/components/Breadcrumb";
import YearNav from "@/components/calendar/YearNav";
import CountrySwitcher from "@/components/calendar/CountrySwitcher";
import LongWeekendList from "@/components/calendar/LongWeekendList";
import LongWeekendFilter from "@/components/calendar/LongWeekendFilter";
import { getHolidaysByYear } from "@/lib/calendar/holidays";
import { calculateLongWeekends } from "@/lib/calendar/longweekend";
import { MIN_YEAR, MAX_YEAR, CountryCode } from "@/lib/calendar/constants";

interface Props {
  params: { year: string };
  searchParams: { country?: string; min?: string };
}

export async function generateStaticParams() {
  return Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => ({
    year: String(MIN_YEAR + i),
  }));
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const year = Number(params.year);
  const country = (searchParams.country === "MY" ? "MY" : "ID") as CountryCode;
  const countryName = country === "ID" ? "Indonesia" : "Malaysia";

  const holidays = await getHolidaysByYear(country, year);
  const periods = calculateLongWeekends(year, holidays, 3);

  const title = `Long Weekend ${year} ${countryName} — Daftar Lengkap | Kalend`;
  const description = `Daftar lengkap long weekend ${year} ${countryName}. ${periods.length} periode libur panjang sepanjang tahun.`;

  const qs = country !== "ID" ? `?country=${country}` : "";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    alternates: { canonical: `/long-weekends/${year}${qs}` },
  };
}

export default async function LongWeekendsPage({ params, searchParams }: Props) {
  const year = Number(params.year);
  if (isNaN(year) || year < MIN_YEAR || year > MAX_YEAR) notFound();

  const country = (searchParams.country === "MY" ? "MY" : "ID") as CountryCode;
  const minDays = Math.max(3, Math.min(5, Number(searchParams.min) || 3));
  const qs = country !== "ID" ? `?country=${country}` : "";

  const holidays = await getHolidaysByYear(country, year);
  const periods = calculateLongWeekends(year, holidays, 3);

  return (
    <main className="mx-auto max-w-content px-lg py-xl">
        <div className="mb-md">
          <Breadcrumb
            items={[
              { label: "Beranda", href: "/" },
              { label: String(year), href: `/${year}${qs}` },
              { label: "Long Weekend" },
            ]}
          />
        </div>

        {/* Color block hero */}
        <div className="mb-xl rounded-lg bg-block-lime p-xxl">
          <p className="mb-sm font-mono text-eyebrow uppercase tracking-widest text-ink/60">
            Long Weekend
          </p>
          <h1 className="font-display text-display-lg font-normal text-ink">{year}</h1>
          <p className="mt-sm font-display text-body-lg text-ink">
            {periods.length} periode libur panjang ditemukan
          </p>
        </div>

        {/* Controls */}
        <div className="mb-lg flex flex-wrap items-center justify-between gap-md">
          <div className="flex flex-wrap items-center gap-md">
            <YearNav year={year} country={country} />
            <LongWeekendFilter current={minDays} />
          </div>
          <CountrySwitcher current={country} />
        </div>

        <LongWeekendList periods={periods} country={country} minDays={minDays} />
    </main>
  );
}
