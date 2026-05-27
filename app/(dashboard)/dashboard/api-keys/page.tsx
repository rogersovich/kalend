"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Copy, Trash2, Key, Check } from "lucide-react";
import { toast } from "sonner";

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

const inputCls = "flex-1 rounded-md border border-hairline bg-canvas px-[14px] py-[12px] font-display text-body-sm text-ink placeholder:text-muted outline-none focus-visible:ring-2 focus-visible:ring-ink transition-colors";

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
      toast.success("API key berhasil dibuat");
    } else {
      toast.error("Gagal membuat API key");
    }
    setCreating(false);
  }

  async function handleRevoke(id: string) {
    if (!confirm("Revoke API key ini?")) return;
    const res = await fetch(`/api/api-keys/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("API key direvoke");
    } else {
      toast.error("Gagal merevoke API key");
    }
    await fetchKeys();
  }

  async function handleCopy(key: string, id: string) {
    await navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("API key disalin ke clipboard");
  }

  return (
    <div className="flex flex-col gap-xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-display-sm font-normal text-ink">API Keys</h1>
          <p className="font-mono text-caption text-muted">Limit: 100 request/hari per key (Free tier)</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-xs rounded-pill bg-primary px-lg py-xs font-display text-body-sm font-medium text-white transition-colors hover:bg-primary-active"
        >
          <Plus className="h-4 w-4" />
          Generate Key
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border border-hairline bg-canvas p-lg">
          <h2 className="mb-md font-display text-headline font-medium text-ink">API Key Baru</h2>
          <form onSubmit={handleCreate} className="flex gap-sm">
            <input
              type="text"
              required
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Nama key (contoh: Production App)"
              className={inputCls}
            />
            <button
              type="submit"
              disabled={creating}
              className="rounded-pill bg-primary px-lg py-xs font-display text-button font-medium text-white transition-colors hover:bg-primary-active disabled:opacity-50"
            >
              {creating ? "Membuat..." : "Buat"}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setNewName(""); }}
              className="rounded-pill border border-hairline px-lg py-xs font-display text-button font-medium text-muted hover:text-ink"
            >
              Batal
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p className="font-display text-body-sm text-muted">Memuat...</p>
      ) : keys.length === 0 ? (
        <div className="rounded-lg border border-hairline bg-canvas py-xl text-center">
          <Key className="mx-auto mb-sm h-10 w-10 text-muted/40" />
          <p className="font-display text-body text-muted">Belum ada API key.</p>
          <button onClick={() => setShowForm(true)} className="mt-sm font-display text-body-sm text-ink underline underline-offset-2 hover:opacity-70">
            Generate key pertama
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-xs">
          {keys.map((k) => (
            <div key={k.id} className="rounded-lg border border-hairline bg-canvas p-md">
              <div className="mb-sm flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <span className="font-display font-medium text-ink">{k.name}</span>
                  <span className="rounded-pill bg-surface-soft px-sm py-xxs font-mono text-caption uppercase tracking-widest text-muted">
                    {k.tier}
                  </span>
                  {!k.isActive && (
                    <span className="rounded-pill bg-error/10 px-sm py-xxs font-mono text-caption text-error">
                      Revoked
                    </span>
                  )}
                </div>
                {k.isActive && (
                  <button
                    onClick={() => handleRevoke(k.id)}
                    className="rounded-full p-1 text-muted transition-colors hover:text-error"
                    title="Revoke"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-sm">
                <code className="flex-1 truncate rounded-md bg-surface-soft px-md py-xs font-mono text-caption text-ink">
                  {k.key}
                </code>
                <button
                  onClick={() => handleCopy(k.key, k.id)}
                  className="shrink-0 rounded-md border border-hairline px-sm py-xs text-muted transition-colors hover:text-ink"
                  title="Copy"
                >
                  {copiedId === k.id ? <Check className="h-4 w-4 text-semantic-success" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <p className="mt-sm font-mono text-caption text-muted">
                Limit: {k.rateLimit} req/hari ·{" "}
                {k.lastUsedAt
                  ? `Terakhir dipakai: ${new Date(k.lastUsedAt).toLocaleDateString("id-ID")}`
                  : "Belum pernah dipakai"}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-lg rounded-lg border border-hairline bg-surface-soft p-md">
        <p className="font-mono text-caption text-muted">
          Sertakan key di header request:{" "}
          <code className="rounded-sm bg-canvas px-xs py-xxs font-mono text-caption">
            Authorization: Bearer &lt;your-api-key&gt;
          </code>
        </p>
      </div>
    </div>
  );
}
