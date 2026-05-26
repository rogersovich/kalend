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
    <div className="flex items-center gap-lg">
      {canGoPrev ? (
        <Link
          href={monthUrl(prev.year, prev.month, country)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft text-ink transition-colors hover:bg-primary hover:text-white"
          aria-label={`${MONTH_NAMES_ID[prev.month - 1]} ${prev.year}`}
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
      ) : (
        <span className="flex h-10 w-10 cursor-not-allowed select-none items-center justify-center rounded-full bg-surface-soft text-ink/20">
          <ChevronLeft className="h-5 w-5" />
        </span>
      )}

      <div className="text-center">
        <h1 className="font-display text-display-lg font-normal text-ink">
          {MONTH_NAMES_ID[month - 1]}
        </h1>
        <p className="font-mono text-caption uppercase tracking-widest text-ink/50">{year}</p>
      </div>

      {canGoNext ? (
        <Link
          href={monthUrl(next.year, next.month, country)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft text-ink transition-colors hover:bg-primary hover:text-white"
          aria-label={`${MONTH_NAMES_ID[next.month - 1]} ${next.year}`}
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      ) : (
        <span className="flex h-10 w-10 cursor-not-allowed select-none items-center justify-center rounded-full bg-surface-soft text-ink/20">
          <ChevronRight className="h-5 w-5" />
        </span>
      )}
    </div>
  );
}
