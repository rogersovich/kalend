import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import DayHero from "@/components/calendar/DayHero";
import MasehiCard from "@/components/calendar/MasehiCard";
import WetonCard from "@/components/calendar/WetonCard";
import HolidayDetailCard from "@/components/calendar/HolidayDetailCard";
import LongWeekendRelated from "@/components/calendar/LongWeekendRelated";
import DayNav from "@/components/calendar/DayNav";
import MiniCalendarSidebar from "@/components/calendar/MiniCalendarSidebar";
import { getHolidaysByDate, getHolidaysByMonth } from "@/lib/calendar/holidays";
import { getHolidaysByYear } from "@/lib/calendar/holidays";
import { calculateLongWeekends } from "@/lib/calendar/longweekend";
import { DAY_NAMES_FULL_ID, MONTH_NAMES_ID, MIN_YEAR, MAX_YEAR, CountryCode } from "@/lib/calendar/constants";
import { calculateWeton } from "@/lib/calendar/weton";

interface Props {
  params: { year: string; month: string; date: string };
  searchParams: { country?: string };
}

const MONTH_SLUG_MAP: Record<string, number> = {
  januari: 1, februari: 2, maret: 3, april: 4, mei: 5, juni: 6,
  juli: 7, agustus: 8, september: 9, oktober: 10, november: 11, desember: 12,
};

export async function generateStaticParams() {
  const params = [];
  for (let year = MIN_YEAR; year <= MAX_YEAR; year++) {
    for (const [slug, monthNum] of Object.entries(MONTH_SLUG_MAP)) {
      const daysInMonth = new Date(year, monthNum, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        params.push({ year: String(year), month: slug, date: String(d) });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
  const year = Number(params.year);
  const monthNum = MONTH_SLUG_MAP[params.month.toLowerCase()];
  const day = Number(params.date);
  if (!monthNum || isNaN(day)) return {};

  const country = (searchParams.country === "MY" ? "MY" : "ID") as CountryCode;
  const date = new Date(year, monthNum - 1, day);
  const dayName = DAY_NAMES_FULL_ID[date.getDay()];
  const monthName = MONTH_NAMES_ID[monthNum - 1];
  const weton = calculateWeton(date);

  const holidays = await getHolidaysByDate(country, date);
  const holidayInfo = holidays[0] ? `${holidays[0].name}.` : "";

  const title = `${dayName}, ${day} ${monthName} ${year} | Kalend`;
  const description = `${dayName} ${day} ${monthName} ${year}. Weton: ${weton.weton} (Neptu ${weton.neptuTotal}). ${holidayInfo}`;

  const qs = country !== "ID" ? `?country=${country}` : "";
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    alternates: { canonical: `/${year}/${params.month}/${day}${qs}` },
  };
}

export default async function DayPage({ params, searchParams }: Props) {
  const year = Number(params.year);
  const monthNum = MONTH_SLUG_MAP[params.month.toLowerCase()];
  const day = Number(params.date);

  if (isNaN(year) || year < MIN_YEAR || year > MAX_YEAR || !monthNum || isNaN(day) || day < 1 || day > 31) {
    notFound();
  }

  const date = new Date(year, monthNum - 1, day);
  if (date.getMonth() !== monthNum - 1) notFound(); // invalid date (e.g. Feb 30)

  const country = (searchParams.country === "MY" ? "MY" : "ID") as CountryCode;
  const qs = country !== "ID" ? `?country=${country}` : "";
  const monthSlug = params.month.toLowerCase();
  const monthName = MONTH_NAMES_ID[monthNum - 1];

  const [holidays, monthHolidays, yearHolidays] = await Promise.all([
    getHolidaysByDate(country, date),
    getHolidaysByMonth(country, year, monthNum),
    getHolidaysByYear(country, year),
  ]);

  const longWeekends = calculateLongWeekends(year, yearHolidays, 3);
  const dateStr = `${year}-${String(monthNum).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
  const relatedPeriod = longWeekends.find((p) =>
    p.days.some((d) => d.dateStr === dateStr)
  ) ?? null;

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
              { label: monthName, href: `/${year}/${monthSlug}${qs}` },
              { label: `${day} ${monthName}` },
            ]}
          />
        </div>

        {/* Day nav */}
        <div className="mb-md">
          <DayNav date={date} country={country} />
        </div>

        {/* 2-col layout */}
        <div className="grid grid-cols-1 gap-xl lg:grid-cols-[1fr_280px]">
          {/* Main */}
          <div className="flex flex-col gap-lg">
            <DayHero date={date} holidays={holidays} />

            <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
              <MasehiCard date={date} />
              <WetonCard date={date} />
            </div>

            {holidays.length > 0 && <HolidayDetailCard holidays={holidays} />}

            {relatedPeriod && (
              <LongWeekendRelated period={relatedPeriod} country={country} />
            )}
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-lg">
            <MiniCalendarSidebar
              activeDate={date}
              holidays={monthHolidays}
              country={country}
            />

            <div className="rounded-lg border border-hairline bg-canvas p-lg">
              <h3 className="mb-sm font-mono text-caption uppercase tracking-widest text-muted">
                Tambah Event
              </h3>
              <p className="font-display text-body-sm text-muted">
                Login untuk menambah event pribadi di tanggal ini.
              </p>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
