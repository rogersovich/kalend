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
    <div className="flex w-full items-center justify-center gap-lg sm:w-auto sm:justify-start">
      {prevYear >= MIN_YEAR ? (
        <Link
          href={`/${prevYear}${countryParam}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft text-ink transition-colors hover:bg-primary hover:text-white"
          aria-label={`Kalender ${prevYear}`}
        >
          <ChevronLeft className="h-5 w-5" />
        </Link>
      ) : (
        <span className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full bg-surface-soft text-ink/20 select-none">
          <ChevronLeft className="h-5 w-5" />
        </span>
      )}

      <div className="text-center">
        <h1 className="font-display text-display-md font-normal text-ink sm:text-display-lg">{year}</h1>
        <p className="font-mono text-caption uppercase tracking-widest text-ink/50">Kalender</p>
      </div>

      {nextYear <= MAX_YEAR ? (
        <Link
          href={`/${nextYear}${countryParam}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft text-ink transition-colors hover:bg-primary hover:text-white"
          aria-label={`Kalender ${nextYear}`}
        >
          <ChevronRight className="h-5 w-5" />
        </Link>
      ) : (
        <span className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full bg-surface-soft text-ink/20 select-none">
          <ChevronRight className="h-5 w-5" />
        </span>
      )}
    </div>
  );
}
