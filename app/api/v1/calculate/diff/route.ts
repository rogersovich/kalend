import { withApiAuth, apiSuccess, apiError } from "@/lib/api/middleware";

export const GET = withApiAuth(async (request) => {
  const { searchParams } = new URL(request.url);
  const startStr = searchParams.get("start");
  const endStr = searchParams.get("end");

  if (!startStr || !endStr) return apiError("INVALID_PARAM", "start and end are required (YYYY-MM-DD)");

  const start = new Date(startStr);
  const end = new Date(endStr);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return apiError("INVALID_PARAM", "start and end must be valid YYYY-MM-DD");
  }

  const msPerDay = 86400000;
  const totalDays = Math.round((end.getTime() - start.getTime()) / msPerDay);
  const absTotal = Math.abs(totalDays);

  return apiSuccess({
    start: startStr,
    end: endStr,
    days: totalDays,
    weeks: Math.floor(absTotal / 7),
    months: Math.floor(absTotal / 30),
    years: Math.floor(absTotal / 365),
  });
});
