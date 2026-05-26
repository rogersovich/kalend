import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cuti Optimizer — Strategi Cuti Paling Efisien",
  description: "Temukan kombinasi cuti paling efisien untuk Indonesia dan Malaysia. Optimalkan jatah cuti Anda untuk libur terpanjang.",
  openGraph: {
    title: "Cuti Optimizer — Kalend",
    description: "Temukan kombinasi cuti paling efisien untuk libur terpanjang di Indonesia dan Malaysia.",
    url: "/tools/cuti-optimizer",
    type: "website",
  },
  alternates: { canonical: "/tools/cuti-optimizer" },
};

export default function CutiOptimizerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
