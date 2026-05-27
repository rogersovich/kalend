import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

async function getAdminUser() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const profile = await prisma.profile.findUnique({ where: { id: user.id }, select: { role: true } });
  if (profile?.role !== "admin") return null;
  return user;
}

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const { countryCode, name, date, type, description } = body as {
    countryCode: string;
    name: string;
    date: string;
    type: string;
    description?: string;
  };

  if (!countryCode || !name || !date || !type) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const countryRecord = await prisma.country.findUnique({ where: { code: countryCode } });
  if (!countryRecord) return NextResponse.json({ error: "Country not found" }, { status: 404 });

  const holiday = await prisma.holiday.create({
    data: {
      countryId: countryRecord.id,
      name,
      date: new Date(date),
      type,
      description: description || null,
    },
  });

  return NextResponse.json({ data: holiday }, { status: 201 });
}
