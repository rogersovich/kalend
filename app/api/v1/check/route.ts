import { withApiAuth, apiSuccess, apiError } from "@/lib/api/middleware";
import { getHolidaysByDate, isWeekend } from "@/lib/calendar/holidays";

export const GET = withApiAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get("date");
  const country = searchParams.get("country")?.toUpperCase() ?? "ID";

  if (!dateStr) return apiError("INVALID_PARAM", "date is required (YYYY-MM-DD)");
  if (!["ID", "MY"].includes(country)) return apiError("INVALID_PARAM", "country must be ID or MY");

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return apiError("INVALID_PARAM", "date must be valid YYYY-MM-DD");

  const holidays = await getHolidaysByDate(country, date);
  const weekend = isWeekend(date);
  const isHoliday = holidays.length > 0;

  return apiSuccess({
    date: dateStr,
    country,
    isHoliday,
    isWeekend: weekend,
    isWorkday: !isHoliday && !weekend,
    holidays: holidays.map((h) => ({ name: h.name, type: h.type })),
  });
});
