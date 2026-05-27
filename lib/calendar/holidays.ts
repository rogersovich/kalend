import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface HolidayData {
  id: string;
  date: Date;
  name: string;
  type: string;
  description: string | null;
  regionCode: string | null;
  regionName: string | null;
}

// Serializable shape for cache storage (Date → string)
interface CachedHoliday {
  id: string;
  date: string;
  name: string;
  type: string;
  description: string | null;
  regionCode: string | null;
  regionName: string | null;
}

function toHolidayData(h: CachedHoliday): HolidayData {
  return { ...h, date: new Date(h.date) };
}

// Cache forever — holiday data is pre-seeded and never changes at runtime
const _getHolidaysByYear = unstable_cache(
  async (countryCode: string, year: number): Promise<CachedHoliday[]> => {
    const start = new Date(`${year}-01-01`);
    const end = new Date(`${year}-12-31`);

    const holidays = await prisma.holiday.findMany({
      where: {
        country: { code: countryCode },
        date: { gte: start, lte: end },
      },
      include: { region: true },
      orderBy: { date: "asc" },
    });

    return holidays.map((h) => ({
      id: h.id,
      date: h.date.toISOString(),
      name: h.name,
      type: h.type,
      description: h.description,
      regionCode: h.region?.code ?? null,
      regionName: h.region?.name ?? null,
    }));
  },
  ["holidays-by-year"],
  { revalidate: false, tags: ["holidays"] }
);

const _getHolidaysByMonth = unstable_cache(
  async (countryCode: string, year: number, month: number): Promise<CachedHoliday[]> => {
    const start = new Date(`${year}-${String(month).padStart(2, "0")}-01`);
    const lastDay = new Date(year, month, 0).getDate();
    const end = new Date(`${year}-${String(month).padStart(2, "0")}-${lastDay}`);

    const holidays = await prisma.holiday.findMany({
      where: {
        country: { code: countryCode },
        date: { gte: start, lte: end },
      },
      include: { region: true },
      orderBy: { date: "asc" },
    });

    return holidays.map((h) => ({
      id: h.id,
      date: h.date.toISOString(),
      name: h.name,
      type: h.type,
      description: h.description,
      regionCode: h.region?.code ?? null,
      regionName: h.region?.name ?? null,
    }));
  },
  ["holidays-by-month"],
  { revalidate: false, tags: ["holidays"] }
);

const _getHolidaysByDate = unstable_cache(
  async (countryCode: string, dateStr: string): Promise<CachedHoliday[]> => {
    const day = new Date(dateStr);
    day.setUTCHours(0, 0, 0, 0);

    const holidays = await prisma.holiday.findMany({
      where: {
        country: { code: countryCode },
        date: day,
      },
      include: { region: true },
    });

    return holidays.map((h) => ({
      id: h.id,
      date: h.date.toISOString(),
      name: h.name,
      type: h.type,
      description: h.description,
      regionCode: h.region?.code ?? null,
      regionName: h.region?.name ?? null,
    }));
  },
  ["holidays-by-date"],
  { revalidate: false, tags: ["holidays"] }
);

export async function getHolidaysByYear(
  countryCode: string,
  year: number
): Promise<HolidayData[]> {
  const cached = await _getHolidaysByYear(countryCode, year);
  return cached.map(toHolidayData);
}

export async function getHolidaysByMonth(
  countryCode: string,
  year: number,
  month: number
): Promise<HolidayData[]> {
  const cached = await _getHolidaysByMonth(countryCode, year, month);
  return cached.map(toHolidayData);
}

export async function getHolidaysByDate(
  countryCode: string,
  date: Date
): Promise<HolidayData[]> {
  const dateStr = date.toISOString().slice(0, 10);
  const cached = await _getHolidaysByDate(countryCode, dateStr);
  return cached.map(toHolidayData);
}

export function isHoliday(holidays: HolidayData[], date: Date): boolean {
  const d = date.toISOString().slice(0, 10);
  return holidays.some((h) => h.date.toISOString().slice(0, 10) === d);
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function countWorkdays(
  start: Date,
  end: Date,
  holidays: HolidayData[]
): number {
  const holidaySet = new Set(
    holidays
      .filter((h) => h.type !== "joint-leave")
      .map((h) => h.date.toISOString().slice(0, 10))
  );

  let count = 0;
  const cur = new Date(start);
  while (cur <= end) {
    const dateStr = cur.toISOString().slice(0, 10);
    if (!isWeekend(cur) && !holidaySet.has(dateStr)) {
      count++;
    }
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}
