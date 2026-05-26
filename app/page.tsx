import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, CalendarDays, Calculator, Zap, Globe, Key } from "lucide-react";

export const metadata: Metadata = {
  title: "Kalend — Kalender Indonesia & Malaysia Lengkap",
  description: "Kalender digital lengkap untuk Indonesia dan Malaysia. Hari libur nasional, cuti bersama, penanggalan Jawa, cuti optimizer, dan API publik.",
  openGraph: {
    title: "Kalend — Kalender Indonesia & Malaysia Lengkap",
    description: "Kalender digital lengkap untuk Indonesia dan Malaysia. Hari libur nasional, cuti bersama, penanggalan Jawa, cuti optimizer, dan API publik.",
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

      {/* Hero */}
      <section className="mx-auto max-w-content px-lg py-[80px] text-center">
        <div className="mx-auto mb-md flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-accent text-white shadow-soft">
          <Calendar className="h-8 w-8" />
        </div>
        <h1 className="mx-auto mb-md max-w-2xl font-display text-display-lg font-semibold text-ink">
          Kalender Indonesia & Malaysia Paling Lengkap
        </h1>
        <p className="mx-auto mb-xl max-w-xl text-body-lg text-muted">
          Hari libur nasional, cuti bersama, penanggalan Jawa, long weekend optimizer, dan API publik — semua dalam satu platform.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href={`/${currentYear}`}
            className="rounded-xl bg-brand-accent px-xl py-md font-display text-body-md font-semibold text-white transition-opacity hover:opacity-90"
          >
            Buka Kalender {currentYear}
          </Link>
          <Link
            href="/tools"
            className="rounded-xl border border-hairline bg-canvas px-xl py-md font-display text-body-md font-semibold text-ink transition-colors hover:bg-surface-soft"
          >
            Lihat Tools
          </Link>
        </div>
      </section>

      {/* Quick links */}
      <section className="border-y border-hairline bg-surface-soft py-md">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-xs px-lg">
          {["Kalender", "Long Weekend", "Kalkulator", "Cuti Optimizer", "Cek Weton"].map((label, i) => {
            const hrefs = [
              `/${currentYear}`,
              `/long-weekends/${currentYear}`,
              "/tools/kalkulator",
              "/tools/cuti-optimizer",
              "/tools/cek-weton",
            ];
            return (
              <Link
                key={label}
                href={hrefs[i]}
                className="rounded-full border border-hairline bg-canvas px-md py-xs text-body-sm text-muted transition-colors hover:border-brand-accent/40 hover:text-ink"
              >
                {label}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-content px-lg py-xl">
        <h2 className="mb-lg text-center font-display text-display-sm font-semibold text-ink">
          Semua yang kamu butuhkan
        </h2>
        <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="rounded-xl border border-hairline bg-canvas p-lg">
              <div className="mb-md flex h-9 w-9 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mb-xs font-display text-title-sm font-semibold text-ink">{label}</p>
              <p className="text-body-sm text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-content px-lg pb-xl">
        <div className="rounded-2xl bg-surface-dark px-xl py-[60px] text-center">
          <h2 className="mb-sm font-display text-display-sm font-semibold text-white">
            Mulai gratis sekarang
          </h2>
          <p className="mb-lg text-body-md text-white/60">
            Buat akun untuk menyimpan event pribadi dan mengakses API publik.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-brand-accent px-xl py-md font-display text-body-md font-semibold text-white transition-opacity hover:opacity-90"
            >
              Daftar gratis
            </Link>
            <Link
              href={`/${currentYear}`}
              className="rounded-xl border border-white/20 px-xl py-md font-display text-body-md font-semibold text-white/80 transition-colors hover:border-white/40 hover:text-white"
            >
              Lihat kalender
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
