"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, Phone, PlusCircle, Shield } from "lucide-react";
import { PageHeader } from "@/components/os/page-header";
import { motion as motionTokens } from "@/lib/motion";

const EMERGENCY_NUMBERS = [
  { region: "United States", number: "911", code: "US" },
  { region: "United Kingdom", number: "999", code: "GB" },
  { region: "European Union", number: "112", code: "EU" },
  { region: "Japan", number: "119", code: "JP" },
  { region: "India", number: "112", code: "IN" },
  { region: "Australia", number: "000", code: "AU" },
  { region: "Thailand", number: "1669", code: "TH" },
  { region: "Brazil", number: "192", code: "BR" },
];

export default function EmergencyPage() {
  const { locale } = useParams() as { locale: string };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        eyebrow="Critical"
        title="Emergency"
        description="CareCompass is navigation support — not a substitute for emergency care. If you are in immediate danger, call local emergency services now."
      />

      {/* Emergency CTA banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: motionTokens.normal, ease: motionTokens.ease }}
        className="relative overflow-hidden rounded-3xl border border-[var(--cc-emergency)]/30 bg-gradient-to-br from-[rgba(255,77,79,0.12)] to-[rgba(255,77,79,0.04)] p-6 sm:p-8"
      >
        <div className="absolute -right-10 -top-10 size-40 rounded-full bg-[var(--cc-emergency)]/10 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--cc-emergency)]/20">
              <AlertTriangle className="size-5 text-[var(--cc-emergency)]" />
            </div>
            <h2 className="font-display text-xl font-bold text-[var(--cc-emergency)]">
              Immediate Danger?
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-[var(--cc-text-secondary)] max-w-lg mb-6">
            If you or someone near you is experiencing a life-threatening emergency, call local services immediately.
            Do not rely on any app — dial emergency services now.
          </p>
          <a
            href="tel:112"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--cc-emergency)] text-sm font-bold text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-8"
          >
            <Phone className="size-4" />
            Call Emergency Services (112)
          </a>
        </div>
      </motion.div>

      {/* Emergency numbers grid */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--cc-text-secondary)] mb-4">
          Local Emergency Numbers
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {EMERGENCY_NUMBERS.map((item, i) => (
            <motion.a
              key={item.region}
              href={`tel:${item.number}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04, duration: motionTokens.normal, ease: motionTokens.ease }}
              className="cc-panel flex items-center justify-between transition-colors duration-200 hover:border-[var(--cc-emergency)]/25"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.code === "EU" ? "🇪🇺" : ""}</span>
                <span className="text-sm font-medium text-[var(--cc-text)]">
                  {item.region}
                </span>
              </div>
              <span className="font-mono text-lg font-bold text-[var(--cc-emergency)]">
                {item.number}
              </span>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Non-emergency CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: motionTokens.normal }}
        className="cc-elevated flex flex-col items-center gap-4 rounded-2xl p-6 text-center sm:flex-row sm:text-left"
      >
        <Shield className="size-5 shrink-0 text-[var(--cc-pharmacy)]" />
        <p className="flex-1 text-sm text-[var(--cc-text-secondary)]">
          Not an emergency? Start a guided session to assess severity, find medication, and locate nearby care.
        </p>
        <Link
          href={`/${locale}/app/session/new`}
          className="inline-flex h-10 items-center gap-2 rounded-full bg-[var(--cc-text)] px-5 text-sm font-semibold text-[var(--cc-bg)] transition-opacity hover:opacity-90"
        >
          <PlusCircle className="size-4" />
          Start session
        </Link>
      </motion.div>
    </div>
  );
}
