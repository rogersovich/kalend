import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
        className={`${jakarta.variable} ${inter.variable} ${jetbrains.variable} min-h-screen bg-canvas font-body text-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
