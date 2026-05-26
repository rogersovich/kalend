import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CalendarDays, Key, Activity, Clock } from "lucide-react";
import Link from "next/link";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [eventsCount, apiKeysCount, usageToday, upcomingEvents] = await Promise.all([
    prisma.userEvent.count({ where: { userId: user.id } }),
    prisma.apiKey.count({ where: { userId: user.id, isActive: true } }),
    prisma.apiUsageLog.count({
      where: {
        apiKey: { userId: user.id },
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    prisma.userEvent.findMany({
      where: {
        userId: user.id,
        date: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
      orderBy: { date: "asc" },
      take: 5,
    }),
  ]);

  const displayName = user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "Pengguna";

  const stats = [
    { label: "Total Events", value: eventsCount, icon: CalendarDays, href: "/dashboard/events" },
    { label: "API Keys Aktif", value: apiKeysCount, icon: Key, href: "/dashboard/api-keys" },
    { label: "API Calls Hari Ini", value: usageToday, icon: Activity, href: "/dashboard/api-keys" },
  ];

  return (
    <div>
      <div className="mb-lg">
        <h1 className="font-display text-title-md font-semibold text-ink">
          Halo, {displayName} 👋
        </h1>
        <p className="text-body-sm text-muted">Selamat datang di dashboard Kalend.</p>
      </div>

      {/* Stats */}
      <div className="mb-lg grid grid-cols-1 gap-md sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-md rounded-xl border border-hairline bg-canvas p-md transition-shadow hover:shadow-soft"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-title-sm font-semibold text-ink">{value}</p>
              <p className="text-caption text-muted">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming events */}
      <div className="rounded-xl border border-hairline bg-canvas p-lg">
        <div className="mb-md flex items-center justify-between">
          <h2 className="font-display text-title-sm font-semibold text-ink">Event Mendatang</h2>
          <Link href="/dashboard/events" className="text-caption text-brand-accent hover:underline">
            Lihat semua
          </Link>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="py-md text-center">
            <Clock className="mx-auto mb-2 h-8 w-8 text-muted/40" />
            <p className="text-body-sm text-muted">Belum ada event mendatang.</p>
            <Link
              href="/dashboard/events"
              className="mt-2 inline-block text-caption text-brand-accent hover:underline"
            >
              Tambah event pertama
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-xs">
            {upcomingEvents.map((ev) => {
              const d = new Date(ev.date);
              const dateStr = `${d.getDate()} ${MONTH_NAMES_ID[d.getMonth()]} ${d.getFullYear()}`;
              return (
                <li key={ev.id} className="flex items-center gap-md rounded-lg px-md py-sm hover:bg-surface-soft">
                  <div
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: ev.color ?? "#6366f1" }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-body-sm font-medium text-ink">{ev.title}</p>
                    <p className="text-caption text-muted">{dateStr}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
