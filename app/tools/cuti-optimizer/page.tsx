"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";
import { CalendarCheck } from "lucide-react";

interface Strategy {
  leaveDates: string[];
  leaveDaysUsed: number;
  totalDaysOff: number;
  ratio: number;
  period: { startDate: string; endDate: string; totalDays: number };
}

const DAY_ID = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function formatDate(ds: string) {
  const d = new Date(ds);
  return `${d.getDate()} ${MONTH_NAMES_ID[d.getMonth()]}`;
}

export default function CutiOptimizerPage() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [country, setCountry] = useState("ID");
  const [maxLeave, setMaxLeave] = useState(3);
  const [loading, setLoading] = useState(false);
  const [strategies, setStrategies] = useState<Strategy[] | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStrategies(null);
    const res = await fetch(`/api/tools/cuti-optimizer?year=${year}&country=${country}&max_leave=${maxLeave}`);
    const json = await res.json();
    setStrategies(json.data ?? []);
    setLoading(false);
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-content px-lg py-xl">
        <div className="mb-md">
          <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Cuti Optimizer" }]} />
        </div>

        <div className="mb-lg">
          <h1 className="font-display text-display-sm font-semibold text-ink">Cuti Optimizer</h1>
          <p className="text-body-md text-muted">Temukan kombinasi cuti paling efisien untuk libur terpanjang.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-xl flex flex-wrap items-end gap-4">
          <div>
            <label className="mb-1 block text-caption font-medium text-ink">Tahun</label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none focus:border-brand-accent">
              {Array.from({ length: 11 }, (_, i) => 2020 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-caption font-medium text-ink">Negara</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)}
              className="rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none focus:border-brand-accent">
              <option value="ID">Indonesia</option>
              <option value="MY">Malaysia</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-caption font-medium text-ink">Maks. cuti diambil</label>
            <select value={maxLeave} onChange={(e) => setMaxLeave(Number(e.target.value))}
              className="rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none focus:border-brand-accent">
              {[1,2,3,4,5,7,10,14].map((n) => (
                <option key={n} value={n}>{n} hari</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-brand-accent px-md py-sm text-body-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50">
            <CalendarCheck className="h-4 w-4" />
            {loading ? "Menghitung..." : "Cari Strategi"}
          </button>
        </form>

        {/* Results */}
        {strategies !== null && (
          <>
            {strategies.length === 0 ? (
              <p className="text-body-md text-muted">Tidak ditemukan strategi cuti optimal.</p>
            ) : (
              <div className="flex flex-col gap-md">
                <p className="text-body-sm text-muted">{strategies.length} strategi ditemukan, diurutkan berdasarkan efisiensi.</p>
                {strategies.map((s, i) => (
                  <div key={i} className="rounded-xl border border-hairline bg-canvas p-lg">
                    <div className="mb-md flex items-start justify-between gap-md">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="rounded-full bg-brand-accent/10 px-2 py-0.5 text-caption font-semibold text-brand-accent">
                            #{i + 1}
                          </span>
                          <span className="font-display text-title-sm font-semibold text-ink">
                            {s.totalDaysOff} hari libur
                          </span>
                        </div>
                        <p className="text-body-sm text-muted">
                          {formatDate(s.period.startDate)} – {formatDate(s.period.endDate)} {new Date(s.period.endDate).getFullYear()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-title-sm font-semibold text-brand-accent">{s.ratio.toFixed(1)}x</p>
                        <p className="text-caption text-muted">efisiensi</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {/* Leave dates highlighted */}
                      {s.leaveDates.map((d) => {
                        const date = new Date(d);
                        return (
                          <span key={d} className="flex flex-col items-center rounded-md border border-brand-accent/40 bg-brand-accent/10 px-2 py-1 text-center">
                            <span className="text-[9px] font-medium text-brand-accent">{DAY_ID[date.getDay()]}</span>
                            <span className="font-mono text-[11px] font-semibold text-brand-accent">{date.getDate()}</span>
                            <span className="text-[8px] text-brand-accent/70">{MONTH_NAMES_ID[date.getMonth()].slice(0,3)}</span>
                          </span>
                        );
                      })}
                    </div>

                    <p className="mt-sm text-caption text-muted">
                      Ambil cuti {s.leaveDaysUsed} hari → dapat libur {s.totalDaysOff} hari
                    </p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
