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
