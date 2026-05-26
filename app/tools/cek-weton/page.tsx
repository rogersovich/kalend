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

        {/* Color block hero */}
        <div className="mb-xl rounded-lg bg-block-lilac p-xxl">
          <p className="mb-sm font-mono text-caption uppercase tracking-widest text-ink/60">Tools</p>
          <h1 className="mb-md font-display text-display-lg font-normal text-ink leading-tight">Cek Weton</h1>
          <p className="font-display text-body-lg text-ink">Hitung weton & neptu Jawa untuk tanggal apapun.</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-xl flex max-w-sm gap-sm">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="flex-1 rounded-md border border-hairline bg-canvas px-[14px] py-[12px] font-display text-body-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink"
          />
          <button
            type="submit"
            className="rounded-pill bg-primary px-lg py-xs font-display text-button font-medium text-white transition-colors hover:bg-primary-active"
          >
            Cek
          </button>
        </form>

        {result && (
          <div className="max-w-sm">
            {/* Date display */}
            <div className="mb-md rounded-lg bg-block-mint p-lg text-center">
              <p className="font-mono text-caption uppercase tracking-widest text-ink/60 mb-xs">Weton untuk</p>
              <p className="font-display text-headline font-medium text-ink">{fullDateId}</p>
            </div>

            {/* Color block: LILAC for weton result */}
            <div className="mb-md rounded-lg bg-block-lilac p-lg">
              <div className="mb-md flex items-center justify-center gap-lg">
                <div className="text-center">
                  <p className="font-mono text-caption uppercase tracking-widest text-ink/60">Hari</p>
                  <p className="font-display text-headline font-medium text-ink">{result.hari}</p>
                  <p className="font-mono text-caption text-ink/60">({result.neptuHari})</p>
                </div>
                <div className="font-display text-body-lg text-ink/40">+</div>
                <div className="text-center">
                  <p className="font-mono text-caption uppercase tracking-widest text-ink/60">Pasaran</p>
                  <p className="font-display text-headline font-medium text-ink">{result.pasaran}</p>
                  <p className="font-mono text-caption text-ink/60">({result.neptuPasaran})</p>
                </div>
              </div>

              <div className="flex flex-col items-center gap-xs border-t border-ink/10 pt-md">
                <p className="font-mono text-caption uppercase tracking-widest text-ink/60">Neptu</p>
                <p className="font-display text-display-lg font-normal text-ink">{result.neptuTotal}</p>
                {NEPTU_MEANING[result.neptuTotal] && (
                  <p className="font-display text-body-sm text-ink">{NEPTU_MEANING[result.neptuTotal]}</p>
                )}
              </div>
            </div>

            {/* Weton name */}
            <div className="mb-lg rounded-lg bg-block-cream p-md text-center">
              <p className="font-mono text-caption uppercase tracking-widest text-ink/60">Weton lengkap</p>
              <p className="font-display text-headline font-medium text-ink">{result.hari} {result.pasaran}</p>
            </div>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex w-full items-center justify-center gap-sm rounded-pill border border-hairline py-xs font-display text-button font-medium text-ink/60 transition-colors hover:text-ink"
            >
              {copied ? <Check className="h-4 w-4 text-semantic-success" /> : <Copy className="h-4 w-4" />}
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
