"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { calculateWeton } from "@/lib/calendar/weton";
import { MONTH_NAMES_ID } from "@/lib/calendar/constants";
import { Copy, Check } from "lucide-react";

const DAY_ID_FULL = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

const NEPTU_MEANING: Record<number, string> = {
  7: "Pitu — cukup baik",
  8: "Wolu — sederhana",
  9: "Songo — baik",
  10: "Sepuluh — sangat baik",
  11: "Sewelas — kurang baik",
  12: "Rolas — baik",
  13: "Telulas — cukup baik",
  14: "Pat belas — sangat baik",
  15: "Limalas — baik",
  16: "Nembelas — kurang baik",
  17: "Pituelas — baik",
  18: "Wolulas — sangat baik",
};

function CekWetonContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const today = new Date().toISOString().slice(0, 10);

  const initialDate = searchParams.get("date") ?? today;
  const [date, setDate] = useState(initialDate);
  const [result, setResult] = useState<ReturnType<typeof calculateWeton> | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const d = searchParams.get("date");
    if (d) compute(d);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function compute(d: string) {
    const parsed = new Date(d);
    if (!isNaN(parsed.getTime())) {
      setResult(calculateWeton(parsed));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    compute(date);
    router.push(`/tools/cek-weton?date=${date}`, { scroll: false });
  }

  async function handleShare() {
    const url = `${window.location.origin}/tools/cek-weton?date=${date}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const dateObj = new Date(date);
  const fullDateId = !isNaN(dateObj.getTime())
    ? `${DAY_ID_FULL[dateObj.getDay()]}, ${dateObj.getDate()} ${MONTH_NAMES_ID[dateObj.getMonth()]} ${dateObj.getFullYear()}`
    : "";

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-content px-lg py-xl">
        <div className="mb-md">
          <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Cek Weton" }]} />
        </div>

        <div className="mb-lg">
          <h1 className="font-display text-display-sm font-semibold text-ink">Cek Weton</h1>
          <p className="text-body-md text-muted">Hitung weton & neptu Jawa untuk tanggal apapun.</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-xl flex max-w-sm gap-3">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="flex-1 rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none focus:border-brand-accent" />
          <button type="submit"
            className="rounded-lg bg-brand-accent px-md py-sm text-body-sm font-medium text-white transition-opacity hover:opacity-90">
            Cek
          </button>
        </form>

        {result && (
          <div className="max-w-sm">
            {/* Date display */}
            <div className="mb-md rounded-xl border border-hairline bg-canvas p-lg text-center">
              <p className="text-caption text-muted mb-1">Weton untuk</p>
              <p className="font-display text-title-sm font-semibold text-ink">{fullDateId}</p>
            </div>

            {/* Weton result */}
            <div className="mb-md rounded-xl border border-brand-accent/20 bg-brand-accent/5 p-lg">
              <div className="mb-md flex items-center justify-center gap-md">
                <div className="text-center">
                  <p className="text-caption font-medium text-muted">Hari</p>
                  <p className="font-display text-title-md font-semibold text-ink">{result.hari}</p>
                  <p className="text-caption text-muted">({result.neptuHari})</p>
                </div>
                <div className="text-2xl text-muted">+</div>
                <div className="text-center">
                  <p className="text-caption font-medium text-muted">Pasaran</p>
                  <p className="font-display text-title-md font-semibold text-ink">{result.pasaran}</p>
                  <p className="text-caption text-muted">({result.neptuPasaran})</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-1 border-t border-brand-accent/20 pt-md">
                <p className="text-caption font-medium text-muted">Neptu</p>
                <p className="font-display text-display-sm font-semibold text-brand-accent">{result.neptuTotal}</p>
                {NEPTU_MEANING[result.neptuTotal] && (
                  <p className="text-caption text-muted">{NEPTU_MEANING[result.neptuTotal]}</p>
                )}
              </div>
            </div>

            {/* Weton name */}
            <div className="mb-lg rounded-xl border border-hairline bg-canvas p-md text-center">
              <p className="text-body-sm text-muted">Weton lengkap</p>
              <p className="font-display text-title-sm font-semibold text-ink">{result.hari} {result.pasaran}</p>
            </div>

            {/* Share button */}
            <button onClick={handleShare}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-hairline py-sm text-body-sm font-medium text-muted transition-colors hover:text-ink">
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              {copied ? "Link tersalin!" : "Salin link untuk berbagi"}
            </button>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

export default function CekWetonPage() {
  return (
    <Suspense>
      <CekWetonContent />
    </Suspense>
  );
}
