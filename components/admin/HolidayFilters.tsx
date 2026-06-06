"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";

const selectCls = "rounded-md border border-hairline bg-canvas px-md py-xs font-display text-body-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink h-9";

interface HolidayFiltersProps {
  country: string;
  year: number;
}

export default function HolidayFilters({ country, year }: HolidayFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function navigate(nextCountry: string, nextYear: number) {
    window.location.href = `/admin/holidays?country=${nextCountry}&year=${nextYear}`;
  }

  return (
    <div className="flex items-center gap-xs">
      <select
        defaultValue={country}
        onChange={(e) => navigate(e.target.value, year)}
        className={selectCls}
      >
        <option value="ID">Indonesia</option>
        <option value="MY">Malaysia</option>
      </select>
      <select
        defaultValue={year}
        onChange={(e) => navigate(country, Number(e.target.value))}
        className={selectCls}
      >
        {Array.from({ length: 11 }, (_, i) => 2020 + i).map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <button
        onClick={() => startTransition(() => router.refresh())}
        disabled={isPending}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-hairline bg-canvas text-ink transition-colors hover:bg-surface-soft disabled:opacity-50"
        title="Refresh Data"
      >
        <RotateCw className={`h-4 w-4 ${isPending ? "animate-spin" : ""}`} />
      </button>
    </div>
  );
}

