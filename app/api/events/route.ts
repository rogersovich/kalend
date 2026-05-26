import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const events = await prisma.userEvent.findMany({
    where: { userId: user.id },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ data: events });
}

export async function POST(request: Request) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, date, endDate, color, note } = body;

  if (!title || !date) {
    return NextResponse.json({ error: "title and date are required" }, { status: 400 });
  }

  // Ensure profile exists
  await prisma.profile.upsert({
    where: { id: user.id },
    create: { id: user.id, name: user.user_metadata?.full_name, provider: "email" },
    update: {},
  });

  const event = await prisma.userEvent.create({
    data: {
      userId: user.id,
      title,
      date: new Date(date),
      endDate: endDate ? new Date(endDate) : null,
      color: color ?? "#6366f1",
      note: note ?? null,
    },
  });

  return NextResponse.json({ data: event }, { status: 201 });
}
