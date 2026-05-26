import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Calculator, CalendarCheck, Calendar } from "lucide-react";

export const metadata: Metadata = {
  title: "Tools Kalender — Kalkulator Tanggal, Cuti Optimizer, Cek Weton | Kalend",
  description: "Kumpulan tools kalender gratis: kalkulator tanggal, optimizer cuti efisien, cek weton Jawa.",
  openGraph: {
    title: "Tools Kalender — Kalend",
    description: "Kalkulator tanggal, cuti optimizer, cek weton Jawa, dan tools kalender gratis lainnya.",
    url: "/tools",
    type: "website",
    siteName: "Kalend",
  },
  alternates: { canonical: "/tools" },
};

const tools = [
  {
    href: "/tools/kalkulator",
    icon: Calculator,
    label: "Kalkulator Tanggal",
    desc: "Hitung selisih tanggal, tambah/kurangi hari, hari kerja, nama hari, dan umur.",
    badge: "5 fitur",
  },
  {
    href: "/tools/cuti-optimizer",
    icon: CalendarCheck,
    label: "Cuti Optimizer",
    desc: "Temukan kombinasi cuti paling efisien untuk long weekend terpanjang.",
    badge: "F-06",
  },
  {
    href: "/tools/cek-weton",
    icon: Calendar,
    label: "Cek Weton",
    desc: "Hitung weton & neptu kalender Jawa untuk tanggal apapun. Bisa dibagikan via URL.",
    badge: "F-07",
  },
];

export default function ToolsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-content px-lg py-xl">
        <div className="mb-xl">
          <h1 className="font-display text-display-sm font-semibold text-ink">Tools</h1>
          <p className="text-body-md text-muted">Kalkulator dan tools kalender gratis.</p>
        </div>

        <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ href, icon: Icon, label, desc, badge }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-md rounded-xl border border-hairline bg-canvas p-lg transition-all hover:border-brand-accent/30 hover:shadow-soft"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-accent/10 text-brand-accent transition-colors group-hover:bg-brand-accent group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-surface-soft px-2 py-0.5 text-caption text-muted">{badge}</span>
              </div>
              <div>
                <p className="mb-1 font-display text-title-sm font-semibold text-ink">{label}</p>
                <p className="text-body-sm text-muted">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
