import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cek Weton Jawa — Kalend",
  description: "Hitung weton dan neptu Jawa untuk tanggal apapun secara gratis. Ketahui weton hari lahir, pasaran, dan makna neptu Anda.",
  openGraph: {
    title: "Cek Weton Jawa — Kalend",
    description: "Hitung weton dan neptu Jawa untuk tanggal apapun secara gratis.",
    url: "/tools/cek-weton",
    type: "website",
    images: [
      {
        url: "/img/kalend-og-image-tools.png",
        width: 1200,
        height: 630,
        alt: "Cek Weton Jawa — Kalend",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/img/kalend-og-image-tools.png"],
  },
  alternates: { canonical: "/tools/cek-weton" },
};

export default function CekWetonLayout({ children }: { children: React.ReactNode }) {
  return children;
}
