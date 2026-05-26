import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Kalend - Kalender Indonesia & Malaysia",
    template: "%s | Kalend",
  },
  description:
    "Kalender digital untuk hari libur Indonesia dan Malaysia, long weekend, event pribadi, dan API publik.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    siteName: "Kalend",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    site: "@kalend_id",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        className={`${inter.variable} ${plusJakarta.variable} min-h-screen bg-canvas font-display text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
