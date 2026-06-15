"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import {
  Shield,
  FileText,
  Stethoscope,
  Search,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Pill,
  Activity,
  Syringe,
  UserRound,
} from "lucide-react"
import { cn } from "@/lib/utils"

type Role = "DOCTOR" | "PHARMACIST" | "MEDICAL_ASSISTANT"

interface SharedRecordsProps {
  role?: Role
}

type TabId = "passports" | "documents" | "summaries"

interface Tab {
  id: TabId
  label: string
  icon: typeof Shield
}

const TABS: Tab[] = [
  { id: "passports", label: "Passports Shared With Me", icon: Shield },
  { id: "documents", label: "Documents Shared With Me", icon: FileText },
  { id: "summaries", label: "Summaries Shared With Me", icon: Stethoscope },
]

/* ── Mock Data ── */

interface SharedPassport {
  id: string
  patientName: string
  shareDate: Date
  type: string
  expiry: Date
}

interface SharedDocument {
  id: string
  title: string
  patientName: string
  type: string
  sharedDate: Date
}

interface SharedSummary {
  id: string
  patientName: string
  summaryType: string
  dateGenerated: Date
}

const NOW = new Date()

function daysAgo(n: number): Date {
  const d = new Date(NOW)
  d.setDate(d.getDate() - n)
  return d
}

function hoursAgo(n: number): Date {
  const d = new Date(NOW)
  d.setHours(d.getHours() - n)
  return d
}

const MOCK_PASSPORTS: SharedPassport[] = [
  { id: "p1", patientName: "Alex Burke", shareDate: hoursAgo(2), type: "Full Access", expiry: daysAgo(-85) },
  { id: "p2", patientName: "Sarah Chen", shareDate: daysAgo(1), type: "Medication Only", expiry: daysAgo(-30) },
  { id: "p3", patientName: "Marco Rossi", shareDate: daysAgo(3), type: "Full Access", expiry: daysAgo(-180) },
  { id: "p4", patientName: "Yuki Tanaka", shareDate: daysAgo(5), type: "Limited", expiry: daysAgo(-14) },
  { id: "p5", patientName: "Maria Santos", shareDate: daysAgo(7), type: "Full Access", expiry: daysAgo(-365) },
  { id: "p6", patientName: "Kenji Watanabe", shareDate: daysAgo(10), type: "Medication Only", expiry: daysAgo(-21) },
]

const MOCK_DOCUMENTS: SharedDocument[] = [
  { id: "d1", title: "Lab Results - Complete Blood Count", patientName: "Alex Burke", type: "Lab Report", sharedDate: hoursAgo(5) },
  { id: "d2", title: "Discharge Summary - St. Luke's Hospital", patientName: "Sarah Chen", type: "Discharge Note", sharedDate: daysAgo(1) },
  { id: "d3", title: "Prescription Renewal Request", patientName: "Marco Rossi", type: "Prescription", sharedDate: daysAgo(2) },
  { id: "d4", title: "MRI Scan Report - Lumbar Spine", patientName: "Yuki Tanaka", type: "Imaging Report", sharedDate: daysAgo(4) },
  { id: "d5", title: "Allergy Assessment Form", patientName: "Maria Santos", type: "Assessment", sharedDate: daysAgo(6) },
  { id: "d6", title: "Vaccination Record - COVID-19 Booster", patientName: "Kenji Watanabe", type: "Immunization Record", sharedDate: daysAgo(8) },
]

const MOCK_SUMMARIES: SharedSummary[] = [
  { id: "s1", patientName: "Alex Burke", summaryType: "Medication Review", dateGenerated: hoursAgo(3) },
  { id: "s2", patientName: "Sarah Chen", summaryType: "Clinical Summary", dateGenerated: daysAgo(1) },
  { id: "s3", patientName: "Marco Rossi", summaryType: "Travel Health Advisory", dateGenerated: daysAgo(2) },
  { id: "s4", patientName: "Yuki Tanaka", summaryType: "Condition Timeline", dateGenerated: daysAgo(5) },
  { id: "s5", patientName: "Maria Santos", summaryType: "Medication Review", dateGenerated: daysAgo(7) },
  { id: "s6", patientName: "Kenji Watanabe", summaryType: "Vaccination History", dateGenerated: daysAgo(9) },
]

