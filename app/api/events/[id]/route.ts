import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: { id: string };
}

export async function PUT(request: Request, { params }: Params) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.userEvent.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json();
  const { title, date, endDate, color, note } = body;

  const event = await prisma.userEvent.update({
    where: { id: params.id },
    data: {
      ...(title && { title }),
      ...(date && { date: new Date(date) }),
      endDate: endDate ? new Date(endDate) : null,
      ...(color !== undefined && { color }),
      ...(note !== undefined && { note }),
    },
  });

  return NextResponse.json({ data: event });
}

export async function DELETE(_request: Request, { params }: Params) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.userEvent.findUnique({ where: { id: params.id } });
  if (!existing || existing.userId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.userEvent.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
