import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Buat password baru untuk akun Kalend Anda.",
  robots: { index: false },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return children;
}
