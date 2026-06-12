"use client";

import { motion } from "framer-motion";
import { AlertTriangle, Heart, Phone } from "lucide-react";
import { SEVERITY_GUIDANCE, SEVERITY_LABELS } from "@/lib/constants";
import type { SeverityLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

type SeverityHeroProps = {
  severity: SeverityLevel;
  location?: string | null;
};

export function SeverityHero({ severity, location }: SeverityHeroProps) {
  const isEmergency = severity === "EMERGENCY";
  const isSelfCare = severity === "SELF_CARE";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "p-6 sm:p-8",
        isEmergency && "band-emergency",
        isSelfCare && "band-self-care",
        !isEmergency && !isSelfCare && "band-navigation"
      )}
    >
      <div className="flex items-start gap-3">
        {isEmergency ? (
          <AlertTriangle className="mt-1 size-6 shrink-0" aria-hidden />
        ) : isSelfCare ? (
          <Heart className="mt-1 size-6 shrink-0 text-[var(--compass-success)]" aria-hidden />
        ) : null}
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-xs font-semibold uppercase tracking-[0.16em]",
              isEmergency ? "text-white/80" : isSelfCare ? "text-muted-foreground" : "text-white/75"
            )}
          >
            Recommended next step
          </p>
          <h1
            className={cn(
              "mt-2 text-3xl font-semibold tracking-tight sm:text-4xl",
              !isSelfCare && "text-white"
            )}
          >
            {SEVERITY_LABELS[severity] ?? severity}
          </h1>
          <p
            className={cn(
              "mt-3 max-w-xl text-sm leading-relaxed sm:text-base",
              isEmergency ? "text-white/90" : isSelfCare ? "text-muted-foreground" : "text-white/85"
            )}
          >
            {location ? `Near ${location}. ` : ""}
            {SEVERITY_GUIDANCE[severity]}
          </p>
        </div>
      </div>

      {isEmergency ? (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href="tel:112" className="pill-cta-emergency w-full sm:w-auto">
            <Phone className="mr-2 size-4" />
            Call emergency (112)
          </a>
          <a
            href="tel:911"
            className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 px-6 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            US / Canada: 911
          </a>
        </div>
      ) : null}
    </motion.section>
  );
}