/* ── Helpers ── */

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function timeAgo(date: Date): string {
  const diff = NOW.getTime() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

/* ── Sub-components ── */

function InitialsAvatar({ name, size = "sm" }: { name: string; size?: "sm" | "md" }) {
  const dim = size === "md" ? "size-9 text-[12px]" : "size-8 text-[11px]"
  return (
    <div
      className={cn("flex shrink-0 items-center justify-center rounded-full font-bold", dim)}
      style={{ background: "var(--lavender-muted)", color: "var(--lavender-hover)" }}
    >
      {getInitials(name)}
    </div>
  )
}

function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div
      className="flex items-center gap-2 rounded-xl border px-3.5 py-2.5 transition-colors focus-within:border-[var(--lavender)]"
      style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}
    >
      <Search className="size-4 shrink-0" style={{ color: "var(--ink-tertiary)" }} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by patient name..."
        className="w-full bg-transparent text-[13px] outline-none placeholder:text-[var(--ink-muted)]"
        style={{ color: "var(--ink)" }}
      />
    </div>
  )
}

function StatusBadge({ label, variant }: { label: string; variant: "active" | "warning" | "neutral" }) {
  const styles = {
    active: { bg: "color-mix(in srgb, var(--semantic-success) 12%, transparent)", color: "var(--semantic-success)", border: "1px solid color-mix(in srgb, var(--semantic-success) 20%, transparent)" },
    warning: { bg: "color-mix(in srgb, var(--semantic-warning) 12%, transparent)", color: "var(--semantic-warning)", border: "1px solid color-mix(in srgb, var(--semantic-warning) 20%, transparent)" },
    neutral: { bg: "color-mix(in srgb, var(--ink-tertiary) 10%, transparent)", color: "var(--ink-tertiary)", border: "1px solid color-mix(in srgb, var(--ink-tertiary) 15%, transparent)" },
  }
  const s = styles[variant]
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap"
      style={{ background: s.bg, color: s.color, border: s.border }}
    >
      {variant === "active" && <CheckCircle2 className="size-3" />}
      {variant === "warning" && <AlertCircle className="size-3" />}
      {label}
    </span>
  )
}

function TypeBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-md px-2 py-0.5 text-[10px] font-medium whitespace-nowrap"
      style={{
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        color,
        border: `1px solid color-mix(in srgb, ${color} 20%, transparent)`,
      }}
    >
      {label}
    </span>
  )
}

/* ── Tab Panels ── */

function PassportsTab({ passports, search }: { passports: SharedPassport[]; search: string }) {
  const filtered = useMemo(
    () => passports.filter((p) => p.patientName.toLowerCase().includes(search.toLowerCase())),
    [passports, search],
  )

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
      className="space-y-2"
    >
      {filtered.map((item) => (
        <motion.div
          key={item.id}
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } } }}
        >
          <div
            className="flex items-center gap-3 rounded-xl border px-4 py-3.5"
            style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}
          >
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: "color-mix(in srgb, var(--lavender) 12%, transparent)",
                border: "1px solid color-mix(in srgb, var(--lavender) 20%, transparent)",
              }}
            >
              <Shield className="size-4" style={{ color: "var(--lavender)" }} />
            </div>
            <InitialsAvatar name={item.patientName} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>
                {item.patientName}
              </p>
              <div className="mt-0.5 flex items-center gap-3 text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {timeAgo(item.shareDate)}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  Expires {formatDate(item.expiry)}
                </span>
              </div>
            </div>
            <StatusBadge
              label={item.type}
              variant={item.type === "Full Access" ? "active" : item.type === "Limited" ? "warning" : "neutral"}
            />
          </div>
        </motion.div>
      ))}
      {filtered.length === 0 && (
        <EmptyState message="No matching passports found." />
      )}
    </motion.div>
  )
}

