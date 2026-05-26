import { NextResponse } from "next/server";
import { getHolidaysByYear } from "@/lib/calendar/holidays";
import { calculateLeaveStrategies } from "@/lib/calendar/longweekend";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country")?.toUpperCase() ?? "ID";
  const year = Number(searchParams.get("year") ?? new Date().getFullYear());
  const maxLeave = Number(searchParams.get("max_leave") ?? 3);

  if (!["ID", "MY"].includes(country)) return NextResponse.json({ error: "Invalid country" }, { status: 400 });
  if (isNaN(year) || year < 2020 || year > 2030) return NextResponse.json({ error: "Invalid year" }, { status: 400 });

  const holidays = await getHolidaysByYear(country, year);
  const strategies = calculateLeaveStrategies(year, holidays, maxLeave);

  const data = strategies.slice(0, 20).map((s) => ({
    leaveDates: s.leaveDates.map((d) => d.toISOString().slice(0, 10)),
    leaveDaysUsed: s.leaveDates.length,
    totalDaysOff: s.totalDaysOff,
    ratio: Math.round(s.ratio * 100) / 100,
    period: {
      startDate: s.period.startDate.toISOString().slice(0, 10),
      endDate: s.period.endDate.toISOString().slice(0, 10),
      totalDays: s.period.totalDays,
    },
  }));

  return NextResponse.json({ data });
}
