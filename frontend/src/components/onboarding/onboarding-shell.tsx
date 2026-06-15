"use client";

import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { PHASES, getPhasesForRole, useOnboardingStore } from "@/stores/onboarding-store";
import { useMemo } from "react";

export function OnboardingProgress() {
  const { step, data } = useOnboardingStore();

  const phases = useMemo(() => getPhasesForRole(data.role), [data.role]);

  const progress = useMemo(() => {
    const allSteps = phases.flatMap((p) => p.steps);
    const maxStep = Math.max(...allSteps);
    return Math.round((step / maxStep) * 100);
  }, [step, phases]);

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        {phases.map((p, i) => {
          const currentPhase = phases.findIndex((ph) => ph.steps.includes(step));
          const isCompleted = i < currentPhase;
          const isActive = i === currentPhase;

          return (
            <div key={p.id} className="flex items-center gap-2">
              <motion.div
                layout
                className={cn(
                  "relative flex items-center gap-2 rounded-full px-3 py-1 transition-all duration-300",
                  isActive && "bg-[var(--lavender-muted)]",
                )}
              >
                <motion.div
                  animate={{
                    width: isActive ? 6 : isCompleted ? 6 : 6,
                    height: 6,
                    borderRadius: "50%",
                  }}
                  className="rounded-full"
                  style={{
                    background: isActive
                      ? "var(--lavender)"
                      : isCompleted
                      ? "var(--lavender)"
                      : "var(--hairline-strong)",
                  }}
                />
                <motion.span
                  animate={{
                    opacity: isActive || isCompleted ? 1 : 0,
                    width: isActive || isCompleted ? "auto" : 0,
                  }}
                  className="overflow-hidden whitespace-nowrap text-[11px] font-medium"
                  style={{
                    color: isActive ? "var(--lavender-hover)" : isCompleted ? "var(--ink-muted)" : "var(--ink-tertiary)",
                  }}
                >
                  {p.label}
                </motion.span>
              </motion.div>
              {i < phases.length - 1 && (
                <div className="h-px w-6" style={{ background: "var(--hairline)" }} />
              )}
            </div>
          );
        })}
      </div>
      <motion.span
        key={progress}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-mono text-[11px] tabular-nums"
        style={{ color: "var(--ink-tertiary)" }}
      >
        {progress}%
      </motion.span>
    </div>
  );
}

export function OnboardingShell({
  children,
  preview,
}: {
  children: React.ReactNode;
  preview?: React.ReactNode;
}) {
  const { step, data } = useOnboardingStore();
  const phases = getPhasesForRole(data.role);
  const allSteps = phases.flatMap((p) => p.steps);
  const maxStep = Math.max(...allSteps);
  const isActivation = step >= maxStep;

  if (isActivation) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen" style={{ background: "var(--canvas)" }}>
      <div className="flex flex-1 flex-col">
        <header
          className="flex items-center justify-between px-8 py-4"
          style={{ borderBottom: "1px solid var(--hairline)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="flex h-6 w-6 items-center justify-center rounded"
              style={{ background: "var(--lavender)" }}
            >
              <span className="text-[11px] font-bold" style={{ color: "var(--inverse-ink)" }}>C</span>
            </div>
            <span className="text-[13px] font-semibold tracking-tight" style={{ color: "var(--ink)" }}>
              CareCompass
            </span>
          </div>
          <OnboardingProgress />
        </header>

        <div className="flex flex-1">
          <div className="flex flex-1 items-center justify-center px-8 pb-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={`step-${step}`}
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-lg"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>

          {preview && (
            <div
              className="relative hidden w-[45%] overflow-hidden lg:block"
              style={{ borderLeft: "1px solid var(--hairline)" }}
            >
              <div className="absolute inset-0 scale-105 blur-sm opacity-50" style={{ filter: "blur(32px)" }}>
                {preview}
              </div>
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(to right, var(--canvas) 0%, transparent 25%)",
                }}
              />
              <div className="relative z-10 flex h-full items-center justify-center p-8">
                <div className="w-full max-w-md scale-90 opacity-90">
                  {preview}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
