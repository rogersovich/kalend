import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { sendApiKeyEmail } from "@/lib/email";

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const keys = await prisma.apiKey.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ data: keys });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name } = body;
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  // Ensure profile exists
  await prisma.profile.upsert({
    where: { id: user.id },
    create: { id: user.id, name: user.user_metadata?.full_name, provider: "email" },
    update: {},
  });

  const key = `kld_${randomBytes(24).toString("hex")}`;

  const apiKey = await prisma.apiKey.create({
    data: { userId: user.id, name, key },
  });

  // Send notification email — non-blocking
  if (user.email) {
    sendApiKeyEmail(
      user.email,
      user.user_metadata?.full_name ?? "",
      name,
      key.slice(0, 16),
    ).catch(() => {});
  }

  return NextResponse.json({ data: apiKey }, { status: 201 });
}
