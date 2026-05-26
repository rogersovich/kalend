import { withApiAuth, apiSuccess, apiError } from "@/lib/api/middleware";
import { getHolidaysByYear, countWorkdays } from "@/lib/calendar/holidays";

export const GET = withApiAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const startStr = searchParams.get("start");
  const endStr = searchParams.get("end");
  const country = searchParams.get("country")?.toUpperCase() ?? "ID";

  if (!startStr || !endStr) return apiError("INVALID_PARAM", "start and end are required (YYYY-MM-DD)");
  if (!["ID", "MY"].includes(country)) return apiError("INVALID_PARAM", "country must be ID or MY");

  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return apiError("INVALID_PARAM", "start and end must be valid YYYY-MM-DD");
  }
  if (start > end) return apiError("INVALID_PARAM", "start must be before or equal to end");

  const year = start.getFullYear();
  const holidays = await getHolidaysByYear(country, year);
  // If range spans multiple years, also fetch next year
  const endYear = end.getFullYear();
  const allHolidays = endYear > year
    ? [...holidays, ...(await getHolidaysByYear(country, endYear))]
    : holidays;

  const workdays = countWorkdays(start, end, allHolidays);
  const totalDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1;

  return apiSuccess({ start: startStr, end: endStr, country, workdays, totalDays });
});
