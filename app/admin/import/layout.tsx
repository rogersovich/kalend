import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Import Data — Admin Kalend",
  robots: { index: false },
};

export default function AdminImportLayout({ children }: { children: React.ReactNode }) {
  return children;
}
