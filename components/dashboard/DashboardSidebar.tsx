"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CalendarDays, Key, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/events", label: "Events", icon: CalendarDays },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-52 shrink-0 border-r border-hairline py-xl pr-lg md:block">
        <p className="mb-sm px-3 text-[11px] font-semibold uppercase tracking-wider text-muted/50">
          Menu
        </p>
        <nav className="flex flex-col gap-0.5">
          {links.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-body-sm font-medium transition-colors",
                  active
                    ? "bg-brand-accent/10 text-brand-accent"
                    : "text-muted hover:bg-surface-soft hover:text-ink"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active ? "text-brand-accent" : "")} />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile top tab bar */}
      <nav className="flex gap-1 overflow-x-auto border-b border-hairline px-lg pb-sm pt-md md:hidden">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-caption font-medium transition-colors",
                active
                  ? "bg-brand-accent/10 text-brand-accent"
                  : "text-muted hover:bg-surface-soft hover:text-ink"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
