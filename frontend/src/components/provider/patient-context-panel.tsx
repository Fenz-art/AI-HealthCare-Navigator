"use client"

import { cn } from "@/lib/utils"

const MOCK_PATIENT = {
  firstName: "Alex",
  lastName: "Burke",
  bloodGroup: "O+",
  conditions: ["Hypertension", "Type 2 Diabetes"],
  medications: ["Metformin 500mg", "Lisinopril 10mg"],
  allergies: ["Penicillin", "Sulfa"],
  vaccinations: ["COVID-19", "Influenza", "Hepatitis B"],
  insurance: { provider: "Blue Cross Blue Shield", status: "Active" },
  languages: ["English", "Spanish"],
  emergencyContact: { name: "Jamie Burke", phone: "(555) 123-4567" },
}

function getInitials(first: string, last: string) {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase()
}

interface PatientContextPanelProps {
  patientId: string | null
  patientName?: string
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[11px]" style={{ color: "var(--ink-subtle)" }}>{label}</span>
      <span className="text-[11px] font-medium" style={{ color: "var(--ink-muted)" }}>{value}</span>
    </div>
  )
}

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn("rounded-xl p-3.5 space-y-3", className)}
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--hairline)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
      {children}
    </p>
  )
}

function PillList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-md px-2 py-1 text-[11px] font-medium"
          style={{ background: "var(--surface-1)", color: "var(--ink-muted)", border: "1px solid var(--hairline)" }}
        >
          {item}
        </span>
      ))}
    </div>
  )
}

export function PatientContextPanel({ patientId, patientName }: PatientContextPanelProps) {
  if (!patientId) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-center text-[13px]" style={{ color: "var(--ink-tertiary)" }}>
          Select a conversation to view patient context
        </p>
      </div>
    )
  }

  const patient = MOCK_PATIENT
  const initials = patientName
    ? patientName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : getInitials(patient.firstName, patient.lastName)

  return (
    <div className="space-y-4 p-4">
      <SectionCard>
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold"
            style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}
          >
            {initials}
          </div>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: "var(--ink)" }}>
              {patientName || `${patient.firstName} ${patient.lastName}`}
            </p>
            <p className="text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
              {patient.bloodGroup}
            </p>
          </div>
        </div>
      </SectionCard>

      <div>
        <SectionTitle>Blood Type</SectionTitle>
        <div className="mt-2">
          <span
            className="inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold"
            style={{ background: "var(--lavender-muted)", color: "var(--lavender-hover)", border: "1px solid rgba(94,106,210,0.18)" }}
          >
            {patient.bloodGroup}
          </span>
        </div>
      </div>

      <div>
        <SectionTitle>Conditions</SectionTitle>
        <div className="mt-2">
          <PillList items={patient.conditions} />
        </div>
      </div>

      <div>
        <SectionTitle>Medications</SectionTitle>
        <div className="mt-2">
          <PillList items={patient.medications} />
        </div>
      </div>

      <div>
        <SectionTitle>Allergies</SectionTitle>
        <div className="mt-2">
          <PillList items={patient.allergies} />
        </div>
      </div>

      <div>
        <SectionTitle>Vaccinations</SectionTitle>
        <div className="mt-2">
          <PillList items={patient.vaccinations} />
        </div>
      </div>

      <SectionCard className="!space-y-2">
        <InfoRow label="Provider" value={patient.insurance.provider} />
        <InfoRow label="Status" value={patient.insurance.status} />
      </SectionCard>

      <SectionCard className="!space-y-2">
        <InfoRow label="Primary" value={patient.languages[0]} />
        {patient.languages.length > 1 && (
          <InfoRow label="Secondary" value={patient.languages[1]} />
        )}
      </SectionCard>

      <div>
        <SectionTitle>Emergency Contact</SectionTitle>
        <SectionCard className="!space-y-2 mt-2">
          <InfoRow label="Name" value={patient.emergencyContact.name} />
          <InfoRow label="Phone" value={patient.emergencyContact.phone} />
        </SectionCard>
      </div>
    </div>
  )
}
