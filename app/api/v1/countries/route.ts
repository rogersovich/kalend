import { withApiAuth, apiSuccess } from "@/lib/api/middleware";
import { prisma } from "@/lib/prisma";

export const GET = withApiAuth(async () => {
  const countries = await prisma.country.findMany({
    where: { isActive: true },
    select: { code: true, name: true, timezone: true, locale: true },
    orderBy: { code: "asc" },
  });

  return apiSuccess(countries);
});
