import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MIN_YEAR, MAX_YEAR } from "@/lib/calendar/constants";

interface YearNavProps {
  year: number;
  country: string;
}

export default function YearNav({ year, country }: YearNavProps) {
  const countryParam = country === "ID" ? "" : `?country=${country}`;
  const prevYear = year - 1;
  const nextYear = year + 1;

  return (
    <div className="flex items-center gap-md">
      {prevYear >= MIN_YEAR ? (
        <Link
          href={`/${prevYear}${countryParam}`}
          className="flex items-center gap-xs text-caption text-muted hover:text-ink transition-colors"
          aria-label={`Kalender ${prevYear}`}
        >
          <ChevronLeft className="h-4 w-4" />
          {prevYear}
        </Link>
      ) : (
        <span className="flex items-center gap-xs text-caption text-muted/40 cursor-not-allowed select-none">
          <ChevronLeft className="h-4 w-4" />
          {prevYear}
        </span>
      )}

      <h1 className="font-display text-display-sm font-semibold text-ink">
        Kalender {year}
      </h1>

      {nextYear <= MAX_YEAR ? (
        <Link
          href={`/${nextYear}${countryParam}`}
          className="flex items-center gap-xs text-caption text-muted hover:text-ink transition-colors"
          aria-label={`Kalender ${nextYear}`}
        >
          {nextYear}
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex items-center gap-xs text-caption text-muted/40 cursor-not-allowed select-none">
          {nextYear}
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </div>
  );
}
