import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Kelola event, API keys, dan pengaturan akun Kalend Anda.",
  robots: { index: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-content px-lg py-xl">
        <div className="flex flex-col gap-lg md:flex-row">
          <DashboardSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
