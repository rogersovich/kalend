import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";

interface DayNavProps {
  date: Date;
  country: string;
}

function formatDayLink(date: Date, country: string) {
  const y = date.getFullYear();
  const m = MONTH_NAMES_ID[date.getMonth()].toLowerCase();
  const d = date.getDate();
  const qs = country !== "ID" ? `?country=${country}` : "";
  return `/${y}/${m}/${d}${qs}`;
}

export default function DayNav({ date, country }: DayNavProps) {
  const prev = new Date(date);
  prev.setDate(date.getDate() - 1);
  const next = new Date(date);
  next.setDate(date.getDate() + 1);

  function label(d: Date) {
    return `${d.getDate()} ${MONTH_NAMES_ID[d.getMonth()]}`;
  }

  return (
    <div className="flex items-center justify-between">
      <Link
        href={formatDayLink(prev, country)}
        className="flex items-center gap-xs text-body-sm text-muted hover:text-ink transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        {label(prev)}
      </Link>
      <Link
        href={formatDayLink(next, country)}
        className="flex items-center gap-xs text-body-sm text-muted hover:text-ink transition-colors"
      >
        {label(next)}
        <ChevronRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
