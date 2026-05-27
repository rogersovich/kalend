"use client";

import { useState, useRef } from "react";
import { Upload, FileJson, CheckCircle, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";

interface HolidayRow {
  date: string;
  name: string;
  type: string;
  description?: string;
  regionCode?: string;
}

interface ImportResult {
  inserted: number;
  updated: number;
  skipped: number;
  errors: string[];
}

interface JsonImporterProps {
  countryCode: string;
  year: number;
}

const TEMPLATES: Record<string, HolidayRow[]> = {
  ID: [
    { date: "YYYY-01-01", name: "Tahun Baru Masehi", type: "national" },
    { date: "YYYY-03-29", name: "Hari Raya Nyepi", type: "national", description: "Tahun Baru Saka" },
    { date: "YYYY-04-18", name: "Wafat Yesus Kristus", type: "national" },
    { date: "YYYY-05-01", name: "Hari Buruh Internasional", type: "national" },
    { date: "YYYY-08-17", name: "Hari Kemerdekaan Republik Indonesia", type: "national" },
    { date: "YYYY-12-25", name: "Hari Raya Natal", type: "national" },
    { date: "YYYY-03-28", name: "Cuti Bersama Nyepi", type: "joint_leave" },
    { date: "YYYY-02-01", name: "Hari Jadi Provinsi Bali", type: "regional", regionCode: "ID-BA" },
  ],
  MY: [
    { date: "YYYY-01-01", name: "New Year's Day", type: "national" },
    { date: "YYYY-02-01", name: "Federal Territory Day", type: "national", description: "Wilayah Persekutuan only", regionCode: "MY-14" },
    { date: "YYYY-05-01", name: "Labour Day", type: "national" },
    { date: "YYYY-08-31", name: "National Day", type: "national" },
    { date: "YYYY-09-16", name: "Malaysia Day", type: "national" },
    { date: "YYYY-12-25", name: "Christmas Day", type: "national" },
  ],
};

function downloadTemplate(countryCode: string, year: number) {
  const rows = (TEMPLATES[countryCode] ?? TEMPLATES.ID).map((row) => ({
    ...row,
    date: row.date.replace("YYYY", String(year)),
  }));
  const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `template-holidays-${countryCode}-${year}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success(`Template ${countryCode} ${year} diunduh`);
}

export default function JsonImporter({ countryCode, year }: JsonImporterProps) {
  const [json, setJson] = useState("");
  const [preview, setPreview] = useState<HolidayRow[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [mode, setMode] = useState<"add" | "update">("add");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function validateAndReadFile(file: File) {
    if (!file.name.endsWith(".json") && file.type !== "application/json") {
      setParseError(`File "${file.name}" bukan format .json. Hanya file JSON yang diterima.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setJson(text);
      parseJson(text);
    };
    reader.readAsText(file);
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    validateAndReadFile(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    validateAndReadFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave() {
    setDragging(false);
  }

  function parseJson(text: string) {
    setParseError(null);
    setPreview(null);
    setResult(null);
    try {
      const parsed = JSON.parse(text);
      const rows: HolidayRow[] = Array.isArray(parsed) ? parsed : parsed.holidays ?? [];
      if (!rows.length) throw new Error("Array kosong");
      setPreview(rows.slice(0, 10));
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "JSON tidak valid");
    }
  }

  async function handleImport() {
    if (!preview) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryCode, year, mode, data: JSON.parse(json) }),
      });
      const data = await res.json();
      const r = data.result as ImportResult;
      setResult(r);
      if (r.errors.length) {
        toast.error(`Import selesai dengan ${r.errors.length} error`);
      } else {
        toast.success(`Import berhasil — ${r.inserted} inserted, ${r.updated} updated, ${r.skipped} skipped`);
      }
    } catch {
      setResult({ inserted: 0, updated: 0, skipped: 0, errors: ["Request gagal"] });
      toast.error("Request gagal");
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-lg">
      {/* Download template */}
      <div className="flex items-center justify-between rounded-lg border border-hairline bg-surface-soft px-lg py-md">
        <div>
          <p className="font-display text-body-sm font-medium text-ink">Download Template JSON</p>
          <p className="font-mono text-caption text-ink/60">Contoh format untuk {countryCode} {year}</p>
        </div>
        <button
          onClick={() => downloadTemplate(countryCode, year)}
          className="flex items-center gap-xs rounded-pill border border-hairline bg-canvas px-md py-xs font-display text-body-sm font-medium text-ink transition-colors hover:bg-ink hover:text-white"
        >
          <Download className="h-4 w-4" />
          Download Template
        </button>
      </div>

      {/* Upload area */}
      <div
        onClick={() => fileRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex cursor-pointer flex-col items-center justify-center gap-sm rounded-lg border-2 border-dashed py-xl transition-colors ${
          dragging
            ? "border-primary bg-primary/5"
            : "border-hairline bg-surface-soft hover:border-primary/40"
        }`}
      >
        <FileJson className={`h-8 w-8 ${dragging ? "text-primary" : "text-ink/40"}`} />
        <p className="font-display text-body-sm font-medium text-ink">
          {dragging ? "Lepas file di sini" : "Upload atau drag & drop file JSON"}
        </p>
        <p className="font-mono text-caption text-ink/60">atau paste langsung di bawah</p>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFile} />
      </div>

      {/* Textarea */}
      <div>
        <label className="mb-xs block font-mono text-caption uppercase tracking-widest text-ink/60">JSON</label>
        <textarea
          rows={8}
          value={json}
          onChange={(e) => { setJson(e.target.value); parseJson(e.target.value); }}
          placeholder='[{"date":"2026-01-01","name":"Tahun Baru Masehi","type":"national"}]'
          className="w-full resize-y rounded-lg border border-hairline bg-surface-soft px-md py-sm font-mono text-caption text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {parseError && (
          <p className="mt-xs flex items-center gap-xs font-mono text-caption text-error">
            <AlertCircle className="h-3 w-3 shrink-0" /> {parseError}
          </p>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div>
          <p className="mb-xs font-mono text-caption uppercase tracking-widest text-ink/60">Preview (10 baris pertama)</p>
          <div className="overflow-x-auto rounded-lg border border-hairline">
            <table className="w-full text-left">
              <thead className="bg-surface-soft">
                <tr>
                  {["date", "name", "type", "description", "regionCode"].map((h) => (
                    <th key={h} className="px-md py-sm font-mono text-caption uppercase tracking-widest text-ink/60">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-t border-hairline hover:bg-surface-soft">
                    <td className="px-md py-sm font-mono text-caption text-ink">{row.date}</td>
                    <td className="px-md py-sm font-display text-body-sm text-ink">{row.name}</td>
                    <td className="px-md py-sm font-mono text-caption text-ink">{row.type}</td>
                    <td className="px-md py-sm font-display text-body-sm text-ink/60">{row.description ?? "—"}</td>
                    <td className="px-md py-sm font-mono text-caption text-ink/60">{row.regionCode ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Options */}
      {preview && (
        <div className="flex items-center gap-lg">
          <div>
            <label className="mb-xs block font-mono text-caption uppercase tracking-widest text-ink/60">Mode</label>
            <div className="flex gap-xs">
              {(["add", "update"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-pill px-md py-xs font-mono text-caption font-medium transition-colors ${
                    mode === m
                      ? "bg-primary text-white"
                      : "border border-hairline text-ink/60 hover:text-ink"
                  }`}
                >
                  {m === "add" ? "Add (skip duplikat)" : "Update (upsert)"}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleImport}
            disabled={loading || !preview}
            className="ml-auto flex items-center gap-xs rounded-pill bg-primary px-lg py-xs font-display text-button font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {loading ? "Mengimport..." : "Import"}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`rounded-lg p-lg ${result.errors.length ? "bg-error/8" : "bg-block-mint"}`}>
          <div className="mb-sm flex items-center gap-sm">
            {result.errors.length ? (
              <AlertCircle className="h-5 w-5 text-error" />
            ) : (
              <CheckCircle className="h-5 w-5 text-ink" />
            )}
            <span className="font-display font-medium text-ink">Import selesai</span>
          </div>
          <div className="flex gap-lg font-mono text-caption text-ink/60">
            <span>Inserted: <strong className="text-ink">{result.inserted}</strong></span>
            <span>Updated: <strong className="text-ink">{result.updated}</strong></span>
            <span>Skipped: <strong className="text-ink">{result.skipped}</strong></span>
          </div>
          {result.errors.length > 0 && (
            <ul className="mt-sm flex flex-col gap-xxs">
              {result.errors.map((e, i) => (
                <li key={i} className="font-mono text-caption text-error">{e}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
