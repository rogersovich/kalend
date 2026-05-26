"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Copy, Trash2, Key, Check } from "lucide-react";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  tier: string;
  rateLimit: number;
  isActive: boolean;
  lastUsedAt: string | null;
  createdAt: string;
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/api-keys");
    const json = await res.json();
    setKeys(json.data ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    const res = await fetch("/api/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    if (res.ok) {
      await fetchKeys();
      setNewName("");
      setShowForm(false);
    }
    setCreating(false);
  }

  async function handleRevoke(id: string) {
    if (!confirm("Revoke API key ini?")) return;
    await fetch(`/api/api-keys/${id}`, { method: "DELETE" });
    await fetchKeys();
  }

  async function handleCopy(key: string, id: string) {
    await navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div>
      <div className="mb-lg flex items-center justify-between">
        <div>
          <h1 className="font-display text-title-md font-semibold text-ink">API Keys</h1>
          <p className="text-body-sm text-muted">Limit: 100 request/hari per key (Free tier)</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-xs rounded-lg bg-brand-accent px-md py-sm text-body-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Generate Key
        </button>
      </div>

      {showForm && (
        <div className="mb-lg rounded-xl border border-hairline bg-canvas p-lg">
          <h2 className="mb-md font-display text-title-sm font-semibold text-ink">API Key Baru</h2>
          <form onSubmit={handleCreate} className="flex gap-3">
            <input
              type="text"
              required
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nama key (contoh: Production App)"
              className="flex-1 rounded-lg border border-hairline bg-surface-soft px-3 py-2 text-body-sm text-ink outline-none placeholder:text-muted focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30"
            />
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-brand-accent px-md py-sm text-body-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {creating ? "Membuat..." : "Buat"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setNewName(""); }}
              className="rounded-lg border border-hairline px-md py-sm text-body-sm font-medium text-muted hover:text-ink"
            >
              Batal
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="text-body-sm text-muted">Memuat...</p>
      ) : keys.length === 0 ? (
        <div className="rounded-xl border border-hairline bg-canvas py-xl text-center">
          <Key className="mx-auto mb-3 h-10 w-10 text-muted/40" />
          <p className="text-body-md text-muted">Belum ada API key.</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-3 text-caption text-brand-accent hover:underline"
          >
            Generate key pertama
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-xs">
          {keys.map((k) => (
            <div
              key={k.id}
              className="rounded-xl border border-hairline bg-canvas p-md"
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ink">{k.name}</span>
                  <span className="rounded-full bg-surface-soft px-2 py-0.5 text-[10px] font-medium uppercase text-muted">
                    {k.tier}
                  </span>
                  {!k.isActive && (
                    <span className="rounded-full bg-error/10 px-2 py-0.5 text-[10px] font-medium text-error">
                      Revoked
                    </span>
                  )}
                </div>
                {k.isActive && (
                  <button
                    onClick={() => handleRevoke(k.id)}
                    className="rounded-md p-1 text-muted transition-colors hover:text-error"
                    title="Revoke"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded-md bg-surface-soft px-3 py-1.5 font-mono text-[12px] text-ink">
                  {k.key}
                </code>
                <button
                  onClick={() => handleCopy(k.key, k.id)}
                  className="shrink-0 rounded-md border border-hairline px-2 py-1.5 text-muted transition-colors hover:text-ink"
                  title="Copy"
                >
                  {copiedId === k.id ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <p className="mt-2 text-caption text-muted">
                Limit: {k.rateLimit} req/hari ·{" "}
                {k.lastUsedAt
                  ? `Terakhir dipakai: ${new Date(k.lastUsedAt).toLocaleDateString("id-ID")}`
                  : "Belum pernah dipakai"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Docs reference */}
      <div className="mt-lg rounded-xl border border-hairline bg-surface-soft p-md">
        <p className="text-caption text-muted">
          Sertakan key di header request:{" "}
          <code className="rounded bg-canvas px-1 py-0.5 font-mono text-[11px]">
            Authorization: Bearer &lt;your-api-key&gt;
          </code>
        </p>
      </div>
    </div>
  );
}
