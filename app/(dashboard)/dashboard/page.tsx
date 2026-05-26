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
    {
      label: "Total Events",
      value: eventsCount,
      icon: CalendarDays,
      href: "/dashboard/events",
      desc: "Event tersimpan",
    },
    {
      label: "API Keys Aktif",
      value: apiKeysCount,
      icon: Key,
      href: "/dashboard/api-keys",
      desc: "Key aktif saat ini",
    },
    {
      label: "API Calls Hari Ini",
      value: usageToday,
      icon: Activity,
      href: "/dashboard/api-keys",
      desc: "Dari limit 100/hari",
    },
  ];

  return (
    <div className="flex flex-col gap-xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-display-sm font-semibold text-ink">
          Halo, {displayName} 👋
        </h1>
        <p className="mt-xs text-body-md text-muted">
          Selamat datang di dashboard Kalend.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-md sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon, href, desc }) => (
          <Link
            key={label}
            href={href}
            className="group flex flex-col gap-md rounded-xl border border-hairline bg-canvas p-lg transition-shadow hover:shadow-elevated"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
                <Icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted/40 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-accent" />
            </div>
            <div>
              <p className="font-display text-display-sm font-semibold text-ink leading-none">{value}</p>
              <p className="mt-xs text-body-sm font-medium text-ink">{label}</p>
              <p className="text-caption text-muted">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Upcoming events */}
      <div className="rounded-xl border border-hairline bg-canvas">
        <div className="flex items-center justify-between border-b border-hairline px-lg py-md">
          <div>
            <h2 className="font-display text-title-sm font-semibold text-ink">Event Mendatang</h2>
            <p className="text-caption text-muted">5 event terdekat</p>
          </div>
          <Link
            href="/dashboard/events"
            className="flex items-center gap-1 text-caption font-medium text-brand-accent hover:underline"
          >
            Lihat semua
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="flex flex-col items-center gap-sm py-xxl text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-soft">
              <Clock className="h-6 w-6 text-muted/50" />
            </div>
            <div>
              <p className="font-medium text-ink">Belum ada event mendatang</p>
              <p className="text-body-sm text-muted">Tambahkan event untuk memulai</p>
            </div>
            <Link
              href="/dashboard/events"
              className="mt-xs inline-flex items-center gap-1 rounded-lg bg-brand-accent px-md py-sm text-body-sm font-medium text-white transition-opacity hover:opacity-90"
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
                  <div
                    className="h-3 w-3 shrink-0 rounded-full"
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

      {/* Quick links */}
      <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
        <Link
          href="/dashboard/api-keys"
          className="group flex items-center gap-md rounded-xl border border-hairline bg-canvas p-lg transition-shadow hover:shadow-soft"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-muted group-hover:bg-brand-accent/10 group-hover:text-brand-accent">
            <Key className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-ink">Kelola API Keys</p>
            <p className="text-caption text-muted">Generate dan revoke key akses API</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted/40 group-hover:text-brand-accent" />
        </Link>

        <Link
          href={`/${new Date().getFullYear()}`}
          className="group flex items-center gap-md rounded-xl border border-hairline bg-canvas p-lg transition-shadow hover:shadow-soft"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-soft text-muted group-hover:bg-brand-accent/10 group-hover:text-brand-accent">
            <CalendarDays className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-ink">Lihat Kalender</p>
            <p className="text-caption text-muted">Kalender {new Date().getFullYear()} lengkap</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted/40 group-hover:text-brand-accent" />
        </Link>
      </div>
    </div>
  );
}
