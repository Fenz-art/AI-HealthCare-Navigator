"use client";

import { motion } from "framer-motion";
import { Stethoscope, FileCheck, GraduationCap, Upload, CheckCircle2 } from "lucide-react";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { StepLayout, NavRow } from "./shared";

const COUNTRIES = [
  { code: "IN", name: "India" }, { code: "US", name: "United States" },
  { code: "JP", name: "Japan" }, { code: "TH", name: "Thailand" },
  { code: "DE", name: "Germany" }, { code: "SG", name: "Singapore" },
  { code: "GB", name: "United Kingdom" }, { code: "FR", name: "France" },
  { code: "ES", name: "Spain" }, { code: "BR", name: "Brazil" },
  { code: "AU", name: "Australia" }, { code: "CA", name: "Canada" },
  { code: "AE", name: "UAE" }, { code: "KR", name: "South Korea" },
];

const LANGUAGES = [
  { code: "en", name: "English" }, { code: "hi", name: "Hindi" },
  { code: "ja", name: "Japanese" }, { code: "de", name: "German" },
  { code: "es", name: "Spanish" }, { code: "fr", name: "French" },
  { code: "zh", name: "Chinese" }, { code: "ar", name: "Arabic" },
  { code: "pt", name: "Portuguese" }, { code: "ko", name: "Korean" },
  { code: "th", name: "Thai" }, { code: "vi", name: "Vietnamese" },
];

const SPECIALTIES = [
  "General Practice", "Internal Medicine", "Pediatrics", "Cardiology",
  "Dermatology", "Orthopedics", "Neurology", "Psychiatry",
  "Obstetrics & Gynecology", "Ophthalmology", "ENT", "Emergency Medicine",
  "Anesthesiology", "Radiology", "Pathology", "Sports Medicine",
];

export function DoctorIdentityStep({ onNext }: { onNext: () => void }) {
  const { data, updateData } = useOnboardingStore();
  return (
    <StepLayout
      icon={<Stethoscope className="size-5" />}
      title="Your provider profile"
      subtitle="Set up your professional identity to receive shared cases and translation requests."
    >
      <div className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>Full name</label>
          <input
            value={data.identity.name}
            onChange={(e) => updateData({ identity: { ...data.identity, name: e.target.value } })}
            placeholder="Dr. ..."
            className="h-11 w-full rounded-lg border bg-transparent px-3 text-[14px] outline-none focus:ring-2"
            style={{ borderColor: data.identity.name ? "var(--lavender)" : "var(--hairline)", color: "var(--ink)" }}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>Country</label>
            <select
              value={data.identity.country}
              onChange={(e) => updateData({ identity: { ...data.identity, country: e.target.value } })}
              className="h-11 w-full rounded-lg border bg-transparent px-3 text-[14px] outline-none"
              style={{ borderColor: data.identity.country ? "var(--lavender)" : "var(--hairline)", color: "var(--ink)" }}
            >
              <option value="">Select...</option>
              {COUNTRIES.map((c) => <option key={c.code} value={c.code} className="bg-[var(--surface-1)]">{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>Language</label>
            <select
              value={data.identity.language}
              onChange={(e) => updateData({ identity: { ...data.identity, language: e.target.value } })}
              className="h-11 w-full rounded-lg border bg-transparent px-3 text-[14px] outline-none"
              style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}
            >
              {LANGUAGES.map((l) => <option key={l.code} value={l.code} className="bg-[var(--surface-1)]">{l.name}</option>)}
            </select>
          </div>
        </div>
      </div>
      <NavRow onNext={onNext} nextDisabled={!data.identity.name || !data.identity.country} />
    </StepLayout>
  );
}

export function DoctorSpecialtyStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { data, updateData } = useOnboardingStore();
  return (
    <StepLayout
      icon={<GraduationCap className="size-5" />}
      title="Specialty & credentials"
      subtitle="Select your specialty so we can route the right cases to you."
    >
      <div className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>Specialty</label>
          <div className="grid grid-cols-2 gap-2">
            {SPECIALTIES.map((s) => {
              const selected = data.specialty === s;
              return (
                <motion.button
                  key={s}
                  type="button"
                  onClick={() => updateData({ specialty: s })}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="rounded-lg border px-3 py-2.5 text-[12px] text-left transition-all"
                  style={{
                    borderColor: selected ? "var(--lavender)" : "var(--hairline)",
                    background: selected ? "var(--lavender-muted)" : "var(--surface-1)",
                    color: selected ? "var(--lavender-hover)" : "var(--ink-muted)",
                  }}
                >
                  {selected && <CheckCircle2 className="inline size-3 mr-1" />}
                  {s}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>
            Medical license number (optional)
          </label>
          <input
            value={data.medicalLicense}
            onChange={(e) => updateData({ medicalLicense: e.target.value })}
            placeholder="e.g., MD-12345"
            className="h-11 w-full rounded-lg border bg-transparent px-3 text-[14px] outline-none focus:ring-2"
            style={{ borderColor: data.medicalLicense ? "var(--lavender)" : "var(--hairline)", color: "var(--ink)" }}
          />
        </div>

        <div
          className="flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed p-5 transition-colors hover:border-[var(--lavender)]"
          style={{ borderColor: "var(--hairline-strong)", background: "var(--surface-2)" }}
        >
          <div className="flex size-12 items-center justify-center rounded-lg" style={{ background: "var(--lavender-muted)" }}>
            <Upload className="size-5" style={{ color: "var(--lavender)" }} />
          </div>
          <div>
            <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>Upload medical license</p>
            <p className="mt-0.5 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>Optional — verified providers get priority</p>
          </div>
        </div>
      </div>
      <NavRow onBack={onBack} onNext={onNext} nextDisabled={!data.specialty} />
    </StepLayout>
  );
}
