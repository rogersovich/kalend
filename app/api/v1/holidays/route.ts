import { withApiAuth, apiSuccess, apiError } from "@/lib/api/middleware";
import { getHolidaysByYear, getHolidaysByMonth } from "@/lib/calendar/holidays";

export const GET = withApiAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country")?.toUpperCase() ?? "ID";
  const year = Number(searchParams.get("year") ?? new Date().getFullYear());
  const month = searchParams.get("month") ? Number(searchParams.get("month")) : null;
  const type = searchParams.get("type"); // national | joint-leave | regional

  if (!["ID", "MY"].includes(country)) return apiError("INVALID_PARAM", "country must be ID or MY");
  if (isNaN(year) || year < 2020 || year > 2030) return apiError("INVALID_PARAM", "year must be 2020–2030");
  if (month !== null && (isNaN(month) || month < 1 || month > 12)) {
    return apiError("INVALID_PARAM", "month must be 1–12");
  }

  const holidays = month
    ? await getHolidaysByMonth(country, year, month)
    : await getHolidaysByYear(country, year);

  const filtered = type ? holidays.filter((h) => h.type === type) : holidays;

  const data = filtered.map((h) => ({
    id: h.id,
    date: h.date.toISOString().slice(0, 10),
    name: h.name,
    type: h.type,
    description: h.description,
    regionCode: h.regionCode,
    regionName: h.regionName,
  }));

  return apiSuccess(data, { total: data.length, country, year, ...(month ? { month } : {}) });
});
