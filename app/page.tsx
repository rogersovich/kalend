import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, CalendarDays, Calculator, Zap, Globe, Key } from "lucide-react";

export const metadata: Metadata = {
  title: "Kalend — Kalender Indonesia & Malaysia Lengkap",
  description:
    "Kalender digital lengkap untuk Indonesia dan Malaysia. Hari libur nasional, cuti bersama, penanggalan Jawa, cuti optimizer, dan API publik.",
  openGraph: {
    title: "Kalend — Kalender Indonesia & Malaysia Lengkap",
    description:
      "Kalender digital lengkap untuk Indonesia dan Malaysia. Hari libur nasional, cuti bersama, penanggalan Jawa, cuti optimizer, dan API publik.",
    url: "/",
    type: "website",
    siteName: "Kalend",
  },
  alternates: { canonical: "/" },
};

const currentYear = new Date().getFullYear();

const features = [
  {
    icon: CalendarDays,
    label: "Kalender Lengkap",
    desc: "Tahunan, bulanan, dan detail harian dengan hari libur nasional, cuti bersama, dan penanggalan Jawa.",
  },
  {
    icon: Zap,
    label: "Long Weekend",
    desc: "Deteksi otomatis semua periode libur panjang dan strategi cuti paling efisien.",
  },
  {
    icon: Calculator,
    label: "Tools Kalender",
    desc: "Kalkulator selisih tanggal, hari kerja, hitung umur, cek weton, dan cuti optimizer.",
  },
  {
    icon: Globe,
    label: "Indonesia & Malaysia",
    desc: "Data hari libur akurat untuk 2 negara — Indonesia (34 provinsi) dan Malaysia (16 negeri).",
  },
  {
    icon: Key,
    label: "API Publik",
    desc: "REST API untuk developer. Akses data hari libur, kalender, dan kalkulasi via HTTP.",
  },
  {
    icon: Calendar,
    label: "Weton Jawa",
    desc: "Kalkulasi weton & neptu kalender Jawa untuk tanggal apapun, client-side tanpa delay.",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* ── White canvas hero ── */}
      <section className="mx-auto max-w-content px-lg py-section text-center">
        {/* eyebrow label — figmaMono uppercase */}
        <p className="mb-lg font-mono text-eyebrow uppercase tracking-widest text-muted">
          Kalender Indonesia & Malaysia
        </p>
        <h1 className="mx-auto mb-lg max-w-3xl font-display text-display-lg font-normal text-ink">
          Satu platform untuk semua kebutuhan kalender kerjamu
        </h1>
        <p className="mx-auto mb-xl max-w-xl font-display text-body-lg text-muted">
          Hari libur nasional, long weekend, penanggalan Jawa, dan API publik — semua gratis.
        </p>
        {/* Black + white pill pair */}
        <div className="flex flex-wrap items-center justify-center gap-sm">
          <Link
            href={`/${currentYear}`}
            className="inline-flex items-center justify-center rounded-pill bg-primary px-lg py-xs font-display text-button font-medium text-white transition-colors hover:bg-primary-active"
          >
            Buka Kalender {currentYear}
          </Link>
          <Link
            href="/tools"
            className="inline-flex items-center justify-center rounded-pill bg-canvas px-lg py-xs font-display text-button font-medium text-ink transition-colors hover:bg-surface-soft border border-hairline"
          >
            Lihat Tools
          </Link>
        </div>
      </section>

      {/* ── Marquee strip (inverse canvas) ── */}
      <div className="w-full overflow-hidden bg-inverse-canvas py-xs">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-xl px-lg">
          {["Indonesia", "Malaysia", "Hari Libur", "Long Weekend", "Weton Jawa", "API Publik"].map((label) => (
            <span key={label} className="font-display text-body-sm font-medium text-white whitespace-nowrap">
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* ── White canvas — quick nav chips ── */}
      <section className="mx-auto max-w-content px-lg py-xl">
        <div className="flex flex-wrap items-center justify-center gap-xs">
          {[
            { label: "Kalender", href: `/${currentYear}` },
            { label: "Long Weekend", href: `/long-weekends/${currentYear}` },
            { label: "Kalkulator", href: "/tools/kalkulator" },
            { label: "Cuti Optimizer", href: "/tools/cuti-optimizer" },
            { label: "Cek Weton", href: "/tools/cek-weton" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="rounded-pill border border-hairline bg-canvas px-md py-xxs font-display text-body-sm text-muted transition-colors hover:border-ink/20 hover:text-ink"
            >
              {label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Color block: LIME — features ── */}
      <section className="mx-auto max-w-content px-lg pb-section">
        <div className="rounded-lg bg-block-lime p-xxl">
          <p className="mb-md font-mono text-eyebrow uppercase tracking-widest text-ink/60">
            Fitur
          </p>
          <h2 className="mb-xxl max-w-lg font-display text-display-lg font-normal text-ink">
            Semua yang kamu butuhkan
          </h2>
          <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="rounded-lg bg-canvas p-lg shadow-elevated">
                <div className="mb-md flex h-9 w-9 items-center justify-center rounded-full bg-surface-soft text-ink">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mb-xs font-display text-headline font-medium text-ink">{label}</p>
                <p className="font-display text-body-sm text-muted">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── White canvas breathing room ── */}
      <div className="py-section" />

      {/* ── Color block: NAVY — ship/CTA ── */}
      <section className="mx-auto max-w-content px-lg pb-section">
        <div className="rounded-lg bg-block-navy p-xxl">
          <p className="mb-md font-mono text-eyebrow uppercase tracking-widest text-white/60">
            Mulai sekarang
          </p>
          <h2 className="mb-md max-w-lg font-display text-display-lg font-normal text-white">
            Mulai gratis, tanpa kartu kredit
          </h2>
          <p className="mb-xl max-w-md font-display text-body-lg text-white/70">
            Buat akun untuk menyimpan event pribadi dan mengakses API publik dengan rate limit lebih tinggi.
          </p>
          <div className="flex flex-wrap gap-sm">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-pill bg-canvas px-lg py-xs font-display text-button font-medium text-ink transition-colors hover:bg-surface-soft"
            >
              Daftar gratis
            </Link>
            <Link
              href={`/${currentYear}`}
              className="inline-flex items-center justify-center rounded-pill border border-white/30 px-lg py-xs font-display text-button font-medium text-white/80 transition-colors hover:border-white/60 hover:text-white"
            >
              Lihat kalender
            </Link>
          </div>
        </div>
      </section>

      {/* ── White canvas breathing room ── */}
      <div className="py-lg" />

      {/* ── Color block: CORAL — developer/API ── */}
      <section className="mx-auto max-w-content px-lg pb-section">
        <div className="rounded-lg bg-block-coral p-xxl">
          <p className="mb-md font-mono text-eyebrow uppercase tracking-widest text-ink/60">
            Developer
          </p>
          <h2 className="mb-md max-w-lg font-display text-display-lg font-normal text-ink">
            API publik siap pakai
          </h2>
          <p className="mb-xl max-w-md font-display text-body-lg text-ink/70">
            REST API untuk mengakses data hari libur, kalender, dan kalkulasi tanggal via HTTP. Gratis, no auth required.
          </p>
          <div className="flex flex-wrap gap-sm">
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-pill bg-primary px-lg py-xs font-display text-button font-medium text-white transition-colors hover:bg-primary-active"
            >
              Lihat Dokumentasi
            </Link>
            <Link
              href="/dashboard/api-keys"
              className="inline-flex items-center justify-center rounded-pill border border-ink/20 bg-canvas px-lg py-xs font-display text-button font-medium text-ink transition-colors hover:bg-surface-soft"
            >
              Dapatkan API Key
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
