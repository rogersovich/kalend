import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MONTH_NAMES_ID, MIN_YEAR, MAX_YEAR } from "@/lib/calendar/constants";

interface MonthNavProps {
  year: number;
  month: number; // 1-12
  country: string;
}

function prevMonth(year: number, month: number) {
  if (month === 1) return { year: year - 1, month: 12 };
  return { year, month: month - 1 };
}

function nextMonth(year: number, month: number) {
  if (month === 12) return { year: year + 1, month: 1 };
  return { year, month: month + 1 };
}

function monthUrl(year: number, month: number, country: string) {
  const name = MONTH_NAMES_ID[month - 1].toLowerCase();
  const qs = country !== "ID" ? `?country=${country}` : "";
  return `/${year}/${name}${qs}`;
}

export default function MonthNav({ year, month, country }: MonthNavProps) {
  const prev = prevMonth(year, month);
  const next = nextMonth(year, month);
  const canGoPrev = prev.year >= MIN_YEAR;
  const canGoNext = next.year <= MAX_YEAR;

  return (
    <div className="flex items-center justify-between">
      {canGoPrev ? (
        <Link
          href={monthUrl(prev.year, prev.month, country)}
          className="flex items-center gap-xs text-body-sm text-muted hover:text-ink transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          {MONTH_NAMES_ID[prev.month - 1]}
        </Link>
      ) : (
        <span className="w-20" />
      )}

      <div className="text-center">
        <h1 className="font-display text-title-lg font-semibold text-ink">
          {MONTH_NAMES_ID[month - 1]} {year}
        </h1>
      </div>

      {canGoNext ? (
        <Link
          href={monthUrl(next.year, next.month, country)}
          className="flex items-center gap-xs text-body-sm text-muted hover:text-ink transition-colors"
        >
          {MONTH_NAMES_ID[next.month - 1]}
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="w-20" />
      )}
    </div>
  );
}
