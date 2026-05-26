"use client";

import { useState, useRef } from "react";
import { Upload, FileJson, CheckCircle, AlertCircle } from "lucide-react";

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

export default function JsonImporter({ countryCode, year }: JsonImporterProps) {
  const [json, setJson] = useState("");
  const [preview, setPreview] = useState<HolidayRow[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [mode, setMode] = useState<"add" | "update">("add");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setJson(text);
      parseJson(text);
    };
    reader.readAsText(file);
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
      setResult(data.result);
    } catch {
      setResult({ inserted: 0, updated: 0, skipped: 0, errors: ["Request gagal"] });
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-lg">
      {/* Upload area */}
      <div
        onClick={() => fileRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-hairline bg-surface-soft py-xl transition-colors hover:border-brand-accent/40"
      >
        <FileJson className="h-8 w-8 text-muted" />
        <p className="text-body-sm font-medium text-ink">Upload file JSON</p>
        <p className="text-caption text-muted">atau paste langsung di bawah</p>
        <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFile} />
      </div>

      {/* Textarea */}
      <div>
        <label className="mb-1 block text-caption font-medium text-ink">JSON</label>
        <textarea
          rows={8}
          value={json}
          onChange={(e) => { setJson(e.target.value); parseJson(e.target.value); }}
          placeholder='[{"date":"2026-01-01","name":"Tahun Baru Masehi","type":"national"}]'
          className="w-full resize-y rounded-lg border border-hairline bg-surface-soft px-3 py-2 font-mono text-[12px] text-ink outline-none focus:border-brand-accent"
        />
        {parseError && (
          <p className="mt-1 flex items-center gap-1 text-caption text-error">
            <AlertCircle className="h-3 w-3" /> {parseError}
          </p>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div>
          <p className="mb-2 text-caption font-medium text-ink">Preview (10 baris pertama)</p>
          <div className="overflow-x-auto rounded-lg border border-hairline">
            <table className="w-full text-left text-caption">
              <thead className="bg-surface-soft">
                <tr>
                  {["date", "name", "type", "description", "regionCode"].map((h) => (
                    <th key={h} className="px-3 py-2 font-semibold text-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i} className="border-t border-hairline">
                    <td className="px-3 py-2 font-mono">{row.date}</td>
                    <td className="px-3 py-2">{row.name}</td>
                    <td className="px-3 py-2">{row.type}</td>
                    <td className="px-3 py-2 text-muted">{row.description ?? "-"}</td>
                    <td className="px-3 py-2 text-muted">{row.regionCode ?? "-"}</td>
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
            <label className="mb-1 block text-caption font-medium text-ink">Mode</label>
            <div className="flex gap-2">
              {(["add", "update"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-lg border px-3 py-1.5 text-caption font-medium transition-colors ${
                    mode === m
                      ? "border-brand-accent bg-brand-accent/10 text-brand-accent"
                      : "border-hairline text-muted hover:text-ink"
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
            className="ml-auto flex items-center gap-2 rounded-lg bg-brand-accent px-md py-sm text-body-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {loading ? "Mengimport..." : "Import"}
          </button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div className={`rounded-xl border p-md ${result.errors.length ? "border-error/30 bg-error/5" : "border-success/30 bg-success/5"}`}>
          <div className="flex items-center gap-2 mb-2">
            {result.errors.length ? (
              <AlertCircle className="h-5 w-5 text-error" />
            ) : (
              <CheckCircle className="h-5 w-5 text-success" />
            )}
            <span className="font-medium text-ink">Import selesai</span>
          </div>
          <p className="text-body-sm text-muted">
            Inserted: {result.inserted} · Updated: {result.updated} · Skipped: {result.skipped}
          </p>
          {result.errors.length > 0 && (
            <ul className="mt-2 flex flex-col gap-1">
              {result.errors.map((e, i) => (
                <li key={i} className="text-caption text-error">{e}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
