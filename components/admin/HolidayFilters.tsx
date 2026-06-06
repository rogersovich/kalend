"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { RotateCw } from "lucide-react";

const selectCls = "rounded-md border border-hairline bg-canvas px-md py-xs font-display text-body-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink h-9";

interface HolidayFiltersProps {
  country: string;
  year: number;
  type?: string;
  region?: string;
  regions: Array<{ code: string; name: string }>;
}

export default function HolidayFilters({ country, year, type, region, regions }: HolidayFiltersProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function navigate(nextCountry: string, nextYear: number, nextType: string, nextRegion: string) {
    const params = new URLSearchParams();
    params.set("country", nextCountry);
    params.set("year", String(nextYear));
    if (nextType) params.set("type", nextType);
    if (nextRegion && nextCountry === "MY") params.set("region", nextRegion);
    window.location.href = `/admin/holidays?${params.toString()}`;
  }

  return (
    <div className="flex flex-wrap items-center gap-xs">
      <select
        defaultValue={country}
        onChange={(e) => navigate(e.target.value, year, type || "", region || "")}
        className={selectCls}
      >
        <option value="ID">Indonesia</option>
        <option value="MY">Malaysia</option>
      </select>
      <select
        defaultValue={year}
        onChange={(e) => navigate(country, Number(e.target.value), type || "", region || "")}
        className={selectCls}
      >
        {Array.from({ length: 11 }, (_, i) => 2020 + i).map((y) => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <select
        value={type || ""}
        onChange={(e) => navigate(country, year, e.target.value, region || "")}
        className={selectCls}
      >
        <option value="">Semua Tipe</option>
        <option value="national">Nasional</option>
        <option value="joint-leave">Cuti Bersama</option>
        <option value="regional">Regional</option>
      </select>
      {country === "MY" && (
        <select
          value={region || ""}
          onChange={(e) => navigate(country, year, type || "", e.target.value)}
          className={selectCls}
        >
          <option value="">Semua Region</option>
          {regions.map((r) => (
            <option key={r.code} value={r.code}>{r.name}</option>
          ))}
        </select>
      )}
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

