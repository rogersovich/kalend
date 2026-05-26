import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lupa Password",
  description: "Reset password akun Kalend Anda.",
  robots: { index: false },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
