import { notFound } from "next/navigation";
import type { Metadata } from "next";
import YearGrid from "@/components/calendar/YearGrid";
import YearNav from "@/components/calendar/YearNav";
import YearInfoBand from "@/components/calendar/YearInfoBand";
import CountrySwitcher from "@/components/calendar/CountrySwitcher";
import { getHolidaysByYear } from "@/lib/calendar/holidays";
import { MIN_YEAR, MAX_YEAR, getShio, getHijriYears, CountryCode } from "@/lib/calendar/constants";

interface Props {
  params: { year: string };
  searchParams: { country?: string };
}

export async function generateStaticParams() {
  const years = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => ({
    year: String(MIN_YEAR + i),
  }));
  return years;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const year = Number(params.year);
  const country = (searchParams.country === "MY" ? "MY" : "ID") as CountryCode;
  const countryName = country === "ID" ? "Indonesia" : "Malaysia";

  const holidays = await getHolidaysByYear(country, year);
  const nationalCount = holidays.filter((h) => h.type === "national").length;
  const jointCount = holidays.filter((h) => h.type === "joint-leave").length;

  const title = `Kalender ${year} ${countryName} — ${nationalCount} Hari Libur Nasional | Kalend`;
  const description = `Kalender ${year} ${countryName} lengkap dengan ${nationalCount} hari libur nasional dan ${jointCount} cuti bersama. Termasuk penanggalan ${getHijriYears(year)} dan Tahun ${getShio(year)}.`;
  const url = `/${year}${country !== "ID" ? `?country=${country}` : ""}`;

  return {
    title,
    description,
    openGraph: { title, description, url, type: "website" },
    alternates: { canonical: url },
  };
}

export default async function YearPage({ params, searchParams }: Props) {
  const year = Number(params.year);

  if (isNaN(year) || year < MIN_YEAR || year > MAX_YEAR) {
    notFound();
  }

  const country = (searchParams.country === "MY" ? "MY" : "ID") as CountryCode;
  const holidays = await getHolidaysByYear(country, year);

  return (
    <main className="mx-auto max-w-content px-lg py-xl">
        {/* Header */}
        <div className="mb-lg flex flex-col items-center gap-md">
          <CountrySwitcher current={country} />
          <YearNav year={year} country={country} />
        </div>

        {/* Info band */}
        <div className="mb-lg">
          <YearInfoBand year={year} holidays={holidays} country={country} />
        </div>

        {/* Legend */}
        <div className="mb-md flex flex-wrap items-center gap-md">
          <div className="flex items-center gap-xs font-mono text-caption text-ink">
            <span className="h-[6px] w-[6px] rounded-full bg-error" />
            Hari Libur
          </div>
          <div className="flex items-center gap-xs font-mono text-caption text-ink">
            <span className="h-[6px] w-[6px] rounded-full bg-badge-orange" />
            Cuti Bersama
          </div>
          <div className="flex items-center gap-xs font-mono text-caption text-ink">
            <span className="inline-block h-3 w-3 rounded-sm bg-surface-strong" />
            Sabtu/Minggu
          </div>
        </div>

        {/* Calendar grid */}
        {holidays !== null ? (
          <YearGrid year={year} holidays={holidays} country={country} />
        ) : (
          <p className="py-section text-center text-body text-ink">
            Data belum tersedia untuk tahun {year}.
          </p>
        )}
    </main>
  );
}
