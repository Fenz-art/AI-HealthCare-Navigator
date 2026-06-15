"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Bell,
  MessageCircle,
  Pill,
  Shield,
  Search,
  IdCard,
  Clock3,
  MapPin,
  Users,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  X,
} from "lucide-react";
import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { MedicationReference } from "@/lib/types";

export function PharmacistDashboard() {
  const { locale } = useParams() as { locale: string };

  const [eqQuery, setEqQuery] = useState("");
  const [eqCountry, setEqCountry] = useState("");
  const [eqResults, setEqResults] = useState<MedicationReference[]>([]);
  const [eqSearching, setEqSearching] = useState(false);
  const [eqError, setEqError] = useState<string | null>(null);

  const handleEquivalenceSearch = useCallback(async () => {
    if (!eqQuery.trim()) return;
    setEqSearching(true);
    setEqError(null);
    try {
      const results = await api.findMedicationEquivalents(eqQuery.trim(), eqCountry.trim() || undefined);
      setEqResults(results);
      if (results.length === 0) {
        setEqError(`No equivalents found for "${eqQuery}"${eqCountry ? ` in ${eqCountry}` : ""}`);
      }
    } catch (err) {
      setEqError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setEqSearching(false);
    }
  }, [eqQuery, eqCountry]);

  const stats = [
    { label: "Shared Passports", value: "24", icon: IdCard, color: "var(--lavender)" },
    { label: "Medication Requests", value: "13", icon: Pill, color: "var(--semantic-blue)" },
    { label: "Active Conversations", value: "8", icon: MessageCircle, color: "var(--semantic-success)" },
    { label: "Recent Searches", value: "47", icon: Search, color: "var(--semantic-warning)" },
  ];

  const medicationRequests = [
    { patient: "Alex Burke", medication: "Lisinopril 10mg", status: "Pending" as const },
    { patient: "Sarah Chen", medication: "Metformin 500mg", status: "In Progress" as const },
    { patient: "Marco Rossi", medication: "Amoxicillin 250mg", status: "Resolved" as const },
    { patient: "Yuki Tanaka", medication: "Atorvastatin 20mg", status: "Pending" as const },
    { patient: "Maria Santos", medication: "Omeprazole 20mg", status: "In Progress" as const },
  ];

  const sharedPassports = [
    { patient: "Alex Burke", date: "Today", type: "Full Access" },
    { patient: "Sarah Chen", date: "Yesterday", type: "Medication Only" },
    { patient: "Kenji Watanabe", date: "2 days ago", type: "Full Access" },
    { patient: "Maria Santos", date: "3 days ago", type: "Limited" },
  ];

  const recentSearches = [
    { medication: "Lisinopril", traveler: "Alex Burke", country: "Japan", equivalent: "Prinivil" },
    { medication: "Metformin", traveler: "Sarah Chen", country: "Thailand", equivalent: "Glucophage" },
    { medication: "Amoxicillin", traveler: "Marco Rossi", country: "Germany", equivalent: "Amoxil" },
    { medication: "Atorvastatin", traveler: "Yuki Tanaka", country: "Japan", equivalent: "Lipitor" },
  ];

  const travelerConversations = [
    { name: "Alex Burke", topic: "Prescription refill · Lisinopril", time: "2m ago" },
    { name: "Sarah Chen", topic: "Local equivalent check", time: "15m ago" },
    { name: "Marco Rossi", topic: "Dosage adjustment inquiry", time: "1h ago" },
    { name: "Yuki Tanaka", topic: "Medication interaction concern", time: "3h ago" },
  ];

  const statusStyles: Record<string, { bg: string; color: string }> = {
    Pending: { bg: "rgba(255,183,77,0.1)", color: "var(--semantic-warning)" },
    "In Progress": { bg: "rgba(94,106,210,0.1)", color: "var(--lavender-hover)" },
    Resolved: { bg: "rgba(39,166,68,0.1)", color: "var(--semantic-success)" },
  };

  const statusIcons = {
    Pending: AlertCircle,
    "In Progress": Loader2,
    Resolved: CheckCircle2,
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium" style={{ background: "var(--lavender-muted)", color: "var(--lavender-hover)", border: "1px solid rgba(94,106,210,0.15)" }}>
                <MapPin className="size-3" /> Tokyo, JP
              </span>
              <span className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>·</span>
              <span className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>19:04 JST</span>
            </div>
            <h1 className="mt-3 text-[30px] font-semibold tracking-tight" style={{ color: "var(--ink)", letterSpacing: "-0.6px" }}>Pharmacy Overview</h1>
            <p className="mt-1.5 text-[13px]" style={{ color: "var(--ink-subtle)" }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-[var(--surface-2)]"
            style={{ border: "1px solid var(--hairline)" }}>
            <Bell className="size-4" style={{ color: "var(--ink-subtle)" }} />
            <span className="absolute right-2 top-2 h-[6px] w-[6px] rounded-full" style={{ background: "var(--lavender)" }} />
          </motion.button>
        </div>
      </motion.div>

      <motion.div initial="hidden" animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } } }}>
              <div className="relative overflow-hidden rounded-xl border p-5" style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}>
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-lg" style={{ background: `color-mix(in srgb, ${stat.color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${stat.color} 20%, transparent)` }}>
                    <Icon className="size-5" style={{ color: stat.color }} />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-tertiary)" }}>{stat.label}</p>
                    <p className="mt-0.5 text-[24px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>{stat.value}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <MedicationEquivalenceSearch
        query={eqQuery} setQuery={setEqQuery}
        country={eqCountry} setCountry={setEqCountry}
        results={eqResults} searching={eqSearching}
        error={eqError} onSearch={handleEquivalenceSearch}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center gap-2 mb-3">
            <Pill className="size-4" style={{ color: "var(--ink-tertiary)" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Medication Requests</p>
          </div>
          <div className="divide-y overflow-hidden rounded-xl border" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
            {medicationRequests.map((req) => {
              const StatusIcon = statusIcons[req.status];
              const style = statusStyles[req.status];
              return (
                <div key={req.patient + req.medication} className="flex items-center gap-3 px-4 py-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: "var(--lavender-muted)", color: "var(--lavender-hover)" }}>
                    {req.patient.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>{req.patient}</p>
                    <p className="text-[12px] truncate" style={{ color: "var(--ink-tertiary)" }}>{req.medication}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium shrink-0" style={{ background: style.bg, color: style.color }}>
                    <StatusIcon className="size-3" />
                    {req.status}
                  </span>
                </div>
              );
            })}
            <Link href={`/${locale}/app/medication-requests`} className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]" style={{ color: "var(--ink-tertiary)" }}>
              View all requests <ArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="size-4" style={{ color: "var(--ink-tertiary)" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Shared Passports</p>
          </div>
          <div className="divide-y overflow-hidden rounded-xl border" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
            {sharedPassports.map((sp) => (
              <div key={sp.patient} className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--lavender-muted)" }}>
                  <IdCard className="size-4" style={{ color: "var(--lavender)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>{sp.patient}</p>
                  <p className="text-[12px] truncate" style={{ color: "var(--ink-tertiary)" }}>Shared {sp.date}</p>
                </div>
                <span className="shrink-0 text-[11px] font-medium" style={{ color: sp.type === "Full Access" ? "var(--semantic-success)" : sp.type === "Limited" ? "var(--semantic-warning)" : "var(--ink-tertiary)" }}>
                  {sp.type}
                </span>
              </div>
            ))}
            <Link href={`/${locale}/app/passports`} className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]" style={{ color: "var(--ink-tertiary)" }}>
              View all passports <ArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center gap-2 mb-3">
            <Search className="size-4" style={{ color: "var(--ink-tertiary)" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Recent Searches</p>
          </div>
          <div className="divide-y overflow-hidden rounded-xl border" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
            {recentSearches.map((s) => (
              <div key={s.medication + s.traveler} className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg" style={{ background: "var(--lavender-muted)" }}>
                  <Globe className="size-4" style={{ color: "var(--lavender)" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>{s.medication}</p>
                  <p className="text-[12px] truncate" style={{ color: "var(--ink-tertiary)" }}>{s.traveler} · {s.country}</p>
                </div>
                <span className="shrink-0 text-[11px] font-medium" style={{ color: "var(--semantic-success)" }}>{s.equivalent}</span>
              </div>
            ))}
            <Link href={`/${locale}/app/searches`} className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]" style={{ color: "var(--ink-tertiary)" }}>
              View all searches <ArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="size-4" style={{ color: "var(--ink-tertiary)" }} />
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>Traveler Conversations</p>
          </div>
          <div className="divide-y overflow-hidden rounded-xl border" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
            {travelerConversations.map((conv) => (
              <div key={conv.name} className="flex items-center gap-3 px-4 py-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold" style={{ background: "var(--lavender-muted)", color: "var(--lavender-hover)" }}>
                  {conv.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>{conv.name}</p>
                  <p className="text-[12px] truncate" style={{ color: "var(--ink-tertiary)" }}>{conv.topic}</p>
                </div>
                <span className="shrink-0 text-[11px]" style={{ color: "var(--ink-tertiary)" }}>{conv.time}</span>
              </div>
            ))}
            <Link href={`/${locale}/app/conversations`} className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-[12px] transition-colors hover:bg-[var(--surface-2)]" style={{ color: "var(--ink-tertiary)" }}>
              View all conversations <ArrowRight className="size-3" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function MedicationEquivalenceSearch({
  query, setQuery, country, setCountry, results, searching, error, onSearch,
}: {
  query: string; setQuery: (v: string) => void;
  country: string; setCountry: (v: string) => void;
  results: MedicationReference[]; searching: boolean;
  error: string | null; onSearch: () => void;
}) {
  const countries = ["US", "JP", "TH", "BR", "DE", "TR", "ID", "VN", "GB", "FR", "IT", "EU"];

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border p-5" style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}>
      <div className="flex items-center gap-2 mb-4">
        <Globe className="size-4" style={{ color: "var(--lavender)" }} />
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
          Medication Equivalence Search
        </p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            placeholder="Ingredient name (e.g. Paracetamol, Ibuprofen)..."
            className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none"
            style={{ borderColor: "var(--hairline)", background: "var(--surface-2)", color: "var(--ink)" }} />
        </div>
        <select value={country} onChange={(e) => setCountry(e.target.value)}
          className="rounded-lg border px-3 py-2 text-[13px] outline-none"
          style={{ borderColor: "var(--hairline)", background: "var(--surface-2)", color: "var(--ink)" }}>
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button onClick={onSearch} disabled={searching || !query.trim()}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium disabled:opacity-50"
          style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}>
          {searching ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
          Search
        </button>
      </div>

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="mt-4 space-y-2 overflow-hidden">
            <p className="text-[11px] font-medium" style={{ color: "var(--ink-subtle)" }}>
              {results.length} equivalent{results.length !== 1 ? "s" : ""} found
            </p>
            {results.map((ref) => (
              <motion.div key={`${ref.sourceType}-${ref.sourceId}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between rounded-lg px-3 py-2" style={{ background: "var(--surface-2)" }}>
                <div>
                  <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>{ref.brandName}</p>
                  <p className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
                    {ref.ingredient}{ref.strength ? ` · ${ref.strength}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--surface-3)", color: "var(--ink-tertiary)" }}>
                    {ref.country}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: "var(--surface-3)", color: "var(--ink-tertiary)" }}>
                    {ref.sourceType}
                  </span>
                  {ref.otc !== null && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: ref.otc ? "rgba(39,166,68,0.1)" : "rgba(255,183,77,0.1)", color: ref.otc ? "var(--semantic-success)" : "var(--semantic-warning)" }}>
                      {ref.otc ? "OTC" : "Rx"}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 flex items-center gap-1.5 text-[12px]" style={{ color: "var(--semantic-red)" }}>
          <AlertCircle className="size-3.5" />
          {error}
        </motion.div>
      )}
    </motion.div>
  );
}
