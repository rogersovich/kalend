import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Daftar Akun Kalend",
  description: "Buat akun Kalend gratis untuk menyimpan event pribadi dan mengakses API publik.",
  robots: { index: false },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
