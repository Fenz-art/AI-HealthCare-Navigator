"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Database,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  XCircle,
  Clock,
  Globe,
  Pill,
  Users,
  Activity,
  BarChart3,
  Play,
  FileText,
} from "lucide-react";
import { api } from "@/lib/api";
import type { DataSource, IngestionJob, IngestionStats, AdminStats, MedicationReference } from "@/lib/types";

type Tab = "overview" | "sources" | "jobs" | "medications";

export default function AdminWorkspacePage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [ingestionStats, setIngestionStats] = useState<IngestionStats | null>(null);
  const [sources, setSources] = useState<DataSource[]>([]);
  const [jobs, setJobs] = useState<IngestionJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [adminStats, igStats, igSources, igJobs] = await Promise.all([
        api.getAdminStats(),
        api.getIngestionStats(),
        api.getIngestionSources(),
        api.getIngestionJobs(20),
      ]);
      setStats(adminStats);
      setIngestionStats(igStats);
      setSources(igSources);
      setJobs(igJobs);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (authStatus === "unauthenticated") {
      router.push("/en/login");
      return;
    }
    if (authStatus === "authenticated") {
      loadData();
    }
  }, [authStatus, loadData, router]);

  const handleSync = async (sourceType: string) => {
    setSyncing(sourceType);
    try {
      await api.runIngestion(sourceType);
      setTimeout(() => loadData(), 2000);
    } catch (err) {
      console.error("Sync failed:", err);
    } finally {
      setTimeout(() => setSyncing(null), 3000);
    }
  };

  const handleSyncAll = async () => {
    setSyncing("all");
    try {
      await api.runAllIngestions();
      setTimeout(() => loadData(), 2000);
    } catch (err) {
      console.error("Sync all failed:", err);
    } finally {
      setTimeout(() => setSyncing(null), 3000);
    }
  };

  if (authStatus === "loading" || loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin" style={{ color: "var(--lavender)" }} />
      </div>
    );
  }

  const STATUS_ICONS: Record<string, typeof Clock> = {
    QUEUED: Clock,
    RUNNING: Loader2,
    COMPLETED: CheckCircle2,
    FAILED: XCircle,
  };

  const STATUS_COLORS: Record<string, string> = {
    QUEUED: "var(--ink-tertiary)",
    RUNNING: "var(--lavender)",
    COMPLETED: "var(--semantic-success)",
    FAILED: "var(--semantic-red)",
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--lavender-hover)" }}>
          System Administration
        </p>
        <h1 className="mt-1 text-[26px] font-semibold leading-tight tracking-tight" style={{ color: "var(--ink)" }}>
          Admin Workspace
        </h1>
        <p className="mt-1.5 text-[13px]" style={{ color: "var(--ink-subtle)" }}>
          Data sources, ingestion jobs, and system management.
        </p>
      </div>

      <div className="flex gap-1.5 border-b pb-3" style={{ borderColor: "var(--hairline)" }}>
        {([
          { id: "overview" as Tab, label: "Overview", icon: BarChart3 },
          { id: "sources" as Tab, label: "Data Sources", icon: Database },
          { id: "jobs" as Tab, label: "Sync Jobs", icon: Activity },
          { id: "medications" as Tab, label: "Medications", icon: Pill },
        ]).map((t) => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all"
              style={{
                background: isActive ? "var(--lavender-muted)" : "transparent",
                color: isActive ? "var(--lavender-hover)" : "var(--ink-subtle)",
                border: `1px solid ${isActive ? "rgba(94,106,210,0.2)" : "transparent"}`,
              }}>
              <Icon className="size-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "overview" && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Users", value: stats.users, icon: Users },
              { label: "Sessions", value: stats.sessions, icon: Activity },
              { label: "Tasks", value: stats.tasks, icon: FileText },
              { label: "Brands", value: stats.brands, icon: Pill },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border p-4" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
                  <div className="flex items-center gap-2">
                    <Icon className="size-4" style={{ color: "var(--ink-tertiary)" }} />
                    <span className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>{item.label}</span>
                  </div>
                  <p className="mt-2 text-2xl font-semibold" style={{ color: "var(--ink)" }}>{item.value}</p>
                </motion.div>
              );
            })}
          </div>

          {ingestionStats && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="rounded-xl border p-4" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
                <p className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>Medication References</p>
                <p className="mt-1 text-2xl font-semibold" style={{ color: "var(--ink)" }}>{ingestionStats.totalReferences}</p>
              </div>
              <div className="rounded-xl border p-4" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
                <p className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>Countries Covered</p>
                <p className="mt-1 text-2xl font-semibold" style={{ color: "var(--ink)" }}>{ingestionStats.countriesCovered.length}</p>
                <div className="mt-1 flex flex-wrap gap-1">
                  {ingestionStats.countriesCovered.map((c) => (
                    <span key={c} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--surface-2)", color: "var(--ink-tertiary)" }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border p-4" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
                <p className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>Failed Jobs</p>
                <p className="mt-1 text-2xl font-semibold" style={{ color: ingestionStats.failedJobs > 0 ? "var(--semantic-red)" : "var(--semantic-success)" }}>
                  {ingestionStats.failedJobs}
                </p>
              </div>
            </div>
          )}

          <button onClick={handleSyncAll} disabled={syncing === "all"}
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-medium transition-all disabled:opacity-50"
            style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}>
            {syncing === "all" ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            {syncing === "all" ? "Syncing all sources..." : "Sync All Data Sources"}
          </button>
        </div>
      )}

      {tab === "sources" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[13px]" style={{ color: "var(--ink-subtle)" }}>{sources.length} data sources configured</p>
            <button onClick={handleSyncAll} disabled={syncing === "all"}
              className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12px] font-medium disabled:opacity-50"
              style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}>
              {syncing === "all" ? <Loader2 className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
              Sync All
            </button>
          </div>
          {sources.map((source) => (
            <motion.div key={source.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border p-4" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: "var(--surface-2)" }}>
                    <Database className="size-5" style={{ color: source.active ? "var(--lavender)" : "var(--ink-tertiary)" }} />
                  </div>
                  <div>
                    <p className="text-[14px] font-medium" style={{ color: "var(--ink)" }}>{source.name}</p>
                    <p className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
                      {source.sourceType} · {source.country ?? "Global"} · {source.active ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {source.lastSyncAt && (
                    <span className="text-[10px]" style={{ color: "var(--ink-tertiary)" }}>
                      Synced: {new Date(source.lastSyncAt).toLocaleDateString()}
                    </span>
                  )}
                  <button onClick={() => handleSync(source.sourceType)} disabled={syncing === source.sourceType}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium disabled:opacity-50 transition-all hover:bg-[var(--surface-2)]"
                    style={{ border: "1px solid var(--hairline)", color: "var(--ink-muted)" }}>
                    {syncing === source.sourceType ? <Loader2 className="size-3.5 animate-spin" /> : <Play className="size-3.5" />}
                    {syncing === source.sourceType ? "Syncing..." : "Sync"}
                  </button>
                </div>
              </div>
              {source.jobs && source.jobs.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase" style={{ color: "var(--ink-tertiary)" }}>Recent Jobs</p>
                  {source.jobs.slice(0, 3).map((job) => {
                    const SIcon = STATUS_ICONS[job.status] || Clock;
                    const sColor = STATUS_COLORS[job.status] || "var(--ink-tertiary)";
                    return (
                      <div key={job.id} className="flex items-center justify-between rounded-lg px-3 py-1.5" style={{ background: "var(--surface-2)" }}>
                        <div className="flex items-center gap-2">
                          <SIcon className="size-3" style={{ color: sColor }} />
                          <span className="text-[11px]" style={{ color: "var(--ink-muted)" }}>{job.status}</span>
                          {job.status === "RUNNING" && <span className="text-[10px]" style={{ color: "var(--ink-tertiary)" }}>{job.progress}%</span>}
                        </div>
                        <span className="text-[10px]" style={{ color: "var(--ink-tertiary)" }}>
                          {job.recordsImported > 0 && `${job.recordsImported} imported`}
                          {job.recordsFailed > 0 && ` · ${job.recordsFailed} failed`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {tab === "jobs" && (
        <div className="space-y-3">
          <p className="text-[13px]" style={{ color: "var(--ink-subtle)" }}>{jobs.length} recent sync jobs</p>
          {jobs.map((job) => {
            const SIcon = STATUS_ICONS[job.status] || Clock;
            const sColor = STATUS_COLORS[job.status] || "var(--ink-tertiary)";
            const spinning = job.status === "RUNNING";
            return (
              <motion.div key={job.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border p-4" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SIcon className={`size-4 ${spinning ? "animate-spin" : ""}`} style={{ color: sColor }} />
                    <span className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>
                      {job.sourceType}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{
                      background: `color-mix(in srgb, ${sColor} 15%, transparent)`,
                      color: sColor,
                    }}>
                      {job.status}
                    </span>
                  </div>
                  <span className="text-[10px]" style={{ color: "var(--ink-tertiary)" }}>
                    {new Date(job.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
                  <span>Imported: {job.recordsImported}</span>
                  <span>Failed: {job.recordsFailed}</span>
                  {job.progress > 0 && <span>Progress: {job.progress}%</span>}
                </div>
                {job.status === "RUNNING" && (
                  <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--surface-3)" }}>
                    <motion.div className="h-full rounded-full" style={{ background: "var(--lavender)" }}
                      initial={{ width: 0 }} animate={{ width: `${job.progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }} />
                  </div>
                )}
                {job.status === "FAILED" && job.error && (
                  <div className="mt-2 flex items-center gap-1.5 text-[11px]" style={{ color: "var(--semantic-red)" }}>
                    <AlertTriangle className="size-3" />
                    {job.error}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {tab === "medications" && (
        <MedicationBrowser />
      )}
    </div>
  );
}

function MedicationBrowser() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MedicationReference[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const data = await api.searchMedications(query);
      setResults(data.references);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input value={query} onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search by brand name or ingredient..."
          className="flex-1 rounded-xl border px-4 py-2.5 text-[13px] outline-none"
          style={{ borderColor: "var(--hairline)", background: "var(--surface-1)", color: "var(--ink)" }} />
        <button onClick={handleSearch} disabled={searching || !query.trim()}
          className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-medium disabled:opacity-50"
          style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}>
          {searching ? <Loader2 className="size-4 animate-spin" /> : <Globe className="size-4" />}
          Search
        </button>
      </div>

      <div className="space-y-2">
        {results.map((ref) => (
          <motion.div key={`${ref.sourceType}-${ref.sourceId}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border p-3" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>{ref.brandName}</p>
                <p className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
                  {ref.ingredient}{ref.strength ? ` · ${ref.strength}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--surface-2)", color: "var(--ink-tertiary)" }}>
                  {ref.country}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--surface-2)", color: "var(--ink-tertiary)" }}>
                  {ref.sourceType}
                </span>
              </div>
            </div>
            <div className="mt-1 flex gap-2 text-[10px]" style={{ color: "var(--ink-tertiary)" }}>
              {ref.route && <span>Route: {ref.route}</span>}
              {ref.manufacturer && <span>Mfr: {ref.manufacturer}</span>}
              {ref.otc !== null && <span>{ref.otc ? "OTC" : "Rx"}</span>}
            </div>
          </motion.div>
        ))}
        {query && !searching && results.length === 0 && (
          <p className="text-center text-[13px] py-8" style={{ color: "var(--ink-tertiary)" }}>
            No medications found for "{query}"
          </p>
        )}
      </div>
    </div>
  );
}
