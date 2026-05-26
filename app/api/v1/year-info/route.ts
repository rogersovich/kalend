import { withApiAuth, apiSuccess, apiError } from "@/lib/api/middleware";
import { getHolidaysByYear } from "@/lib/calendar/holidays";
import { getShio, getHijriYears } from "@/lib/calendar/constants";

export const GET = withApiAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country")?.toUpperCase() ?? "ID";
  const year = Number(searchParams.get("year") ?? new Date().getFullYear());

  if (!["ID", "MY"].includes(country)) return apiError("INVALID_PARAM", "country must be ID or MY");
  if (isNaN(year) || year < 2020 || year > 2030) return apiError("INVALID_PARAM", "year must be 2020–2030");

  const holidays = await getHolidaysByYear(country, year);
  const national = holidays.filter((h) => h.type === "national");
  const jointLeave = holidays.filter((h) => h.type === "joint-leave");

  return apiSuccess({
    year,
    country,
    shio: getShio(year),
    hijri: getHijriYears(year),
    totalNationalHolidays: national.length,
    totalJointLeaves: jointLeave.length,
  });
});
