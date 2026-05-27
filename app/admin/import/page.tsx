"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonImporter from "@/components/admin/JsonImporter";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const selectCls = "w-full rounded-md border border-hairline bg-canvas px-md py-xs font-display text-body-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink sm:w-auto";

export default function AdminImportPage() {
  const currentYear = new Date().getFullYear();
  const [country, setCountry] = useState("ID");
  const [year, setYear] = useState(currentYear);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-content px-lg py-md sm:py-xl">
        <div className="mb-md">
          <Link href="/admin" className="inline-flex items-center gap-xs font-mono text-caption uppercase tracking-widest text-ink/60 transition-colors hover:text-ink">
            <ChevronLeft className="h-3 w-3" /> Admin
          </Link>
        </div>

        {/* Color block hero */}
        <div className="mb-lg rounded-lg bg-block-coral p-lg sm:mb-xl sm:p-xxl">
          <p className="mb-sm font-mono text-sm uppercase tracking-widest text-ink/60 sm:text-caption">Admin</p>
          <h1 className="mb-md font-display text-display-md font-normal text-ink leading-tight sm:text-display-lg">Import Data Hari Libur</h1>
          <p className="font-display text-body-sm text-ink sm:text-body-lg">Upload file JSON untuk menambah atau memperbarui data hari libur.</p>
        </div>

        {/* Filters */}
        <div className="mb-lg flex flex-col gap-sm sm:mb-xl sm:flex-row sm:flex-wrap sm:gap-md">
          <div>
            <label className="mb-xs block font-mono text-caption uppercase tracking-widest text-ink/60">Negara</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className={selectCls}>
              <option value="ID">Indonesia (ID)</option>
              <option value="MY">Malaysia (MY)</option>
            </select>
          </div>
          <div>
            <label className="mb-xs block font-mono text-caption uppercase tracking-widest text-ink/60">Tahun</label>
            <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={selectCls}>
              {Array.from({ length: 11 }, (_, i) => 2020 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <JsonImporter countryCode={country} year={year} />
      </main>
      <Footer />
    </>
  );
}
