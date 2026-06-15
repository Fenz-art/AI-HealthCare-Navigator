"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Compass, Globe, Mic, Pill, Shield, Sparkles } from "lucide-react";

type ActivationScreenProps = {
  onEnter: () => void;
  summary: {
    destinations: number;
    medications: number;
    allergies: number;
    insurance: boolean;
    interpreter: boolean;
    conditions: number;
  };
};

export function ActivationScreen({ onEnter, summary }: ActivationScreenProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    const timeout = setTimeout(() => setShowDetails(true), 1200);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, []);

  const items = [
    { icon: Globe, label: "Destinations", value: `${summary.destinations} configured` },
    { icon: Pill, label: "Medications", value: `${summary.medications} on file` },
    { icon: Shield, label: "Allergies", value: summary.allergies > 0 ? `${summary.allergies} recorded` : "None" },
    { icon: Shield, label: "Conditions", value: summary.conditions > 0 ? `${summary.conditions} on file` : "None" },
    { icon: Shield, label: "Insurance", value: summary.insurance ? "On file" : "Skipped" },
    { icon: Mic, label: "Interpreter", value: summary.interpreter ? "Enabled" : "Later" },
  ];

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
      style={{ background: "var(--canvas)" }}
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 size-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.03]"
        style={{ background: "radial-gradient(ellipse, var(--lavender) 0%, transparent 70%)" }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg text-center"
      >
        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex size-20 items-center justify-center rounded-full"
          style={{
            background: "var(--lavender-muted)",
            border: "1px solid rgba(94,106,210,0.2)",
          }}
        >
          <motion.div
            animate={{ rotate: [0, 5, 0, -5, 0] }}
            transition={{ delay: 0.8, duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <Compass className="size-9" style={{ color: "var(--lavender)" }} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1
            className="mt-8 text-[32px] font-semibold leading-tight tracking-tight sm:text-[40px]"
            style={{ color: "var(--ink)", letterSpacing: "-1px" }}
          >
            Your Healthcare Operating System{dots}
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed" style={{ color: "var(--ink-muted)" }}>
            CareCompass can now guide, translate, locate care, and preserve your healthcare history worldwide.
          </p>
        </motion.div>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="mt-10 overflow-hidden rounded-2xl border"
                style={{ borderColor: "var(--hairline)", background: "var(--surface-1)" }}
              >
                <div className="divide-y" style={{ borderColor: "var(--hairline)" }}>
                  {items.map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="flex items-center gap-3 px-5 py-3"
                      >
                        <Icon className="size-4 shrink-0" style={{ color: "var(--ink-tertiary)" }} />
                        <span className="flex-1 text-left text-[13px]" style={{ color: "var(--ink-subtle)" }}>
                          {item.label}
                        </span>
                        <span className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>
                          {item.value}
                        </span>
                        <CheckCircle2 className="size-4 shrink-0" style={{ color: "var(--semantic-success)" }} />
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <motion.button
                type="button"
                onClick={onEnter}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-[15px] font-semibold transition-all"
                style={{
                  background: "var(--lavender)",
                  color: "var(--inverse-ink)",
                }}
              >
                Enter CareCompass <ArrowRight className="size-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
