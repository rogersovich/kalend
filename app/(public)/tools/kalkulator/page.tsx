"use client";

import { useState } from "react";
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
    <main className="mx-auto max-w-content px-lg py-md sm:py-xl">
        <div className="mb-md">
          <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Tools", href: "/tools" }, { label: "Kalkulator Tanggal" }]} />
        </div>

        {/* Color block hero */}
        <div className="mb-lg rounded-lg bg-block-mint p-lg sm:mb-xl sm:p-xxl">
          <p className="mb-sm font-mono text-sm uppercase tracking-widest text-ink/60 sm:text-caption">Tools</p>
          <h1 className="mb-md font-display text-display-md font-normal text-ink leading-tight sm:text-display-lg">Kalkulator Tanggal</h1>
          <p className="font-display text-body-sm text-ink sm:text-body-lg">Hitung selisih, tambah/kurangi, hari kerja, nama hari, dan umur dari tanggal.</p>
        </div>

        {/* Pill tab bar */}
        <div className="mb-lg overflow-x-auto">
          <div className="inline-flex min-w-full gap-xs rounded-pill bg-surface-soft p-xs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={cn(
                  "whitespace-nowrap rounded-pill px-md py-xs font-display text-body-sm font-medium transition-colors",
                  active === tab.id
                    ? "bg-primary text-white"
                    : "text-ink/50 hover:text-ink"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-xl">
          {active === "selisih" && <TabSelisih />}
          {active === "tambah" && <TabTambahKurang />}
          {active === "hari-kerja" && <TabHariKerja />}
          {active === "nama-hari" && <TabNamaHari />}
          {active === "umur" && <TabHitungUmur />}
        </div>
    </main>
  );
}
