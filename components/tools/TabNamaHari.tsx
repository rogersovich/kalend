"use client";

import { useState } from "react";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";

const DAY_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const DAY_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function TabNamaHari() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [result, setResult] = useState<{ dayId: string; dayEn: string; dateId: string; dateEn: string } | null>(null);

  function calculate() {
    const d = new Date(date);
    const dayIdx = d.getDay();
    setResult({
      dayId: DAY_ID[dayIdx],
      dayEn: DAY_EN[dayIdx],
      dateId: `${d.getDate()} ${MONTH_NAMES_ID[d.getMonth()]} ${d.getFullYear()}`,
      dateEn: `${MONTH_EN[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`,
    });
  }

  return (
    <div className="flex flex-col gap-md">
      <p className="text-body-sm text-muted">Cari tahu nama hari dari suatu tanggal.</p>

      <div>
        <label className="mb-1 block text-caption font-medium text-ink">Tanggal</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none focus:border-brand-accent" />
      </div>

      <button onClick={calculate}
        className="w-full rounded-lg bg-brand-accent py-sm text-body-sm font-medium text-white transition-opacity hover:opacity-90">
        Cek Nama Hari
      </button>

      {result && (
        <div className="rounded-xl border border-hairline bg-canvas p-lg">
          <div className="mb-md text-center">
            <p className="font-display text-display-sm font-semibold text-ink">{result.dayId}</p>
            <p className="text-body-md text-muted">{result.dayEn}</p>
          </div>
          <div className="flex flex-col gap-xs border-t border-hairline pt-md">
            <div className="flex justify-between text-body-sm">
              <span className="text-muted">Indonesia</span>
              <span className="font-medium text-ink">{result.dateId}</span>
            </div>
            <div className="flex justify-between text-body-sm">
              <span className="text-muted">English</span>
              <span className="font-medium text-ink">{result.dateEn}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
