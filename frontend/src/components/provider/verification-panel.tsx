"use client"

import { motion } from "framer-motion"
import {
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Building2,
  Stethoscope,
  Pill,
  ShieldCheck,
} from "lucide-react"

type StatusType = "SUBMITTED" | "VERIFIED" | "PENDING" | "REJECTED"

interface Requirement {
  id: string
  label: string
  description: string
  icon: typeof FileText
  status: StatusType
  documentName?: string
}

interface VerificationPanelProps {
  role?: "DOCTOR" | "PHARMACIST" | "MEDICAL_ASSISTANT"
}

const STATUS_CONFIG: Record<StatusType, { color: string; bg: string; border: string; label: string }> = {
  VERIFIED: {
    color: "var(--semantic-success)",
    bg: "color-mix(in srgb, var(--semantic-success) 12%, transparent)",
    border: "color-mix(in srgb, var(--semantic-success) 20%, transparent)",
    label: "Verified",
  },
  PENDING: {
    color: "var(--semantic-warning)",
    bg: "color-mix(in srgb, var(--semantic-warning) 12%, transparent)",
    border: "color-mix(in srgb, var(--semantic-warning) 20%, transparent)",
    label: "Pending",
  },
  SUBMITTED: {
    color: "var(--semantic-blue)",
    bg: "color-mix(in srgb, var(--semantic-blue) 12%, transparent)",
    border: "color-mix(in srgb, var(--semantic-blue) 20%, transparent)",
    label: "Submitted",
  },
  REJECTED: {
    color: "var(--semantic-error)",
    bg: "color-mix(in srgb, var(--semantic-error) 12%, transparent)",
    border: "color-mix(in srgb, var(--semantic-error) 20%, transparent)",
    label: "Rejected",
  },
}

const STATUS_ICONS: Record<StatusType, typeof CheckCircle2> = {
  VERIFIED: CheckCircle2,
  PENDING: Clock,
  SUBMITTED: ShieldCheck,
  REJECTED: AlertCircle,
}

const ROLE_MOCK: Record<string, Requirement[]> = {
  DOCTOR: [
    {
      id: "license",
      label: "License Upload",
      description: "Upload your medical license for verification",
      icon: FileText,
      status: "VERIFIED",
      documentName: "medical_license.pdf",
    },
  ],
  PHARMACIST: [
    {
      id: "pharmacy",
      label: "Pharmacy Verification",
      description: "Verify your pharmacy credentials and documentation",
      icon: Building2,
      status: "PENDING",
    },
  ],
  MEDICAL_ASSISTANT: [
    {
      id: "organization",
      label: "Organization Verification",
      description: "Verify your affiliated healthcare organization",
      icon: Building2,
      status: "SUBMITTED",
      documentName: "affiliation_letter.pdf",
    },
  ],
}

const ROLE_ICONS: Record<string, typeof Stethoscope> = {
  DOCTOR: Stethoscope,
  PHARMACIST: Pill,
  MEDICAL_ASSISTANT: Building2,
}

function StatusBadge({ status }: { status: StatusType }) {
  const config = STATUS_CONFIG[status]
  const Icon = STATUS_ICONS[status]
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium"
      style={{
        background: config.bg,
        color: config.color,
        border: `1px solid ${config.border}`,
      }}
    >
      <Icon className="size-3" />
      {config.label}
    </span>
  )
}

function UploadArea() {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed p-4 transition-colors hover:border-[var(--lavender)]"
      style={{ borderColor: "var(--hairline-strong)", background: "var(--surface-2)" }}
    >
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-lg"
        style={{ background: "var(--lavender-muted)" }}
      >
        <Upload className="size-5" style={{ color: "var(--lavender)" }} />
      </div>
      <div>
        <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>
          Upload document
        </p>
        <p className="mt-0.5 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>
          PDF or image, max 10MB
        </p>
      </div>
    </motion.div>
  )
}

