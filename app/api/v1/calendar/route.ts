import { withApiAuth, apiSuccess, apiError } from "@/lib/api/middleware";
import { getHolidaysByMonth, isWeekend } from "@/lib/calendar/holidays";

export const GET = withApiAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get("country")?.toUpperCase() ?? "ID";
  const year = Number(searchParams.get("year") ?? new Date().getFullYear());
  const month = Number(searchParams.get("month") ?? new Date().getMonth() + 1);

  if (!["ID", "MY"].includes(country)) return apiError("INVALID_PARAM", "country must be ID or MY");
  if (isNaN(year) || year < 2020 || year > 2030) return apiError("INVALID_PARAM", "year must be 2020–2030");
  if (isNaN(month) || month < 1 || month > 12) return apiError("INVALID_PARAM", "month must be 1–12");

  const holidays = await getHolidaysByMonth(country, year, month);
  const holidayMap = new Map<string, typeof holidays[0][]>();
  for (const h of holidays) {
    const key = h.date.toISOString().slice(0, 10);
    holidayMap.set(key, [...(holidayMap.get(key) ?? []), h]);
  }

  const daysInMonth = new Date(year, month, 0).getDate();
  const days = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month - 1, d);
    const dateStr = date.toISOString().slice(0, 10);
    const dayHolidays = holidayMap.get(dateStr) ?? [];
    const weekend = isWeekend(date);
    const isHoliday = dayHolidays.some((h) => h.type === "national");
    const isJointLeave = dayHolidays.some((h) => h.type === "joint-leave");

    days.push({
      date: dateStr,
      dayOfWeek: date.getDay(),
      isWeekend: weekend,
      isHoliday,
      isJointLeave,
      isWorkday: !weekend && !isHoliday && !isJointLeave,
      holidays: dayHolidays.map((h) => ({ name: h.name, type: h.type })),
    });
  }

  return apiSuccess(
    { year, month, country, days },
    { totalDays: daysInMonth, holidays: holidays.filter((h) => h.type === "national").length }
  );
});
