import { withApiAuth, apiSuccess, apiError } from "@/lib/api/middleware";
import { getHolidaysByYear } from "@/lib/calendar/holidays";
import { calculateLongWeekends } from "@/lib/calendar/longweekend";

export const GET = withApiAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country")?.toUpperCase() ?? "ID";
  const year = Number(searchParams.get("year") ?? new Date().getFullYear());
  const minDays = Number(searchParams.get("min_days") ?? 3);

  if (!["ID", "MY"].includes(country)) return apiError("INVALID_PARAM", "country must be ID or MY");
  if (isNaN(year) || year < 2020 || year > 2030) return apiError("INVALID_PARAM", "year must be 2020–2030");

  const holidays = await getHolidaysByYear(country, year);
  const periods = calculateLongWeekends(year, holidays, minDays);

  const data = periods.map((p) => ({
    startDate: p.startDate.toISOString().slice(0, 10),
    endDate: p.endDate.toISOString().slice(0, 10),
    totalDays: p.totalDays,
    holidays: p.holidays.map((h) => ({ name: h.name, date: h.date.toISOString().slice(0, 10) })),
    jointLeaves: p.jointLeaves.map((h) => ({ name: h.name, date: h.date.toISOString().slice(0, 10) })),
    days: p.days.map((d) => ({ date: d.dateStr, type: d.type })),
  }));

  return apiSuccess(data, { total: data.length, country, year, minDays });
});
