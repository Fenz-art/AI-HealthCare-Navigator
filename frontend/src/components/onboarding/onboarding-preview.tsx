"use client";

import { useOnboardingStore } from "@/stores/onboarding-store";
import {
  Shield,
  User,
  Globe,
  Pill,
  AlertTriangle,
  Heart,
  Phone,
  Languages,
  Sparkles,
  Building2,
  Stethoscope,
  HeartPulse,
  GraduationCap,
  FileCheck,
} from "lucide-react";

const roleLabels: Record<string, string> = {
  PATIENT: "Patient",
  MEDICAL_ASSISTANT: "Medical Assistant",
  PHARMACIST: "Pharmacist",
  DOCTOR: "Doctor",
  CLINIC_STAFF: "Clinic Staff",
  HOSPITAL_STAFF: "Hospital Staff",
};

export function OnboardingPreview() {
  const { data } = useOnboardingStore();

  return (
    <div className="flex h-full items-center justify-center p-8">
      <div
        className="w-full max-w-sm overflow-hidden rounded-2xl border"
        style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}
      >
        <div
          className="px-5 py-3"
          style={{ borderBottom: "1px solid var(--hairline)", background: "var(--surface-2)" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 items-center justify-center rounded" style={{ background: "var(--lavender)" }}>
              <span className="text-[9px] font-bold" style={{ color: "var(--inverse-ink)" }}>C</span>
            </div>
            <span className="text-[11px] font-semibold" style={{ color: "var(--ink)" }}>CareCompass</span>
            <span className="ml-auto rounded bg-[var(--semantic-success)]/10 px-1.5 py-0.5 text-[9px] font-medium" style={{ color: "var(--semantic-success)" }}>
              LIVE
            </span>
          </div>
        </div>

        <div className="divide-y px-5 py-4" style={{ borderColor: "var(--hairline)" }}>
          <PreviewRow icon={User} label="Name" value={data.identity.name || "—"} color="var(--lavender)" />
          <PreviewRow icon={Shield} label="Role" value={data.role ? roleLabels[data.role] ?? data.role : "—"} color="var(--lavender)" />

          {data.role === "PATIENT" && (
            <>
              <PreviewRow icon={Globe} label="Destinations" value={data.frequentDestinations.length > 0 ? `${data.frequentDestinations.length} countries` : "—"} color="#3b82f6" />
              <PreviewRow icon={Pill} label="Medications" value={data.medications.length > 0 ? `${data.medications.length} on file` : "—"} color="#8b5cf6" />
              <PreviewRow icon={AlertTriangle} label="Allergies" value={data.allergies.filter((a) => a !== "None").length > 0 ? `${data.allergies.filter((a) => a !== "None").length} recorded` : "—"} color="#ef4444" />
              <PreviewRow icon={Heart} label="Conditions" value={data.conditions.length > 0 ? `${data.conditions.length} on file` : "—"} color="var(--lavender-hover)" />
              <PreviewRow icon={Phone} label="Emergency" value={data.emergencyContacts[0]?.name || "—"} color="var(--ink-muted)" />
              <PreviewRow icon={Languages} label="Interpreter" value={data.voiceInterpreterEnabled ? "Ready" : "—"} color="#27a644" />
            </>
          )}

          {data.role === "PHARMACIST" && (
            <>
              <PreviewRow icon={Building2} label="Pharmacy" value={data.pharmacyName || "—"} color="#f59e0b" />
              <PreviewRow icon={FileCheck} label="License" value={data.pharmacistLicense || "—"} color="#f59e0b" />
            </>
          )}

          {data.role === "DOCTOR" && (
            <>
              <PreviewRow icon={GraduationCap} label="Specialty" value={data.specialty || "—"} color="#3b82f6" />
              <PreviewRow icon={FileCheck} label="License" value={data.medicalLicense || "—"} color="#3b82f6" />
            </>
          )}

          {data.role === "MEDICAL_ASSISTANT" && (
            <PreviewRow icon={Building2} label="Organization" value={data.organization || "—"} color="#27a644" />
          )}
        </div>

        <div
          className="flex items-center gap-2 px-5 py-3"
          style={{ borderTop: "1px solid var(--hairline)", background: "var(--surface-2)" }}
        >
          <Sparkles className="size-3" style={{ color: "var(--lavender)" }} />
          <span className="text-[10px]" style={{ color: "var(--ink-tertiary)" }}>
            Profile being built...
          </span>
        </div>
      </div>
    </div>
  );
}

function PreviewRow({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Shield;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="flex size-7 items-center justify-center rounded" style={{ background: `color-mix(in srgb, ${color} 10%, transparent)` }}>
        <Icon className="size-3.5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium uppercase tracking-wide" style={{ color: "var(--ink-tertiary)" }}>{label}</p>
        <p className="truncate text-[12px]" style={{ color: "var(--ink-muted)" }}>{value}</p>
      </div>
    </div>
  );
}
