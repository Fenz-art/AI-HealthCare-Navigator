"use client";

import { motion } from "framer-motion";
import { Building2, FileCheck, MapPin, Pill, Upload, CheckCircle2 } from "lucide-react";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { StepLayout, NavRow } from "./shared";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "Hindi" },
  { code: "ja", name: "Japanese" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "zh", name: "Chinese" },
  { code: "ar", name: "Arabic" },
  { code: "pt", name: "Portuguese" },
];

const COUNTRIES = [
  { code: "IN", name: "India" }, { code: "US", name: "United States" },
  { code: "JP", name: "Japan" }, { code: "TH", name: "Thailand" },
  { code: "DE", name: "Germany" }, { code: "SG", name: "Singapore" },
  { code: "GB", name: "United Kingdom" }, { code: "FR", name: "France" },
  { code: "ES", name: "Spain" }, { code: "BR", name: "Brazil" },
  { code: "AU", name: "Australia" }, { code: "CA", name: "Canada" },
  { code: "AE", name: "UAE" }, { code: "KR", name: "South Korea" },
];

export function PharmacistIdentityStep({ onNext }: { onNext: () => void }) {
  const { data, updateData } = useOnboardingStore();
  return (
    <StepLayout
      icon={<Building2 className="size-5" />}
      title="Your pharmacy profile"
      subtitle="Set up your professional identity on CareCompass."
    >
      <div className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>Full name</label>
          <input
            value={data.identity.name}
            onChange={(e) => updateData({ identity: { ...data.identity, name: e.target.value } })}
            placeholder="Enter your full name"
            className="h-11 w-full rounded-lg border bg-transparent px-3 text-[14px] outline-none transition-colors focus:ring-2"
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

export function PharmacyDetailsStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { data, updateData } = useOnboardingStore();
  return (
    <StepLayout
      icon={<MapPin className="size-5" />}
      title="Pharmacy details"
      subtitle="Tell us about your pharmacy so we can connect you with travelers."
    >
      <div className="mt-8 space-y-4">
        <div>
          <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>Pharmacy name</label>
          <div className="relative">
            <Pill className="absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--ink-tertiary)" }} />
            <input
              value={data.pharmacyName}
              onChange={(e) => updateData({ pharmacyName: e.target.value })}
              placeholder="e.g., Tokyo Central Pharmacy"
              className="h-11 w-full rounded-lg border bg-transparent pl-10 pr-4 text-[14px] outline-none focus:ring-2"
              style={{ borderColor: data.pharmacyName ? "var(--lavender)" : "var(--hairline)", color: "var(--ink)" }}
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>Pharmacy address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2" style={{ color: "var(--ink-tertiary)" }} />
            <input
              value={data.pharmacyAddress}
              onChange={(e) => updateData({ pharmacyAddress: e.target.value })}
              placeholder="Full address with country"
              className="h-11 w-full rounded-lg border bg-transparent pl-10 pr-4 text-[14px] outline-none focus:ring-2"
              style={{ borderColor: data.pharmacyAddress ? "var(--lavender)" : "var(--hairline)", color: "var(--ink)" }}
            />
          </div>
        </div>
      </div>
      <NavRow onBack={onBack} onNext={onNext} nextDisabled={!data.pharmacyName || !data.pharmacyAddress} />
    </StepLayout>
  );
}

export function PharmacistLicenseStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const { data, updateData } = useOnboardingStore();
  return (
    <StepLayout
      icon={<FileCheck className="size-5" />}
      title="License verification"
      subtitle="Optional but recommended. Verified pharmacists get priority in traveler connections."
    >
      <div className="mt-8 space-y-6">
        <div>
          <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>License number (optional)</label>
          <input
            value={data.pharmacistLicense}
            onChange={(e) => updateData({ pharmacistLicense: e.target.value })}
            placeholder="e.g., PH-12345-6789"
            className="h-11 w-full rounded-lg border bg-transparent px-3 text-[14px] outline-none focus:ring-2"
            style={{ borderColor: data.pharmacistLicense ? "var(--lavender)" : "var(--hairline)", color: "var(--ink)" }}
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
            <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>Upload license document</p>
            <p className="mt-0.5 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>PDF or image of your pharmacy license</p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--ink-subtle)" }}>Certifications (optional)</label>
          <input
            value={data.certifications}
            onChange={(e) => updateData({ certifications: e.target.value })}
            placeholder="e.g., Immunization, MTM, Diabetes Care"
            className="h-11 w-full rounded-lg border bg-transparent px-3 text-[14px] outline-none focus:ring-2"
            style={{ borderColor: "var(--hairline)", color: "var(--ink)" }}
          />
        </div>
      </div>
      <NavRow onBack={onBack} onNext={onNext} />
    </StepLayout>
  );
}
