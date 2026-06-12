"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Heart, Pill, User } from "lucide-react";
import { PageHeader } from "@/components/os/page-header";
import { motion as motionTokens } from "@/lib/motion";

const PASSPORT_SECTIONS = [
  {
    icon: AlertTriangle,
    label: "Allergies",
    color: "var(--cc-emergency)",
    items: ["Penicillin", "Shellfish"],
  },
  {
    icon: Pill,
    label: "Current medications",
    color: "var(--cc-pharmacy)",
    items: ["Lisinopril 10mg", "Metformin 500mg"],
  },
  {
    icon: Heart,
    label: "Conditions",
    color: "var(--cc-clinic)",
    items: ["Type 2 diabetes", "Hypertension"],
  },
  {
    icon: User,
    label: "Emergency contacts",
    color: "var(--cc-hospital)",
    items: ["Sarah Chen · +1 415-555-0142", "Dr. Patel · +1 415-555-0198"],
  },
];

export default function PassportPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Travel ready"
        title="Health Passport"
        description="Your medical identity — always accessible, always translatable. Show at any pharmacy or clinic worldwide."
      />

      <motion.div
        initial={{ opacity: 0, y: 16, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: motionTokens.slow, ease: motionTokens.ease }}
        className="cc-glow relative overflow-hidden rounded-3xl border hairline bg-gradient-to-br from-[var(--cc-surface)] to-[var(--cc-elevated)]"
        style={{ perspective: "1000px" }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.12),transparent_50%)]" />

        <div className="relative border-b hairline px-6 py-5 sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--cc-text-secondary)]">
                CareCompass · Health Passport
              </p>
              <p className="font-display mt-1 text-xl font-bold">Alex Traveler</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--cc-text-secondary)]">Blood type</p>
              <p className="font-display text-lg font-bold">O+</p>
            </div>
          </div>
        </div>

        <div className="relative space-y-px p-4 sm:p-6">
          {PASSPORT_SECTIONS.map((section, i) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: motionTokens.normal }}
                className="flex gap-4 rounded-2xl border hairline bg-[var(--cc-bg)]/40 p-4"
              >
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    background: `color-mix(in srgb, ${section.color} 12%, transparent)`,
                  }}
                >
                  <Icon className="size-5" style={{ color: section.color }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--cc-text-secondary)]">
                    {section.label}
                  </p>
                  <ul className="mt-2 space-y-1">
                    {section.items.map((item) => (
                      <li key={item} className="text-sm font-medium">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="relative border-t hairline px-6 py-4 sm:px-8">
          <p className="text-center text-xs text-[var(--cc-text-secondary)]">
            Tap to show provider · Auto-translates to local language
          </p>
        </div>
      </motion.div>
    </div>
  );
}