function RequirementCard({ requirement }: { requirement: Requirement }) {
  const Ic = requirement.icon
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border p-5 space-y-4"
      style={{ background: "var(--surface-2)", borderColor: "var(--hairline)" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg"
            style={{
              background: "color-mix(in srgb, var(--lavender) 12%, transparent)",
              border: "1px solid color-mix(in srgb, var(--lavender) 20%, transparent)",
            }}
          >
            <Ic className="size-4" style={{ color: "var(--lavender)" }} />
          </div>
          <div>
            <p className="text-[14px] font-semibold" style={{ color: "var(--ink)" }}>
              {requirement.label}
            </p>
            <p className="mt-0.5 text-[12px]" style={{ color: "var(--ink-subtle)" }}>
              {requirement.description}
            </p>
          </div>
        </div>
        <StatusBadge status={requirement.status} />
      </div>

      {requirement.documentName && (
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-[12px]"
          style={{ background: "var(--surface-1)", border: "1px solid var(--hairline)" }}
        >
          <FileText className="size-3.5 shrink-0" style={{ color: "var(--ink-tertiary)" }} />
          <span style={{ color: "var(--ink-muted)" }}>{requirement.documentName}</span>
        </div>
      )}

      <UploadArea />
    </motion.div>
  )
}

function RoleSpecificFields({ role }: { role: string }) {
  if (role === "PHARMACIST") {
    return (
      <div>
        <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>
          Pharmacy name
        </label>
        <div className="relative">
          <Pill className="absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--ink-tertiary)" }} />
          <input
            defaultValue="Central Wellness Pharmacy"
            placeholder="Enter pharmacy name"
            className="h-11 w-full rounded-lg border bg-transparent pl-10 pr-4 text-[14px] outline-none focus:ring-2"
            style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}
          />
        </div>
      </div>
    )
  }

  if (role === "MEDICAL_ASSISTANT") {
    return (
      <div>
        <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>
          Organization name
        </label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--ink-tertiary)" }} />
          <input
            defaultValue="Bangkok Medical Center"
            placeholder="Enter organization name"
            className="h-11 w-full rounded-lg border bg-transparent pl-10 pr-4 text-[14px] outline-none focus:ring-2"
            style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}
          />
        </div>
      </div>
    )
  }

  return null
}

export function VerificationPanel({ role = "DOCTOR" }: VerificationPanelProps) {
  const requirements = ROLE_MOCK[role] ?? ROLE_MOCK.DOCTOR
  const RoleIcon = ROLE_ICONS[role] ?? Stethoscope
  const verifiedCount = requirements.filter((r) => r.status === "VERIFIED").length
  const progress = Math.round((verifiedCount / requirements.length) * 100)

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div
            className="flex size-9 items-center justify-center rounded-lg"
            style={{
              background: "color-mix(in srgb, var(--lavender) 12%, transparent)",
              border: "1px solid color-mix(in srgb, var(--lavender) 20%, transparent)",
            }}
          >
            <RoleIcon className="size-4" style={{ color: "var(--lavender)" }} />
          </div>
          <div>
            <h2 className="text-[20px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
              Verification
            </h2>
            <p className="mt-0.5 text-[13px]" style={{ color: "var(--ink-tertiary)" }}>
              Complete your {role === "DOCTOR" ? "professional" : role === "PHARMACIST" ? "pharmacy" : "organization"}{" "}
              verification to activate your account
            </p>
          </div>
        </div>
      </div>

      {/* Status overview */}
      <div
        className="rounded-xl border p-5"
        style={{ background: "var(--surface-2)", borderColor: "var(--hairline)" }}
      >
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>
            Verification progress
          </p>
          <p className="text-[12px] tabular-nums" style={{ color: "var(--ink-tertiary)" }}>
            {verifiedCount}/{requirements.length} verified
          </p>
        </div>
        <div className="mt-3 relative flex h-1.5 w-full items-center overflow-hidden rounded-full" style={{ background: "var(--surface-1)" }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full"
            style={{
              background: progress === 100
                ? "var(--semantic-success)"
                : "var(--lavender)",
            }}
          />
        </div>
      </div>

      {/* Role-specific fields */}
      <RoleSpecificFields role={role} />

      {/* Requirement cards */}
      <div className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
          Requirements
        </p>
        {requirements.map((req) => (
          <RequirementCard key={req.id} requirement={req} />
        ))}
      </div>
    </div>
  )
}
