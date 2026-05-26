"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { COUNTRIES, CountryCode } from "@/lib/calendar/constants";

interface CountrySwitcherProps {
  current: CountryCode;
}

export default function CountrySwitcher({ current }: CountrySwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function switchCountry(code: CountryCode) {
    const params = new URLSearchParams(searchParams.toString());
    if (code === "ID") {
      params.delete("country");
    } else {
      params.set("country", code);
    }
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="inline-flex items-center gap-[3px] rounded-pill bg-surface-soft p-[5px]">
      {COUNTRIES.map((c) => (
        <button
          key={c.code}
          onClick={() => switchCountry(c.code as CountryCode)}
          className={cn(
            "flex items-center gap-xs rounded-pill px-sm py-[6px] text-caption font-medium transition-colors",
            current === c.code
              ? "bg-canvas text-ink shadow-soft"
              : "text-muted hover:text-ink"
          )}
        >
          <span>{c.flag}</span>
          <span>{c.name}</span>
        </button>
      ))}
    </div>
  );
}
