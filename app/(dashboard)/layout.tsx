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
    <div className="flex min-h-screen flex-col bg-surface-soft">
      <Navbar />
      <div className="flex flex-1">
        <div className="mx-auto flex w-full max-w-content flex-1 flex-col md:flex-row">
          <DashboardSidebar />
          <main className="min-w-0 flex-1 bg-canvas px-lg py-xl md:px-xl">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
