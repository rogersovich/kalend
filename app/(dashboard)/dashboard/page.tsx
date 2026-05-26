import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CalendarDays, Key, Activity, Clock, ArrowRight } from "lucide-react";
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
    { label: "Total Events", value: eventsCount, icon: CalendarDays, href: "/dashboard/events", desc: "Event tersimpan" },
    { label: "API Keys Aktif", value: apiKeysCount, icon: Key, href: "/dashboard/api-keys", desc: "Key aktif saat ini" },
    { label: "API Calls Hari Ini", value: usageToday, icon: Activity, href: "/dashboard/api-keys", desc: "Dari limit 100/hari" },
  ];

  return (
    <div className="flex flex-col gap-xl">
      <div>
        <h1 className="font-display text-display-sm font-normal text-ink">Halo, {displayName} 👋</h1>
        <p className="mt-xs font-display text-body text-muted">Selamat datang di dashboard Kalend.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-md sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, href, desc }) => (
          <Link
            key={label}
            href={href}
            className="group flex flex-col gap-md rounded-lg border border-hairline bg-canvas p-lg transition-shadow hover:shadow-elevated"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft text-ink">
                <Icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted/40 transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
            </div>
            <div>
              <p className="font-display text-display-sm font-semibold text-ink leading-none">{value}</p>
              <p className="mt-xs font-display text-body-sm font-medium text-ink">{label}</p>
              <p className="font-mono text-caption text-muted">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming events */}
      <div className="rounded-lg border border-hairline bg-canvas">
        <div className="flex items-center justify-between border-b border-hairline px-lg py-md">
          <div>
            <h2 className="font-display text-headline font-medium text-ink">Event Mendatang</h2>
            <p className="font-mono text-caption text-muted">5 event terdekat</p>
          </div>
          <Link
            href="/dashboard/events"
            className="flex items-center gap-1 font-display text-body-sm font-medium text-ink hover:underline"
          >
            Lihat semua
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="flex flex-col items-center gap-sm py-xxl text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-soft">
              <Clock className="h-6 w-6 text-muted" />
            </div>
            <div>
              <p className="font-display font-medium text-ink">Belum ada event mendatang</p>
              <p className="font-display text-body-sm text-muted">Tambahkan event untuk memulai</p>
            </div>
            <Link
              href="/dashboard/events"
              className="mt-xs inline-flex items-center gap-1 rounded-pill bg-primary px-lg py-xs font-display text-body-sm font-medium text-white transition-colors hover:bg-primary-active"
            >
              <CalendarDays className="h-4 w-4" />
              Tambah event
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-hairline">
            {upcomingEvents.map((ev) => {
              const d = new Date(ev.date);
              const dateStr = `${d.getDate()} ${MONTH_NAMES_ID[d.getMonth()]} ${d.getFullYear()}`;
              return (
                <li key={ev.id} className="flex items-center gap-md px-lg py-md hover:bg-surface-soft/50">
                  <div className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: ev.color ?? "#6366f1" }} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-body-sm font-medium text-ink">{ev.title}</p>
                    <p className="font-mono text-caption text-muted">{dateStr}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
        {[
          { href: "/dashboard/api-keys", icon: Key, label: "Kelola API Keys", desc: "Generate dan revoke key akses API" },
          { href: `/${new Date().getFullYear()}`, icon: CalendarDays, label: "Lihat Kalender", desc: `Kalender ${new Date().getFullYear()} lengkap` },
        ].map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-md rounded-lg border border-hairline bg-canvas p-lg transition-shadow hover:shadow-elevated"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-soft text-ink transition-colors group-hover:bg-primary group-hover:text-white">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display font-medium text-ink">{label}</p>
              <p className="font-mono text-caption text-muted">{desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted/40 group-hover:text-ink" />
          </Link>
        ))}
      </div>
    </div>
  );
}
