import { withApiAuth, apiSuccess, apiError } from "@/lib/api/middleware";
import { getHolidaysByYear } from "@/lib/calendar/holidays";
import { calculateLeaveStrategies } from "@/lib/calendar/longweekend";

export const GET = withApiAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country")?.toUpperCase() ?? "ID";
  const year = Number(searchParams.get("year") ?? new Date().getFullYear());
  const maxLeave = Number(searchParams.get("max_leave") ?? 3);

  if (!["ID", "MY"].includes(country)) return apiError("INVALID_PARAM", "country must be ID or MY");
  if (isNaN(year) || year < 2020 || year > 2030) return apiError("INVALID_PARAM", "year must be 2020–2030");
  if (isNaN(maxLeave) || maxLeave < 0 || maxLeave > 14) {
    return apiError("INVALID_PARAM", "max_leave must be 0–14");
  }

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

  return apiSuccess(data, { country, year, maxLeave });
});
