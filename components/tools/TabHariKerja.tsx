"use client";

import { useState } from "react";

interface Result {
  workdays: number;
  totalDays: number;
  weekends: number;
  holidays: number;
}

export default function TabHariKerja() {
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [country, setCountry] = useState("ID");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function calculate() {
    setLoading(true);
    setError(null);
    setResult(null);
    const res = await fetch(`/api/tools/workdays?start=${start}&end=${end}&country=${country}`);
    const json = await res.json();
    if (!res.ok) { setError(json.error ?? "Gagal menghitung"); setLoading(false); return; }
    setResult(json);
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-md">
      <p className="text-body-sm text-muted">Hitung jumlah hari kerja dalam rentang tanggal.</p>

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

      <div>
        <label className="mb-1 block text-caption font-medium text-ink">Negara</label>
        <select value={country} onChange={(e) => setCountry(e.target.value)}
          className="w-full rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none focus:border-brand-accent">
          <option value="ID">Indonesia</option>
          <option value="MY">Malaysia</option>
        </select>
      </div>

      <button onClick={calculate} disabled={loading}
        className="w-full rounded-lg bg-brand-accent py-sm text-body-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50">
        {loading ? "Menghitung..." : "Hitung"}
      </button>

      {error && <p className="text-body-sm text-error">{error}</p>}

      {result && (
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-hairline bg-canvas p-lg">
          {[
            { label: "Hari Kerja", value: result.workdays, highlight: true },
            { label: "Total Hari", value: result.totalDays },
            { label: "Akhir Pekan", value: result.weekends },
            { label: "Hari Libur", value: result.holidays },
          ].map(({ label, value, highlight }) => (
            <div key={label} className="text-center">
              <p className={`font-display text-display-sm font-semibold ${highlight ? "text-brand-accent" : "text-ink"}`}>
                {value}
              </p>
              <p className="text-caption text-muted">{label}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
