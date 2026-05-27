import type { Metadata } from "next";
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
    badge: "Optimizer",
  },
  {
    href: "/tools/cek-weton",
    icon: Calendar,
    label: "Cek Weton",
    desc: "Hitung weton & neptu kalender Jawa untuk tanggal apapun. Bisa dibagikan via URL.",
    badge: "Jawa",
  },
];

export default function ToolsPage() {
  return (
    <main className="mx-auto max-w-content px-lg py-md sm:py-xl">

        {/* Color block hero */}
        <div className="mb-lg rounded-lg bg-block-mint p-lg sm:mb-xl sm:p-xxl">
          <p className="mb-sm font-mono text-sm uppercase tracking-widest text-ink/60 sm:text-eyebrow">Tools</p>
          <h1 className="font-display text-display-md font-normal text-ink sm:text-display-lg">Tools Kalender</h1>
          <p className="mt-sm font-display text-body-sm text-ink sm:text-body-lg">Kalkulator dan tools kalender gratis.</p>
        </div>

        <div className="grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-3">
          {tools.map(({ href, icon: Icon, label, desc, badge }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-md rounded-lg border border-hairline bg-canvas p-lg transition-opacity hover:opacity-80"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-soft text-ink">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="rounded-pill bg-surface-soft px-sm py-xxs font-mono text-caption uppercase tracking-widest text-ink">
                  {badge}
                </span>
              </div>
              <div>
                <p className="mb-xs font-display text-headline text-ink">{label}</p>
                <p className="font-display text-body-sm text-ink">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
    </main>
  );
}