function DocumentsTab({ documents, search }: { documents: SharedDocument[]; search: string }) {
  const filtered = useMemo(
    () => documents.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()) || d.patientName.toLowerCase().includes(search.toLowerCase())),
    [documents, search],
  )

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
      className="space-y-2"
    >
      {filtered.map((item) => (
        <motion.div
          key={item.id}
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } } }}
        >
          <div
            className="flex items-center gap-3 rounded-xl border px-4 py-3.5"
            style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}
          >
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: "color-mix(in srgb, var(--semantic-blue) 12%, transparent)",
                border: "1px solid color-mix(in srgb, var(--semantic-blue) 20%, transparent)",
              }}
            >
              <FileText className="size-4" style={{ color: "var(--semantic-blue)" }} />
            </div>
            <InitialsAvatar name={item.patientName} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>
                {item.title}
              </p>
              <div className="mt-0.5 flex items-center gap-3 text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
                <span>{item.patientName}</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {timeAgo(item.sharedDate)}
                </span>
              </div>
            </div>
            <TypeBadge label={item.type} color="var(--semantic-blue)" />
          </div>
        </motion.div>
      ))}
      {filtered.length === 0 && (
        <EmptyState message="No matching documents found." />
      )}
    </motion.div>
  )
}

function SummariesTab({ summaries, search }: { summaries: SharedSummary[]; search: string }) {
  const filtered = useMemo(
    () => summaries.filter((s) => s.patientName.toLowerCase().includes(search.toLowerCase()) || s.summaryType.toLowerCase().includes(search.toLowerCase())),
    [summaries, search],
  )

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }}
      className="space-y-2"
    >
      {filtered.map((item) => (
        <motion.div
          key={item.id}
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } } }}
        >
          <div
            className="flex items-center gap-3 rounded-xl border px-4 py-3.5"
            style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}
          >
            <div
              className="flex size-9 shrink-0 items-center justify-center rounded-lg"
              style={{
                background: "color-mix(in srgb, var(--semantic-success) 12%, transparent)",
                border: "1px solid color-mix(in srgb, var(--semantic-success) 20%, transparent)",
              }}
            >
              <Stethoscope className="size-4" style={{ color: "var(--semantic-success)" }} />
            </div>
            <InitialsAvatar name={item.patientName} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-medium truncate" style={{ color: "var(--ink)" }}>
                {item.patientName}
              </p>
              <div className="mt-0.5 flex items-center gap-3 text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {timeAgo(item.dateGenerated)}
                </span>
              </div>
            </div>
            <TypeBadge label={item.summaryType} color="var(--semantic-success)" />
          </div>
        </motion.div>
      ))}
      {filtered.length === 0 && (
        <EmptyState message="No matching summaries found." />
      )}
    </motion.div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <UserRound className="size-8" style={{ color: "var(--ink-tertiary)" }} />
      <p className="mt-3 text-[13px]" style={{ color: "var(--ink-muted)" }}>
        {message}
      </p>
    </div>
  )
}

/* ── Main Component ── */

export function SharedRecords({ role }: SharedRecordsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("passports")
  const [search, setSearch] = useState("")

  const roleLabel = role
    ? role === "DOCTOR"
      ? "Doctor"
      : role === "PHARMACIST"
        ? "Pharmacist"
        : "Medical Assistant"
    : "Provider"

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-[20px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
          Shared Records
        </h2>
        <p className="mt-1 text-[13px]" style={{ color: "var(--ink-tertiary)" }}>
          Records shared with you as a {roleLabel}
        </p>
      </div>

      {/* Search */}
      <SearchBar value={search} onChange={setSearch} />

      {/* Tab Bar */}
      <div
        className="flex rounded-xl border p-1"
        style={{ background: "var(--surface-1)", borderColor: "var(--hairline)" }}
      >
        {TABS.map((tab) => {
          const TabIcon = tab.icon
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="relative flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors duration-150"
              style={{ color: active ? "var(--ink)" : "var(--ink-tertiary)" }}
            >
              <TabIcon className="size-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">
                {tab.id === "passports" ? "Passports" : tab.id === "documents" ? "Documents" : "Summaries"}
              </span>
              {active && (
                <motion.div
                  layoutId="sharedRecordsTabGlow"
                  className="absolute inset-0 rounded-lg -z-10"
                  style={{ background: "var(--lavender-muted)" }}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "passports" && <PassportsTab passports={MOCK_PASSPORTS} search={search} />}
        {activeTab === "documents" && <DocumentsTab documents={MOCK_DOCUMENTS} search={search} />}
        {activeTab === "summaries" && <SummariesTab summaries={MOCK_SUMMARIES} search={search} />}
      </div>
    </div>
  )
}
