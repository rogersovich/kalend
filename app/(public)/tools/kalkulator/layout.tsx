import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalkulator Tanggal — Selisih, Hari Kerja, Umur",
  description: "Kalkulator tanggal lengkap: hitung selisih hari, tambah/kurangi hari, hitung hari kerja, nama hari, dan hitung umur secara gratis.",
  openGraph: {
    title: "Kalkulator Tanggal — Kalend",
    description: "Hitung selisih tanggal, hari kerja, tambah/kurangi hari, nama hari, dan umur secara gratis.",
    url: "/tools/kalkulator",
    type: "website",
    images: [
      {
        url: "/img/kalend-og-image-tools.png",
        width: 1200,
        height: 630,
        alt: "Kalkulator Tanggal — Kalend",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/img/kalend-og-image-tools.png"],
  },
  alternates: { canonical: "/tools/kalkulator" },
};

export default function KalkulatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
