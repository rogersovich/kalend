"use client";

import { useMemo } from "react";
import { calculateWeton } from "@/lib/calendar/weton";

interface WetonCardProps {
  date: Date;
}

export default function WetonCard({ date }: WetonCardProps) {
  const weton = useMemo(() => calculateWeton(date), [date]);

  return (
    <div className="rounded-lg border border-hairline bg-canvas p-lg">
      <div className="mb-md flex items-center gap-xs text-muted">
        <span className="text-sm">☯️</span>
        <span className="text-caption font-semibold uppercase tracking-wide">Weton Jawa</span>
      </div>

      <div className="mb-md">
        <p className="font-display text-title-lg font-semibold text-ink">{weton.weton}</p>
        <p className="text-body-sm text-muted">
          Neptu: {weton.neptuHari} ({weton.hari}) + {weton.neptuPasaran} ({weton.pasaran}) ={" "}
          <span className="font-semibold text-ink">{weton.neptuTotal}</span>
        </p>
      </div>

      <div className="rounded-md bg-surface-soft p-sm">
        <p className="text-body-sm text-muted leading-relaxed">{weton.makna}</p>
      </div>
    </div>
  );
}
