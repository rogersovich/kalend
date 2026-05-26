"use client";

import { useMemo } from "react";
import { calculateWeton } from "@/lib/calendar/weton";

interface WetonCardProps {
  date: Date;
}

export default function WetonCard({ date }: WetonCardProps) {
  const weton = useMemo(() => calculateWeton(date), [date]);

  return (
    <div className="rounded-lg bg-block-lilac p-lg">
      <p className="mb-md font-mono text-caption uppercase tracking-widest text-ink/60">
        Weton Jawa
      </p>
      <p className="font-display text-display-sm font-normal text-ink">{weton.weton}</p>
      <p className="mt-xs font-display text-body-sm text-ink">
        Neptu {weton.neptuHari} ({weton.hari}) + {weton.neptuPasaran} ({weton.pasaran}) ={" "}
        <span className="font-semibold">{weton.neptuTotal}</span>
      </p>
      <div className="mt-md rounded-md bg-black/5 p-sm">
        <p className="font-display text-body-sm leading-relaxed text-ink">{weton.makna}</p>
      </div>
    </div>
  );
}
