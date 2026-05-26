import { NextResponse } from "next/server";
import { getHolidaysByYear, countWorkdays, isWeekend } from "@/lib/calendar/holidays";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const startStr = searchParams.get("start");
  const endStr = searchParams.get("end");
  const country = searchParams.get("country")?.toUpperCase() ?? "ID";

  if (!startStr || !endStr) return NextResponse.json({ error: "start and end required" }, { status: 400 });

  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return NextResponse.json({ error: "Invalid dates" }, { status: 400 });
  }
  if (start > end) return NextResponse.json({ error: "start must be <= end" }, { status: 400 });

  const year = start.getFullYear();
  const holidays = await getHolidaysByYear(country, year);
  const allHolidays = end.getFullYear() > year
    ? [...holidays, ...(await getHolidaysByYear(country, end.getFullYear()))]
    : holidays;

  const totalDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;
  const workdays = countWorkdays(start, end, allHolidays);

  // Count weekends
  let weekends = 0;
  const cur = new Date(start);
  while (cur <= end) {
    if (isWeekend(cur)) weekends++;
    cur.setDate(cur.getDate() + 1);
  }

  const holidaySet = new Set(allHolidays.map((h) => h.date.toISOString().slice(0, 10)));
  let holidayCount = 0;
  const cur2 = new Date(start);
  while (cur2 <= end) {
    const ds = cur2.toISOString().slice(0, 10);
    if (holidaySet.has(ds) && !isWeekend(cur2)) holidayCount++;
    cur2.setDate(cur2.getDate() + 1);
  }

  return NextResponse.json({ workdays, totalDays, weekends, holidays: holidayCount });
}
