"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import type { OutcomePayload } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * NATURAL SPRINT — Session outcome check-in.
 * Lavender-blue selected state. Surface ladder. No rounded-2xl pills.
 */
type OutcomeFormProps = {
  sessionId: string;
  initialOutcome: OutcomePayload | null;
  onRecorded?: (outcome: OutcomePayload) => void;
};

const OUTCOME_QUESTIONS: { key: keyof OutcomePayload; label: string; description: string }[] = [
  { key: "receivedHelp",        label: "I received help",    description: "From a pharmacy, clinic, or hospital" },
  { key: "purchasedMedication", label: "I got medication",   description: "Over-the-counter or prescribed" },
  { key: "symptomsImproved",    label: "I feel better",      description: "Symptoms improved since starting" },
];

export function OutcomeForm({ sessionId, initialOutcome, onRecorded }: OutcomeFormProps) {
  const [answers, setAnswers] = useState<OutcomePayload>(
    initialOutcome ?? { receivedHelp: false, purchasedMedication: false, symptomsImproved: false }
  );
  const [submitted, setSubmitted] = useState(Boolean(initialOutcome));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(key: keyof OutcomePayload) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      await api.recordOutcome(sessionId, answers);
      setSubmitted(true);
      onRecorded?.(answers);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Unable to save outcome.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 rounded px-3 py-2.5"
        style={{ background: "var(--surface-2)", border: "1px solid var(--hairline)" }}
      >
        <CheckCircle2 className="size-4 shrink-0" style={{ color: "var(--semantic-success)" }} />
        <div>
          <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>Thanks for checking in</p>
          <p className="text-[12px]" style={{ color: "var(--ink-subtle)" }}>
            Your feedback helps CareCompass improve guidance for other travelers.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <div>
        <h2 className="text-[14px] font-semibold" style={{ color: "var(--ink)" }}>How did it go?</h2>
        <p className="mt-0.5 text-[12px]" style={{ color: "var(--ink-subtle)" }}>
          Quick check-in — tap what applies. Optional.
        </p>
      </div>

      <div className="space-y-1.5">
        {OUTCOME_QUESTIONS.map((q) => {
          const active = answers[q.key];
          return (
            <button
              key={q.key}
              type="button"
              onClick={() => toggle(q.key)}
              className="flex w-full items-center gap-3 rounded px-3 py-2.5 text-left transition-colors duration-100"
              style={{
                background: active ? "var(--lavender-muted)" : "var(--surface-2)",
                border: `1px solid ${active ? "rgba(94,106,210,0.3)" : "var(--hairline)"}`,
                borderTopColor: active ? "rgba(94,106,210,0.4)" : "rgba(255,255,255,0.05)",
              }}
            >
              <span
                className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full transition-colors duration-100"
                style={{
                  background: active ? "var(--lavender)" : "transparent",
                  border: `1.5px solid ${active ? "var(--lavender)" : "var(--hairline-strong)"}`,
                }}
              >
                {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
              </span>
              <span>
                <span className="block text-[13px] font-medium" style={{ color: "var(--ink)" }}>{q.label}</span>
                <span className="block text-[11px]" style={{ color: "var(--ink-tertiary)" }}>{q.description}</span>
              </span>
            </button>
          );
        })}
      </div>

      {error && <p className="text-[12px]" style={{ color: "var(--semantic-red)" }}>{error}</p>}

      <button
        type="button"
        className="btn-primary w-full"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <Loader2 className="size-3.5 animate-spin" /> : "Save check-in"}
      </button>
    </div>
  );
}
