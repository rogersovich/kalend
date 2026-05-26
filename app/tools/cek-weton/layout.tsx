import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cek Weton Jawa — Kalend",
  description: "Hitung weton dan neptu Jawa untuk tanggal apapun secara gratis. Ketahui weton hari lahir, pasaran, dan makna neptu Anda.",
  openGraph: {
    title: "Cek Weton Jawa — Kalend",
    description: "Hitung weton dan neptu Jawa untuk tanggal apapun secara gratis.",
    url: "/tools/cek-weton",
    type: "website",
  },
  alternates: { canonical: "/tools/cek-weton" },
};

export default function CekWetonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
