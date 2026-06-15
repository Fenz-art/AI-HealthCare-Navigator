"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft } from "lucide-react";

export function StepLayout({
  icon,
  title,
  subtitle,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {icon && (
        <div
          className="mb-5 flex size-10 items-center justify-center rounded-xl"
          style={{ background: "var(--lavender-muted)", border: "1px solid rgba(94,106,210,0.15)" }}
        >
          <div style={{ color: "var(--lavender)" }}>{icon}</div>
        </div>
      )}
      <h1
        className="text-[28px] font-semibold leading-tight tracking-tight"
        style={{ color: "var(--ink)", letterSpacing: "-0.6px" }}
      >
        {title}
      </h1>
      <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--ink-subtle)" }}>
        {subtitle}
      </p>
      {children}
    </div>
  );
}

export function NavRow({
  onBack,
  onNext,
  nextDisabled,
  showNext = true,
  nextLabel,
}: {
  onBack?: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  showNext?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="mt-8 flex items-center justify-between gap-3">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] transition-colors hover:bg-[var(--surface-2)]"
          style={{ color: "var(--ink-tertiary)" }}
        >
          <ChevronLeft className="size-4" />
          Back
        </button>
      ) : (
        <div />
      )}
      {showNext && (
        <motion.button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          whileHover={{ scale: nextDisabled ? 1 : 1.01 }}
          whileTap={{ scale: nextDisabled ? 1 : 0.98 }}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-medium transition-all disabled:opacity-40"
          style={{
            background: "var(--lavender)",
            color: "var(--inverse-ink)",
          }}
        >
          {nextLabel || "Continue"}
          <ArrowRight className="size-4" />
        </motion.button>
      )}
    </div>
  );
}
