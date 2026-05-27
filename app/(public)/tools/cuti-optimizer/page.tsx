"use client";

import { useState } from "react";
import { toast } from "sonner";
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

const selectCls = "w-full rounded-md border border-hairline bg-canvas px-md py-xs font-display text-body-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink sm:w-auto";

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
    if (!res.ok) {
      toast.error(json.error ?? "Gagal menghitung strategi cuti");
      setLoading(false);
      return;
    }
    setStrategies(json.data ?? []);
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-content px-lg py-md sm:py-xl">
        <div className="mb-md">
          <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Cuti Optimizer" }]} />
        </div>

        {/* Color block hero */}
        <div className="mb-lg rounded-lg bg-block-lime p-lg sm:mb-xl sm:p-xxl">
          <p className="mb-sm font-mono text-sm uppercase tracking-widest text-ink/60 sm:text-caption">Tools</p>
          <h1 className="mb-md font-display text-display-md font-normal text-ink leading-tight sm:text-display-lg">Cuti Optimizer</h1>
          <p className="font-display text-body-sm text-ink sm:text-body-lg">Temukan kombinasi cuti paling efisien untuk libur terpanjang.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mb-lg flex flex-col gap-sm sm:mb-xl sm:flex-row sm:flex-wrap sm:items-end sm:gap-md">
          <div className="sm:w-auto">
            <label className="mb-xs block font-mono text-caption uppercase tracking-widest text-ink/60">Tahun</label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={selectCls}>
              {Array.from({ length: 11 }, (_, i) => 2020 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div className="sm:w-auto">
            <label className="mb-xs block font-mono text-caption uppercase tracking-widest text-ink/60">Negara</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className={selectCls}>
              <option value="ID">Indonesia</option>
              <option value="MY">Malaysia</option>
            </select>
          </div>
          <div className="sm:w-auto">
            <label className="mb-xs block font-mono text-caption uppercase tracking-widest text-ink/60">Maks. cuti diambil</label>
            <select value={maxLeave} onChange={(e) => setMaxLeave(Number(e.target.value))} className={selectCls}>
              {[1,2,3,4,5,7,10,14].map((n) => (
                <option key={n} value={n}>{n} hari</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-sm rounded-pill bg-primary px-md py-sm font-display text-body-sm font-medium text-white transition-colors hover:bg-primary-active disabled:opacity-50 sm:w-auto sm:px-lg sm:py-xs sm:text-button"
          >
            <CalendarCheck className="h-4 w-4" />
            {loading ? "Menghitung..." : "Cari Strategi"}
          </button>
        </form>

        {/* Results */}
        {strategies !== null && (
          <>
            {strategies.length === 0 ? (
              <p className="font-display text-body text-ink">Tidak ditemukan strategi cuti optimal.</p>
            ) : (
              <div className="flex flex-col gap-md">
                <p className="font-mono text-caption text-ink/60">{strategies.length} strategi ditemukan, diurutkan berdasarkan efisiensi.</p>
                {strategies.map((s, i) => {
                  const cardBg = i === 0 ? "bg-block-lime" : i === 1 ? "bg-block-mint" : "bg-block-cream";
                  return (
                  <div key={i} className={`rounded-lg ${cardBg} p-md sm:p-lg`}>
                    {/* Card header */}
                    <div className="mb-md flex items-start justify-between gap-sm">
                      <div className="min-w-0 flex-1">
                        <div className="mb-xs flex flex-wrap items-center gap-xs">
                          <span className="rounded-pill bg-black/10 px-sm py-xxs font-mono text-caption font-semibold text-ink">
                            #{i + 1}
                          </span>
                          <span className="font-display text-body-lg font-medium text-ink sm:text-headline">
                            {s.totalDaysOff} hari libur
                          </span>
                        </div>
                        <p className="font-display text-body-sm text-ink/60">
                          {formatDate(s.period.startDate)} – {formatDate(s.period.endDate)} {new Date(s.period.endDate).getFullYear()}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-display text-body-lg font-medium text-ink sm:text-headline">{s.ratio.toFixed(1)}×</p>
                        <p className="font-mono text-caption text-ink/60">efisiensi</p>
                      </div>
                    </div>

                    {/* Leave date chips */}
                    <div className="flex flex-wrap gap-xs">
                      {s.leaveDates.map((d) => {
                        const date = new Date(d);
                        return (
                          <span key={d} className="flex min-w-[2.5rem] flex-col items-center rounded-md bg-black/10 px-xs py-xs text-center sm:px-sm">
                            <span className="font-mono text-[10px] text-ink/60 sm:text-caption">{DAY_ID[date.getDay()]}</span>
                            <span className="font-display text-body-sm font-medium text-ink">{date.getDate()}</span>
                            <span className="font-mono text-[10px] text-ink/60 sm:text-caption">{MONTH_NAMES_ID[date.getMonth()].slice(0,3)}</span>
                          </span>
                        );
                      })}
                    </div>

                    <p className="mt-sm font-mono text-caption text-ink/60">
                      Ambil cuti {s.leaveDaysUsed} hari → dapat libur {s.totalDaysOff} hari
                    </p>
                  </div>
                  );
                })}
              </div>
            )}
          </>
        )}
    </main>
  );
}
