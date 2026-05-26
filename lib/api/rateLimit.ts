import { prisma } from "@/lib/prisma";

export async function checkRateLimit(apiKeyId: string, limit: number): Promise<boolean> {
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);

  const count = await prisma.apiUsageLog.count({
    where: {
      apiKeyId,
      createdAt: { gte: dayStart },
    },
  });

  return count < limit;
}

export async function logUsage(
  apiKeyId: string,
  endpoint: string,
  statusCode: number,
  responseMs: number,
  country?: string
) {
  await Promise.all([
    prisma.apiUsageLog.create({
      data: { apiKeyId, endpoint, statusCode, responseMs, country },
    }),
    prisma.apiKey.update({
      where: { id: apiKeyId },
      data: { lastUsedAt: new Date() },
    }),
  ]);
}
