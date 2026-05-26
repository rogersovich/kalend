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

export async function getHolidaysByYear(
  countryCode: string,
  year: number
): Promise<HolidayData[]> {
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
    date: h.date,
    name: h.name,
    type: h.type,
    description: h.description,
    regionCode: h.region?.code ?? null,
    regionName: h.region?.name ?? null,
  }));
}

export async function getHolidaysByMonth(
  countryCode: string,
  year: number,
  month: number
): Promise<HolidayData[]> {
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
    date: h.date,
    name: h.name,
    type: h.type,
    description: h.description,
    regionCode: h.region?.code ?? null,
    regionName: h.region?.name ?? null,
  }));
}

export async function getHolidaysByDate(
  countryCode: string,
  date: Date
): Promise<HolidayData[]> {
  const day = new Date(date);
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
    date: h.date,
    name: h.name,
    type: h.type,
    description: h.description,
    regionCode: h.region?.code ?? null,
    regionName: h.region?.name ?? null,
  }));
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
