"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: 3, label: "3+ hari" },
  { value: 4, label: "4+ hari" },
  { value: 5, label: "5+ hari" },
];

interface LongWeekendFilterProps {
  current: number;
}

export default function LongWeekendFilter({ current }: LongWeekendFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setMin(value: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 3) {
      params.delete("min");
    } else {
      params.set("min", String(value));
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex w-full items-center justify-center gap-[3px] rounded-pill bg-surface-soft p-[5px] sm:inline-flex sm:w-auto sm:justify-start">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => setMin(opt.value)}
          className={cn(
            "rounded-pill px-sm py-[6px] text-caption font-medium transition-colors",
            current === opt.value
              ? "bg-canvas text-ink shadow-soft"
              : "text-ink/50 hover:text-ink"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
