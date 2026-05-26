"use client";

import { useState } from "react";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";

const DAY_NAMES_FULL_ID = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const DAY_NAMES_FULL_EN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function TabTambahKurang() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [amount, setAmount] = useState(7);
  const [op, setOp] = useState<"add" | "sub">("add");
  const [result, setResult] = useState<Date | null>(null);

  function calculate() {
    const d = new Date(date);
    const factor = op === "add" ? 1 : -1;
    d.setDate(d.getDate() + factor * amount);
    setResult(new Date(d));
  }

  return (
    <div className="flex flex-col gap-md">
      <p className="text-body-sm text-muted">Tambah atau kurangi hari dari suatu tanggal.</p>

      <div>
        <label className="mb-1 block text-caption font-medium text-ink">Tanggal awal</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none focus:border-brand-accent" />
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-caption font-medium text-ink">Jumlah hari</label>
          <input type="number" min={1} value={amount} onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none focus:border-brand-accent" />
        </div>
        <div>
          <label className="mb-1 block text-caption font-medium text-ink">Operasi</label>
          <div className="flex gap-1 rounded-lg border border-hairline p-1">
            {(["add", "sub"] as const).map((o) => (
              <button key={o} onClick={() => setOp(o)}
                className={`rounded-md px-3 py-1 text-body-sm font-medium transition-colors ${op === o ? "bg-brand-accent text-white" : "text-muted hover:text-ink"}`}>
                {o === "add" ? "+ Tambah" : "− Kurangi"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={calculate}
        className="w-full rounded-lg bg-brand-accent py-sm text-body-sm font-medium text-white transition-opacity hover:opacity-90">
        Hitung
      </button>

      {result && (
        <div className="rounded-xl border border-hairline bg-canvas p-lg text-center">
          <p className="text-caption text-muted mb-1">{op === "add" ? "+" : "−"} {amount} hari dari {date}</p>
          <p className="font-display text-title-md font-semibold text-ink">
            {DAY_NAMES_FULL_ID[result.getDay()]}, {result.getDate()} {MONTH_NAMES_ID[result.getMonth()]} {result.getFullYear()}
          </p>
          <p className="text-body-sm text-muted mt-1">{DAY_NAMES_FULL_EN[result.getDay()]}</p>
        </div>
      )}
    </div>
  );
}
