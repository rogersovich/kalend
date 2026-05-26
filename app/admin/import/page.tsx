"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonImporter from "@/components/admin/JsonImporter";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

const selectCls = "rounded-md border border-hairline bg-canvas px-md py-xs font-display text-body-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink";

export default function AdminImportPage() {
  const currentYear = new Date().getFullYear();
  const [country, setCountry] = useState("ID");
  const [year, setYear] = useState(currentYear);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-content px-lg py-xl">
        <div className="mb-md">
          <Link href="/admin" className="flex items-center gap-1 font-display text-body-sm text-muted hover:text-ink">
            <ChevronLeft className="h-3 w-3" /> Admin
          </Link>
        </div>

        <h1 className="mb-lg font-display text-display-lg font-normal text-ink">Import Data Hari Libur</h1>

        <div className="mb-lg flex gap-md">
          <div>
            <label className="mb-xs block font-mono text-caption uppercase tracking-widest text-muted">Negara</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className={selectCls}>
              <option value="ID">Indonesia (ID)</option>
              <option value="MY">Malaysia (MY)</option>
            </select>
          </div>
          <div>
            <label className="mb-xs block font-mono text-caption uppercase tracking-widest text-muted">Tahun</label>
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
