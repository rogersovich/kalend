import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Globe, Zap, Key } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Kalend dibuat untuk membantu developer, HR, dan tim operasional bekerja lebih cerdas dengan data hari libur Indonesia dan Malaysia.",
  alternates: { canonical: "/about" },
};

const stats = [
  { value: "2", label: "Negara" },
  { value: "11", label: "Tahun Data (2020–2030)" },
  { value: "10+", label: "API Endpoint" },
  { value: "34", label: "Provinsi Indonesia" },
];

const values = [
  {
    icon: Globe,
    title: "Data Akurat",
    body: "Setiap hari libur diverifikasi dari sumber resmi pemerintah Indonesia dan Malaysia. Update rutin tiap kali ada perubahan regulasi.",
  },
  {
    icon: Zap,
    title: "Developer First",
    body: "API dirancang untuk kemudahan integrasi — response konsisten, dokumentasi lengkap, dan rate limit yang wajar untuk proyek kecil maupun besar.",
  },
  {
    icon: Key,
    title: "Gratis & Transparan",
    body: "Kalend gratis untuk penggunaan personal dan proyek kecil. Tidak ada biaya tersembunyi, tidak ada paywall mendadak.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="mx-auto max-w-content px-lg py-section text-center">
        <p className="mb-lg font-mono text-eyebrow uppercase tracking-widest text-muted">
          Tentang Kami
        </p>
        <h1 className="mx-auto mb-lg max-w-3xl font-display text-display-lg font-normal text-ink">
          Platform kalender untuk semua orang
        </h1>
        <p className="mx-auto max-w-xl font-display text-body-lg text-muted">
          Kami membangun Kalend karena frustrasi dengan data hari libur yang tersebar, tidak akurat, dan sulit diintegrasikan ke aplikasi.
        </p>
      </section>

      {/* ── Inverse stats strip ── */}
      <div className="w-full bg-inverse-canvas py-md">
        <div className="mx-auto grid max-w-content grid-cols-2 gap-xl px-lg md:grid-cols-4">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="font-display text-display-lg font-normal text-inverse-ink">{value}</p>
              <p className="font-mono text-caption uppercase tracking-widest text-white/60">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Lilac: story ── */}
      <section className="mx-auto max-w-content px-lg py-section">
        <div className="rounded-lg bg-block-lilac p-xxl">
          <p className="mb-md font-mono text-eyebrow uppercase tracking-widest text-ink/60">
            Mengapa Kalend?
          </p>
          <h2 className="mb-lg max-w-lg font-display text-display-lg font-normal text-ink">
            Dimulai dari masalah nyata
          </h2>
          <div className="grid grid-cols-1 gap-xl md:grid-cols-2">
            <p className="font-display text-body-lg text-ink/80">
              Saat membangun sistem HR dan payroll, kami selalu menghadapi pertanyaan yang sama: "Apakah tanggal ini hari libur?" Data resmi sulit diakses secara programatik, tersebar di berbagai dokumen PDF, dan sering berbeda antara satu sumber dengan sumber lain.
            </p>
            <p className="font-display text-body-lg text-ink/80">
              Kalend hadir sebagai satu sumber kebenaran — REST API yang bisa dipanggil kapan saja, dengan data yang diverifikasi, konsisten, dan mencakup seluruh wilayah Indonesia dan Malaysia.
            </p>
          </div>
        </div>
      </section>

      {/* ── Cream: values ── */}
      <section className="mx-auto max-w-content px-lg pb-section">
        <div className="rounded-lg bg-block-cream p-xxl">
          <p className="mb-md font-mono text-eyebrow uppercase tracking-widest text-ink/60">
            Nilai Kami
          </p>
          <h2 className="mb-xxl max-w-lg font-display text-display-lg font-normal text-ink">
            Dibangun dengan prinsip sederhana
          </h2>
          <div className="grid grid-cols-1 gap-md sm:grid-cols-3">
            {values.map(({ icon: Icon, title, body }) => (
              <div key={title} className="rounded-lg bg-canvas p-lg shadow-elevated">
                <div className="mb-md flex h-9 w-9 items-center justify-center rounded-full bg-surface-soft text-ink">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mb-xs font-display text-headline font-medium text-ink">{title}</p>
                <p className="font-display text-body-sm text-muted">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Navy: CTA ── */}
      <section className="mx-auto max-w-content px-lg pb-section">
        <div className="rounded-lg bg-block-navy p-xxl">
          <p className="mb-md font-mono text-eyebrow uppercase tracking-widest text-white/60">
            Bergabung
          </p>
          <h2 className="mb-md max-w-lg font-display text-display-lg font-normal text-white">
            Mulai pakai Kalend hari ini
          </h2>
          <p className="mb-xl max-w-md font-display text-body-lg text-white/70">
            Gratis untuk penggunaan personal dan proyek kecil. Tidak perlu kartu kredit.
          </p>
          <div className="flex flex-wrap gap-sm">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-pill bg-canvas px-lg py-xs font-display text-button font-medium text-ink transition-colors hover:bg-surface-soft"
            >
              Daftar gratis
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-pill border border-white/30 px-lg py-xs font-display text-button font-medium text-white/80 transition-colors hover:border-white/60 hover:text-white"
            >
              Hubungi kami
            </Link>
          </div>
        </div>
      </section>

      {/* ── Breathing room ── */}
      <div className="py-lg" />
    </>
  );
}
