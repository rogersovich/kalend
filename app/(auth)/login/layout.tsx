import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk ke Kalend",
  description: "Masuk ke akun Kalend untuk mengakses event pribadi, API keys, dan fitur premium.",
  robots: { index: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
