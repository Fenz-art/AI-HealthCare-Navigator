"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MapPin, Pill, Languages, CheckCircle2 } from "lucide-react";
import { motion as motionTokens } from "@/lib/motion";

export type JourneyStep = {
  phase: string;
  title: string;
  detail: string;
};

export type UseCaseJourneyProps = {
  city: string;
  country: string;
  flag: string;
  title: string;
  subtitle: string;
  steps: JourneyStep[];
  outcome: string;
};

const ICONS = [MapPin, Pill, Languages, CheckCircle2];

export function UseCaseJourney({
  city,
  country,
  flag,
  title,
  subtitle,
  steps,
  outcome,
}: UseCaseJourneyProps) {
  const [active, setActive] = useState(0);

  return (
    <article
      className="mk-demo-card group cursor-pointer transition-colors duration-200 hover:border-[var(--hairline-strong)]"
      onMouseEnter={() => setActive(Math.min(active + 1, steps.length - 1))}
    >
      <div className="mk-demo-header">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="mk-mono mb-2">
              {flag} {city}, {country}
            </p>
            <h3 className="font-display text-xl font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
              {title}
            </h3>
            <p className="mt-1.5 text-sm" style={{ color: "var(--ink-muted)" }}>
              {subtitle}
            </p>
          </div>
          <span className="status-badge-success">{outcome}</span>
        </div>
      </div>

      <div className="mk-demo-body">
        <div className="relative">
          <div className="absolute left-[11px] top-3 bottom-3 w-px" style={{ background: "var(--hairline)" }} />
          <AnimatePresence mode="wait">
            {steps.map((step, i) => {
              const Icon = ICONS[i % ICONS.length];
              const isActive = i <= active;
              return (
                <motion.div
                  key={step.phase}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: isActive ? 1 : 0.35 }}
                  transition={{ duration: motionTokens.normal }}
                  className="relative flex gap-4 pb-6 last:pb-0"
                >
                  <div
                    className="relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: isActive ? "var(--lavender-muted)" : "var(--surface-3)",
                      border: `1px solid ${isActive ? "var(--lavender)" : "var(--hairline)"}`,
                    }}
                  >
                    <Icon className="size-3" style={{ color: isActive ? "var(--lavender)" : "var(--ink-tertiary)" }} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: "var(--ink-tertiary)" }}>
                      {step.phase}
                    </p>
                    <p className="mt-0.5 text-sm font-medium" style={{ color: "var(--ink)" }}>
                      {step.title}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed" style={{ color: "var(--ink-subtle)" }}>
                      {step.detail}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <button
          type="button"
          className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
          style={{ color: "var(--lavender-hover)" }}
          onClick={() => setActive((a) => (a + 1) % steps.length)}
        >
          Simulate journey <ArrowRight className="size-3.5" />
        </button>
      </div>
    </article>
  );
}
