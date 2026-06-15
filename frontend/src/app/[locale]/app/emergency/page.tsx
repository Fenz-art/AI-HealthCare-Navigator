"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { AlertTriangle, Phone, PlusCircle, Shield } from "lucide-react";
import { PageHeader } from "@/components/os/page-header";
import { staggerContainer, staggerItem } from "@/lib/motion";

/**
 * NATURAL SPRINT — Emergency
 * Red semantic band. Surface-ladder cards. No drop-shadows.
 * Hairline borders. Lavender for non-critical CTAs.
 */
const EMERGENCY_NUMBERS = [
  { region: "United States",  number: "911",  code: "US" },
  { region: "United Kingdom", number: "999",  code: "GB" },
  { region: "European Union", number: "112",  code: "EU" },
  { region: "Japan",          number: "119",  code: "JP" },
  { region: "India",          number: "112",  code: "IN" },
  { region: "Australia",      number: "000",  code: "AU" },
  { region: "Thailand",       number: "1669", code: "TH" },
  { region: "Brazil",         number: "192",  code: "BR" },
];

export default function EmergencyPage() {
  const { locale } = useParams() as { locale: string };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader
        eyebrow="Critical"
        title="Emergency"
        description="Navigation support only — not a substitute for emergency care. If in immediate danger, call local services now."
      />

      {/* Emergency CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-md p-5"
        style={{
          background: "rgba(255,77,79,0.06)",
          border: "1px solid rgba(255,77,79,0.25)",
          borderTopColor: "rgba(255,77,79,0.4)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded"
            style={{ background: "rgba(255,77,79,0.12)", border: "1px solid rgba(255,77,79,0.25)" }}
          >
            <AlertTriangle className="size-4" style={{ color: "var(--semantic-red)" }} />
          </div>
          <h2 className="text-[15px] font-semibold" style={{ color: "var(--semantic-red)" }}>
            Immediate Danger?
          </h2>
        </div>
        <p className="text-[13px] leading-relaxed mb-4" style={{ color: "var(--ink-subtle)" }}>
          If someone is experiencing a life-threatening emergency, call local services
          immediately. Do not rely on any app.
        </p>
        <a
          href="tel:112"
          className="flex h-9 w-full items-center justify-center gap-2 rounded font-semibold text-[13px] transition-opacity hover:opacity-90 sm:w-auto sm:px-6"
          style={{ background: "var(--semantic-red)", color: "#fff" }}
        >
          <Phone className="size-3.5" />
          Call Emergency Services (112)
        </a>
      </motion.div>

      {/* Emergency numbers */}
      <div>
        <p
          className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em]"
          style={{ color: "var(--ink-tertiary)" }}
        >
          Local Emergency Numbers
        </p>
        <motion.div
          className="grid gap-1.5 sm:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {EMERGENCY_NUMBERS.map((item) => (
            <motion.a
              key={item.region}
              href={`tel:${item.number}`}
              variants={staggerItem}
              className="cc-card-hover flex items-center justify-between p-3"
            >
              <span className="text-[13px]" style={{ color: "var(--ink-muted)" }}>
                {item.region}
              </span>
              <span
                className="font-mono text-[16px] font-bold"
                style={{ color: "var(--semantic-red)" }}
              >
                {item.number}
              </span>
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Non-emergency CTA */}
      <div
        className="flex items-center gap-3 rounded-md p-4 lifted-panel"
        style={{ background: "var(--surface-1)" }}
      >
        <Shield className="size-4 shrink-0" style={{ color: "var(--lavender)" }} />
        <p className="flex-1 text-[13px]" style={{ color: "var(--ink-subtle)" }}>
          Not an emergency? Start a guided session to assess severity and locate nearby care.
        </p>
        <Link
          href={`/${locale}/app/session/new`}
          className="btn-primary shrink-0 gap-1.5"
        >
          <PlusCircle className="size-3.5" />
          Start session
        </Link>
      </div>
    </div>
  );
}
