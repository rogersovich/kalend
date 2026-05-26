"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonImporter from "@/components/admin/JsonImporter";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function AdminImportPage() {
  const currentYear = new Date().getFullYear();
  const [country, setCountry] = useState("ID");
  const [year, setYear] = useState(currentYear);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-content px-lg py-xl">
        <div className="mb-md">
          <Link href="/admin" className="flex items-center gap-1 text-caption text-muted hover:text-ink">
            <ChevronLeft className="h-3 w-3" /> Admin
          </Link>
        </div>

        <h1 className="mb-lg font-display text-title-md font-semibold text-ink">Import Data Hari Libur</h1>

        <div className="mb-lg flex gap-4">
          <div>
            <label className="mb-1 block text-caption font-medium text-ink">Negara</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none focus:border-brand-accent"
            >
              <option value="ID">Indonesia (ID)</option>
              <option value="MY">Malaysia (MY)</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-caption font-medium text-ink">Tahun</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none focus:border-brand-accent"
            >
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
