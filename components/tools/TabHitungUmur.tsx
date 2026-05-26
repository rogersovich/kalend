"use client";

import { useState } from "react";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";

const DAY_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

export default function TabHitungUmur() {
  const [birth, setBirth] = useState("");
  const [result, setResult] = useState<{
    years: number; months: number; days: number;
    nextBirthday: Date; daysUntilBirthday: number;
  } | null>(null);

  function calculate() {
    if (!birth) return;
    const b = new Date(birth);
    const now = new Date();

    let years = now.getFullYear() - b.getFullYear();
    let months = now.getMonth() - b.getMonth();
    let days = now.getDate() - b.getDate();

    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }

    // Next birthday
    let nextBirthday = new Date(now.getFullYear(), b.getMonth(), b.getDate());
    if (nextBirthday <= now) nextBirthday = new Date(now.getFullYear() + 1, b.getMonth(), b.getDate());
    const daysUntilBirthday = Math.ceil((nextBirthday.getTime() - now.getTime()) / 86400000);

    setResult({ years, months, days, nextBirthday, daysUntilBirthday });
  }

  return (
    <div className="flex flex-col gap-md">
      <p className="text-body-sm text-muted">Hitung umur dan countdown ulang tahun berikutnya.</p>

      <div>
        <label className="mb-1 block text-caption font-medium text-ink">Tanggal lahir</label>
        <input type="date" value={birth} max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setBirth(e.target.value)}
          className="w-full rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none focus:border-brand-accent" />
      </div>

      <button onClick={calculate} disabled={!birth}
        className="w-full rounded-lg bg-brand-accent py-sm text-body-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50">
        Hitung Umur
      </button>

      {result && (
        <div className="flex flex-col gap-md">
          <div className="rounded-xl border border-hairline bg-canvas p-lg">
            <p className="mb-md text-caption font-semibold uppercase tracking-wide text-muted">Umur saat ini</p>
            <div className="grid grid-cols-3 gap-3 text-center">
              {[
                { label: "Tahun", value: result.years },
                { label: "Bulan", value: result.months },
                { label: "Hari", value: result.days },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="font-display text-display-sm font-semibold text-ink">{value}</p>
                  <p className="text-caption text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-brand-accent/20 bg-brand-accent/5 p-lg text-center">
            <p className="text-caption font-semibold uppercase tracking-wide text-brand-accent mb-1">
              Ulang Tahun Berikutnya
            </p>
            <p className="font-display text-title-sm font-semibold text-ink">
              {DAY_ID[result.nextBirthday.getDay()]}, {result.nextBirthday.getDate()} {MONTH_NAMES_ID[result.nextBirthday.getMonth()]} {result.nextBirthday.getFullYear()}
            </p>
            <p className="mt-1 text-body-sm text-muted">
              {result.daysUntilBirthday === 0 ? "🎉 Selamat ulang tahun hari ini!" : `${result.daysUntilBirthday} hari lagi`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
