import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEventReminderEmail, ReminderEvent } from "@/lib/email";

// Vercel Cron calls this with Authorization: Bearer <CRON_SECRET>
export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowDate = tomorrow.toISOString().slice(0, 10);

  // Fetch all events on tomorrow's date
  const events = await prisma.userEvent.findMany({
    where: {
      date: {
        gte: new Date(`${tomorrowDate}T00:00:00.000Z`),
        lte: new Date(`${tomorrowDate}T23:59:59.999Z`),
      },
    },
    include: { user: { select: { id: true, name: true } } },
  });

  if (events.length === 0) {
    return NextResponse.json({ ok: true, sent: 0 });
  }

  // Group events by userId
  const byUser = new Map<string, typeof events>();
  for (const event of events) {
    const arr = byUser.get(event.userId) ?? [];
    arr.push(event);
    byUser.set(event.userId, arr);
  }

  // Fetch emails from Supabase auth
  const supabaseAdmin = createAdminClient();
  const userIds = [...byUser.keys()];

  const { data: authUsers, error } = await supabaseAdmin.auth.admin.listUsers();
  if (error) {
    console.error("[cron/event-reminders] Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }

  const emailMap = new Map(
    authUsers.users
      .filter((u) => userIds.includes(u.id))
      .map((u) => [u.id, u.email ?? ""])
  );

  const dateLabel = tomorrow.toLocaleDateString("en-US", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  let sent = 0;
  const errors: string[] = [];

  for (const [userId, userEvents] of byUser) {
    const email = emailMap.get(userId);
    if (!email) continue;

    const name = userEvents[0].user.name ?? "";
    const reminderEvents: ReminderEvent[] = userEvents.map((e) => ({
      title: e.title,
      date: dateLabel,
      note: e.note,
      color: e.color,
    }));

    const { error: sendError } = await sendEventReminderEmail(email, name, reminderEvents);
    if (sendError) {
      errors.push(`${email}: ${sendError.message}`);
    } else {
      sent++;
    }
  }

  console.log(`[cron/event-reminders] Sent ${sent}/${byUser.size} reminder emails`);
  return NextResponse.json({ ok: true, sent, errors });
}
