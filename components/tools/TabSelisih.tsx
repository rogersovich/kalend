"use client";

import { useState } from "react";

interface Result {
  days: number;
  weeks: number;
  months: number;
  years: number;
}

export default function TabSelisih() {
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [result, setResult] = useState<Result | null>(null);

  function calculate() {
    const s = new Date(start);
    const e = new Date(end);
    const msPerDay = 86400000;
    const days = Math.round((e.getTime() - s.getTime()) / msPerDay);
    const abs = Math.abs(days);
    setResult({ days, weeks: Math.floor(abs / 7), months: Math.floor(abs / 30), years: Math.floor(abs / 365) });
  }

  return (
    <div className="flex flex-col gap-md">
      <p className="text-body-sm text-muted">Hitung selisih antara dua tanggal.</p>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-caption font-medium text-ink">Tanggal mulai</label>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)}
            className="w-full rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none focus:border-brand-accent" />
        </div>
        <div>
          <label className="mb-1 block text-caption font-medium text-ink">Tanggal selesai</label>
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)}
            className="w-full rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none focus:border-brand-accent" />
        </div>
      </div>

      <button onClick={calculate}
        className="w-full rounded-lg bg-brand-accent py-sm text-body-sm font-medium text-white transition-opacity hover:opacity-90">
        Hitung
      </button>

      {result && (
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-hairline bg-canvas p-lg">
          {[
            { label: "Hari", value: result.days },
            { label: "Minggu", value: result.weeks },
            { label: "Bulan (estimasi)", value: result.months },
            { label: "Tahun (estimasi)", value: result.years },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="font-display text-display-sm font-semibold text-ink">{value.toLocaleString("id-ID")}</p>
              <p className="text-caption text-muted">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
