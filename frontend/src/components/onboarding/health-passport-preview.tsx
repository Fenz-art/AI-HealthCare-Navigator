"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  Heart,
  Phone,
  Pill,
  Shield,
  User,
  Globe,
  FileText,
  Droplets,
} from "lucide-react";
import type { OnboardingData } from "@/stores/onboarding-store";

type HealthPassportPreviewProps = {
  name: string;
  data: OnboardingData;
};

export function HealthPassportPreview({ name, data }: HealthPassportPreviewProps) {
  const sections = [
    {
      icon: Droplets,
      label: "Blood Type",
      color: "var(--semantic-red)",
      items: data.bloodGroup ? [data.bloodGroup] : [],
      empty: "Not set",
    },
    {
      icon: AlertTriangle,
      label: "Allergies",
      color: "var(--semantic-red)",
      items: data.allergies.filter((a) => a !== "None"),
      empty: "None recorded",
    },
    {
      icon: Pill,
      label: "Medications",
      color: "var(--semantic-blue)",
      items: data.medications.map((m) => `${m.name} · ${m.dosage}`),
      empty: "None",
    },
    {
      icon: Heart,
      label: "Conditions",
      color: "var(--semantic-purple)",
      items: data.conditions,
      empty: "None recorded",
    },
    {
      icon: Phone,
      label: "Emergency contact",
      color: "var(--lavender-hover)",
      items: data.emergencyContacts.length > 0
        ? [`${data.emergencyContacts[0].name} · ${data.emergencyContacts[0].phone}`]
        : [],
      empty: "Not set",
    },
    {
      icon: Shield,
      label: "Insurance",
      color: "var(--semantic-success)",
      items: data.hasInsurance === "yes" ? [data.insuranceProvider || "On file"] : [],
      empty: "Not provided",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mt-6 overflow-hidden rounded-2xl border"
      style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}
    >
      {/* Identity header */}
      <div
        className="relative overflow-hidden px-6 py-5"
        style={{
          borderBottom: "1px solid var(--hairline)",
          background: "linear-gradient(135deg, var(--surface-2) 0%, var(--surface-1) 100%)",
        }}
      >
        <div className="absolute right-0 top-0 size-32 translate-x-8 -translate-y-8 rounded-full opacity-[0.03]" style={{ background: "var(--lavender)" }} />
        <div className="flex items-center gap-4">
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-full text-[15px] font-bold"
            style={{ background: "var(--lavender)", color: "var(--inverse-ink)" }}
          >
            {name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--ink-tertiary)" }}>
                Health Passport
              </p>
              <Shield className="size-3" style={{ color: "var(--lavender)" }} />
            </div>
            <p className="mt-0.5 text-[17px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
              {name}
            </p>
            <div className="mt-1 flex items-center gap-3 text-[11px]" style={{ color: "var(--ink-tertiary)" }}>
              <span>{data.homeCountry || "—"}</span>
              {data.frequentDestinations.length > 0 && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Globe className="size-3" />
                    {data.frequentDestinations.length} destinations
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
        className="divide-y"
        style={{ borderColor: "var(--hairline)" }}
      >
        {sections.map((section) => {
          const Icon = section.icon;
          const hasItems = section.items.length > 0;
          return (
            <motion.div
              key={section.label}
              variants={{
                hidden: { opacity: 0, x: -12 },
                visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
              }}
              className="flex items-start gap-3 px-6 py-3.5"
            >
              <div
                className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: `color-mix(in srgb, ${section.color} 10%, transparent)`,
                  border: `1px solid color-mix(in srgb, ${section.color} 20%, transparent)`,
                }}
              >
                <Icon className="size-4" style={{ color: section.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--ink-tertiary)" }}>
                  {section.label}
                </p>
                <p className="mt-0.5 text-[13px] truncate" style={{ color: hasItems ? "var(--ink-muted)" : "var(--ink-tertiary)" }}>
                  {hasItems ? section.items.join(", ") : section.empty}
                </p>
              </div>
              {hasItems && (
                <div className="flex size-5 shrink-0 items-center justify-center rounded-full" style={{ background: "var(--semantic-success)" }}>
                  <span className="text-[9px] font-bold" style={{ color: "var(--inverse-ink)" }}>
                    {section.items.length}
                  </span>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      {/* Footer */}
      <div
        className="px-6 py-3 text-center"
        style={{ borderTop: "1px solid var(--hairline)", background: "var(--surface-2)" }}
      >
        <p className="text-[10px]" style={{ color: "var(--ink-tertiary)" }}>
          Auto-translates · Shareable with any provider
        </p>
      </div>
    </motion.div>
  );
}
