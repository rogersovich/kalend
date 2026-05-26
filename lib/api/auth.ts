import { prisma } from "@/lib/prisma";

export interface ValidatedKey {
  apiKeyId: string;
  userId: string;
  rateLimit: number;
}

export async function validateApiKey(request: Request): Promise<ValidatedKey | null> {
  const auth = request.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;

  const key = auth.slice(7).trim();
  if (!key) return null;

  const apiKey = await prisma.apiKey.findUnique({
    where: { key },
    select: { id: true, userId: true, isActive: true, rateLimit: true },
  });

  if (!apiKey || !apiKey.isActive) return null;

  return { apiKeyId: apiKey.id, userId: apiKey.userId, rateLimit: apiKey.rateLimit };
}
