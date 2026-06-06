import type { Metadata } from "next";

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: "/img/kalend-og-image-long-week.png",
        width: 1200,
        height: 630,
        alt: "Long Weekends — Kalend",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/img/kalend-og-image-long-week.png"],
  },
};

export default function LongWeekendsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
