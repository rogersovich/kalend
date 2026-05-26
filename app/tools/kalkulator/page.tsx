"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import { cn } from "@/lib/utils";
import TabSelisih from "@/components/tools/TabSelisih";
import TabTambahKurang from "@/components/tools/TabTambahKurang";
import TabHariKerja from "@/components/tools/TabHariKerja";
import TabNamaHari from "@/components/tools/TabNamaHari";
import TabHitungUmur from "@/components/tools/TabHitungUmur";

const TABS = [
  { id: "selisih", label: "Selisih Tanggal" },
  { id: "tambah", label: "Tambah/Kurangi" },
  { id: "hari-kerja", label: "Hari Kerja" },
  { id: "nama-hari", label: "Nama Hari" },
  { id: "umur", label: "Hitung Umur" },
];

export default function KalkulatorPage() {
  const [active, setActive] = useState("selisih");

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-content px-lg py-xl">
        <div className="mb-md">
          <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Kalkulator Tanggal" }]} />
        </div>

        <h1 className="mb-lg font-display text-display-sm font-semibold text-ink">Kalkulator Tanggal</h1>

        {/* Tab bar */}
        <div className="mb-lg overflow-x-auto">
          <div className="inline-flex min-w-full gap-1 rounded-xl bg-surface-soft p-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "whitespace-nowrap rounded-lg px-md py-sm text-body-sm font-medium transition-colors",
                  active === tab.id
                    ? "bg-canvas text-ink shadow-soft"
                    : "text-muted hover:text-ink"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="max-w-xl">
          {active === "selisih" && <TabSelisih />}
          {active === "tambah" && <TabTambahKurang />}
          {active === "hari-kerja" && <TabHariKerja />}
          {active === "nama-hari" && <TabNamaHari />}
          {active === "umur" && <TabHitungUmur />}
        </div>
      </main>
      <Footer />
    </>
  );
}
