"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import type { OutcomePayload } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type OutcomeFormProps = {
  sessionId: string;
  initialOutcome: OutcomePayload | null;
  onRecorded?: (outcome: OutcomePayload) => void;
};

const OUTCOME_QUESTIONS: {
  key: keyof OutcomePayload;
  label: string;
  description: string;
}[] = [
  {
    key: "receivedHelp",
    label: "I received help",
    description: "From a pharmacy, clinic, or hospital",
  },
  {
    key: "purchasedMedication",
    label: "I got medication",
    description: "Over-the-counter or prescribed",
  },
  {
    key: "symptomsImproved",
    label: "I feel better",
    description: "Symptoms improved since starting",
  },
];

export function OutcomeForm({ sessionId, initialOutcome, onRecorded }: OutcomeFormProps) {
  const [answers, setAnswers] = useState<OutcomePayload>(
    initialOutcome ?? {
      receivedHelp: false,
      purchasedMedication: false,
      symptomsImproved: false,
    }
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
      setError(
        err instanceof ApiClientError ? err.message : "Unable to save outcome."
      );
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 rounded-xl bg-[var(--cc-bg)] p-4"
      >
        <CheckCircle2 className="size-5 shrink-0 text-[var(--cc-success)]" />
        <div>
          <p className="font-medium">Thanks for checking in</p>
          <p className="text-sm text-muted-foreground">
            Your feedback helps CareCompass improve guidance for other travelers.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">How did it go?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          A quick check-in — tap what applies. This is optional.
        </p>
      </div>

      <div className="space-y-2">
        {OUTCOME_QUESTIONS.map((question) => {
          const active = answers[question.key];
          return (
            <button
              key={question.key}
              type="button"
              onClick={() => toggle(question.key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                active
                  ? "border-[var(--cc-pharmacy)]/40 bg-[color-mix(in_srgb,var(--cc-pharmacy)_8%,transparent)]"
                  : "hairline bg-[var(--cc-bg)] hover:border-[rgba(255,255,255,0.1)]"
              )}
            >
              <span
                className={cn(
                  "flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  active
                    ? "border-[var(--cc-pharmacy)] bg-[var(--cc-pharmacy)]"
                    : "hairline"
                )}
              >
                {active ? <span className="size-2 rounded-full bg-white" /> : null}
              </span>
              <span>
                <span className="block text-sm font-medium">{question.label}</span>
                <span className="block text-xs text-muted-foreground">
                  {question.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}

      <Button
        type="button"
        className="h-11 w-full rounded-full bg-[var(--cc-text)] text-sm font-medium text-[var(--cc-bg)] hover:opacity-90"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : "Save check-in"}
      </Button>
    </div>
  );
}
