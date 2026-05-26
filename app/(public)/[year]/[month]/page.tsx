import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import MonthGrid from "@/components/calendar/MonthGrid";
import MonthNav from "@/components/calendar/MonthNav";
import MonthSidebar from "@/components/calendar/MonthSidebar";
import CountrySwitcher from "@/components/calendar/CountrySwitcher";
import { getHolidaysByMonth } from "@/lib/calendar/holidays";
import { MONTH_NAMES_ID, MIN_YEAR, MAX_YEAR, CountryCode } from "@/lib/calendar/constants";

interface Props {
  params: { year: string; month: string };
  searchParams: { country?: string };
}

const MONTH_SLUG_MAP: Record<string, number> = {
  januari: 1, februari: 2, maret: 3, april: 4, mei: 5, juni: 6,
  juli: 7, agustus: 8, september: 9, oktober: 10, november: 11, desember: 12,
};

export async function generateStaticParams() {
  const params = [];
  for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
    for (const slug of Object.keys(MONTH_SLUG_MAP)) {
      params.push({ year: String(year), month: slug });
    }
  }
  return params;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const year = Number(params.year);
  const monthNum = MONTH_SLUG_MAP[params.month.toLowerCase()];
  if (!monthNum) return {};
  const country = (searchParams.country === "MY" ? "MY" : "ID") as CountryCode;
  const monthName = MONTH_NAMES_ID[monthNum - 1];

  const holidays = await getHolidaysByMonth(country, year, monthNum);
  const holidayNames = holidays
    .filter((h) => h.type === "national")
    .slice(0, 3)
    .map((h) => h.name)
    .join(", ");

  const title = `Kalender ${monthName} ${year} — Hari Libur & Tanggal Merah | Kalend`;
  const description = `Kalender ${monthName} ${year} lengkap. ${holidayNames ? `${holidayNames}.` : "Tidak ada hari libur bulan ini."} Termasuk penanggalan Jawa.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    alternates: { canonical: `/${year}/${params.month}${country !== "ID" ? `?country=${country}` : ""}` },
  };
}

export default async function MonthPage({ params, searchParams }: Props) {
  const year = Number(params.year);
  const monthNum = MONTH_SLUG_MAP[params.month.toLowerCase()];

  if (isNaN(year) || year < MIN_YEAR || year > MAX_YEAR || !monthNum) {
    notFound();
  }

  const country = (searchParams.country === "MY" ? "MY" : "ID") as CountryCode;
  const holidays = await getHolidaysByMonth(country, year, monthNum);
  const monthName = MONTH_NAMES_ID[monthNum - 1];
  const qs = country !== "ID" ? `?country=${country}` : "";

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-content px-lg py-xl">
        {/* Breadcrumb */}
        <div className="mb-md">
          <Breadcrumb
            items={[
              { label: "Beranda", href: "/" },
              { label: String(year), href: `/${year}${qs}` },
              { label: monthName },
            ]}
          />
        </div>

        {/* Header */}
        <div className="mb-lg flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between">
          <MonthNav year={year} month={monthNum} country={country} />
          <CountrySwitcher current={country} />
        </div>

        {/* 2-col layout */}
        <div className="grid grid-cols-1 gap-xl lg:grid-cols-[1fr_280px]">
          <div>
            <MonthGrid year={year} month={monthNum} holidays={holidays} country={country} />
          </div>
          <MonthSidebar year={year} month={monthNum} country={country} holidays={holidays} />
        </div>
      </main>
      <Footer />
    </>
  );
}
