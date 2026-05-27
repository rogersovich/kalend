import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageSquare, Clock } from "lucide-react";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Kontak",
  description: "Hubungi tim Kalend untuk pertanyaan, laporan bug, atau kolaborasi.",
  alternates: { canonical: "/contact" },
};

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hi@kalend.id",
    href: "mailto:hi@kalend.id",
  },
  {
    icon: MessageSquare,
    label: "Diskusi",
    value: "GitHub Discussions",
    href: "https://github.com/kalend/kalend/discussions",
  },
  {
    icon: Clock,
    label: "Waktu Respons",
    value: "1–2 hari kerja",
    href: null,
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="mx-auto max-w-content px-lg py-section text-center">
        <p className="mb-lg font-mono text-eyebrow uppercase tracking-widest text-muted">
          Kontak
        </p>
        <h1 className="mx-auto mb-lg max-w-2xl font-display text-display-lg font-normal text-ink">
          Ada pertanyaan? Hubungi kami
        </h1>
        <p className="mx-auto max-w-md font-display text-body-lg text-muted">
          Bug, saran fitur, kolaborasi, atau sekadar salam — kami senang mendengarnya.
        </p>
      </section>

      {/* ── Lime: form + info ── */}
      <section className="mx-auto max-w-content px-lg pb-section">
        <div className="rounded-lg bg-block-lime p-xxl">
          <p className="mb-md font-mono text-eyebrow uppercase tracking-widest text-ink/60">
            Kirim Pesan
          </p>
          <h2 className="mb-xxl max-w-md font-display text-display-lg font-normal text-ink">
            Kami baca setiap pesan
          </h2>

          <div className="grid grid-cols-1 gap-xxl lg:grid-cols-[1fr_320px]">
            {/* Form */}
            <ContactForm />

            {/* Info sidebar */}
            <div className="flex flex-col gap-lg">
              <p className="font-display text-body-sm text-ink/70">
                Untuk laporan bug atau request fitur, pertimbangkan membuka issue di GitHub agar bisa ditracking oleh komunitas.
              </p>

              <div className="flex flex-col gap-sm">
                {contactInfo.map(({ icon: Icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-md rounded-lg border border-hairline bg-canvas p-lg">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-soft text-ink">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-mono text-caption uppercase tracking-widest text-muted">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="font-display text-body-sm text-ink underline-offset-2 hover:underline"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="font-display text-body-sm text-ink">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-hairline bg-canvas p-lg">
                <p className="mb-xs font-mono text-caption uppercase tracking-widest text-muted">API & Docs</p>
                <p className="mb-sm font-display text-body-sm text-muted">
                  Pertanyaan teknis seputar API? Lihat dokumentasi dulu.
                </p>
                <Link
                  href="/docs"
                  className="inline-flex items-center justify-center rounded-pill border border-hairline bg-canvas px-md py-xs font-display text-body-sm font-medium text-ink transition-colors hover:bg-surface-soft"
                >
                  Lihat Dokumentasi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Breathing room ── */}
      <div className="py-lg" />
    </>
  );
}
