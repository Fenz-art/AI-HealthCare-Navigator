"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { api, ApiClientError } from "@/lib/api";
import type { HealthcareJourney, OutcomeStatus, UpdateJourneyOutcomePayload } from "@/lib/types";

type JourneyOutcomeSurveyProps = {
  journey: HealthcareJourney;
  onUpdated?: (journey: HealthcareJourney) => void;
};

const STATUS_OPTIONS: { value: OutcomeStatus; label: string }[] = [
  { value: "RECOVERED", label: "Recovered" },
  { value: "IMPROVED",  label: "Improved" },
  { value: "UNCHANGED", label: "Same" },
  { value: "WORSENED",  label: "Worse" },
];

export function JourneyOutcomeSurvey({ journey, onUpdated }: JourneyOutcomeSurveyProps) {
  const [medicationFound, setMedicationFound] = useState(journey.medicationFound);
  const [providerVisited, setProviderVisited] = useState(journey.providerVisited);
  const [outcomeStatus, setOutcomeStatus] = useState<OutcomeStatus>(journey.outcomeStatus);
  const [recoveryTimeDays, setRecoveryTimeDays] = useState<number | null>(journey.recoveryTimeDays);
  const [notes, setNotes] = useState(journey.notes ?? "");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      const payload: UpdateJourneyOutcomePayload = {
        medicationFound,
        providerVisited,
        outcomeStatus,
        recoveryTimeDays: recoveryTimeDays ?? undefined,
        notes: notes.trim() || undefined,
      };
      const updated = await api.updateJourneyOutcome(journey.id, payload);
      setSubmitted(true);
      onUpdated?.(updated);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Unable to save.");
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
          <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>Outcome saved</p>
          <p className="text-[12px]" style={{ color: "var(--ink-subtle)" }}>
            Your health graph is updated.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-[14px] font-semibold" style={{ color: "var(--ink)" }}>How did things go?</h2>
        <p className="mt-0.5 text-[12px]" style={{ color: "var(--ink-subtle)" }}>
          Help CareCompass learn from your experience.
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-[12px] font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>
            Did you obtain the medication?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setMedicationFound(true)}
              className="flex-1 rounded px-3 py-2 text-[13px] font-medium transition-colors"
              style={{
                background: medicationFound ? "var(--lavender-muted)" : "var(--surface-2)",
                border: `1px solid ${medicationFound ? "rgba(94,106,210,0.3)" : "var(--hairline)"}`,
                color: medicationFound ? "var(--lavender)" : "var(--ink-muted)",
              }}
            >Yes</button>
            <button
              onClick={() => setMedicationFound(false)}
              className="flex-1 rounded px-3 py-2 text-[13px] font-medium transition-colors"
              style={{
                background: !medicationFound ? "var(--lavender-muted)" : "var(--surface-2)",
                border: `1px solid ${!medicationFound ? "rgba(94,106,210,0.3)" : "var(--hairline)"}`,
                color: !medicationFound ? "var(--lavender)" : "var(--ink-muted)",
              }}
            >No</button>
          </div>
        </div>

        <div>
          <p className="text-[12px] font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>
            Did you visit a provider?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setProviderVisited(true)}
              className="flex-1 rounded px-3 py-2 text-[13px] font-medium transition-colors"
              style={{
                background: providerVisited ? "var(--lavender-muted)" : "var(--surface-2)",
                border: `1px solid ${providerVisited ? "rgba(94,106,210,0.3)" : "var(--hairline)"}`,
                color: providerVisited ? "var(--lavender)" : "var(--ink-muted)",
              }}
            >Yes</button>
            <button
              onClick={() => setProviderVisited(false)}
              className="flex-1 rounded px-3 py-2 text-[13px] font-medium transition-colors"
              style={{
                background: !providerVisited ? "var(--lavender-muted)" : "var(--surface-2)",
                border: `1px solid ${!providerVisited ? "rgba(94,106,210,0.3)" : "var(--hairline)"}`,
                color: !providerVisited ? "var(--lavender)" : "var(--ink-muted)",
              }}
            >No</button>
          </div>
        </div>

        <div>
          <p className="text-[12px] font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>
            How are you feeling now?
          </p>
          <div className="grid grid-cols-2 gap-2">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setOutcomeStatus(opt.value)}
                className="rounded px-3 py-2 text-[13px] font-medium transition-colors"
                style={{
                  background: outcomeStatus === opt.value ? "var(--lavender-muted)" : "var(--surface-2)",
                  border: `1px solid ${outcomeStatus === opt.value ? "rgba(94,106,210,0.3)" : "var(--hairline)"}`,
                  color: outcomeStatus === opt.value ? "var(--lavender)" : "var(--ink-muted)",
                }}
              >{opt.label}</button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[12px] font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>
            Recovery time (days)
          </p>
          <input
            type="number"
            min={0}
            max={365}
            value={recoveryTimeDays ?? ""}
            onChange={(e) => setRecoveryTimeDays(e.target.value ? Number(e.target.value) : null)}
            placeholder="Optional"
            className="w-full rounded px-3 py-2 text-[13px] outline-none"
            style={{ background: "var(--surface-2)", border: "1px solid var(--hairline)", color: "var(--ink)", caretColor: "var(--lavender)" }}
          />
        </div>

        <div>
          <p className="text-[12px] font-medium mb-1.5" style={{ color: "var(--ink-muted)" }}>
            Additional notes
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional — anything you want to remember..."
            rows={2}
            className="w-full rounded px-3 py-2 text-[13px] outline-none resize-none"
            style={{ background: "var(--surface-2)", border: "1px solid var(--hairline)", color: "var(--ink)", caretColor: "var(--lavender)" }}
          />
        </div>
      </div>

      {error && <p className="text-[12px]" style={{ color: "var(--semantic-red)" }}>{error}</p>}

      <button
        type="button"
        className="btn-primary w-full"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? <Loader2 className="size-3.5 animate-spin" /> : "Save outcome"}
      </button>
    </div>
  );
}
