"use client";

import { motion } from "framer-motion";
import { HeartPulse, Building2, Briefcase, Upload } from "lucide-react";
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

export function AssistantIdentityStep({ onNext }: { onNext: () => void }) {
  const { data, updateData } = useOnboardingStore();
  return (
    <StepLayout
      icon={<HeartPulse className="size-5" />}
      title="Your assistant profile"
      subtitle="Set up your identity to start supporting travelers."
    >
      <div className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>Full name</label>
          <input
            value={data.identity.name}
            onChange={(e) => updateData({ identity: { ...data.identity, name: e.target.value } })}
            placeholder="Enter your full name"
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

export function AssistantOrganizationStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { data, updateData } = useOnboardingStore();
  return (
    <StepLayout
      icon={<Building2 className="size-5" />}
      title="Your organization"
      subtitle="Tell us where you work so we can set up your workspace."
    >
      <div className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>Organization / Clinic name</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--ink-tertiary)" }} />
            <input
              value={data.organization}
              onChange={(e) => updateData({ organization: e.target.value })}
              placeholder="e.g., Bangkok Medical Center"
              className="h-11 w-full rounded-lg border bg-transparent pl-10 pr-4 text-[14px] outline-none focus:ring-2"
              style={{ borderColor: data.organization ? "var(--lavender)" : "var(--hairline)", color: "var(--ink)" }}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>
            Healthcare experience (optional)
          </label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--ink-tertiary)" }} />
            <input
              value={data.healthcareExperience}
              onChange={(e) => updateData({ healthcareExperience: e.target.value })}
              placeholder="e.g., 5 years in patient coordination"
              className="h-11 w-full rounded-lg border bg-transparent pl-10 pr-4 text-[14px] outline-none focus:ring-2"
              style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}
            />
          </div>
        </div>
      </div>
      <NavRow onBack={onBack} onNext={onNext} nextDisabled={!data.organization} />
    </StepLayout>
  );
}
