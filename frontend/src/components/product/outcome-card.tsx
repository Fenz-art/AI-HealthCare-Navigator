"use client";

import { OutcomeForm } from "@/components/session/outcome-form";
import type { OutcomePayload } from "@/lib/types";

type OutcomeCardProps = {
  sessionId: string;
  initialOutcome: OutcomePayload | null;
};

/**
 * NATURAL SPRINT — Outcome card wrapper.
 * Lifted-panel surface. No cc-panel.
 */
export function OutcomeCard({ sessionId, initialOutcome }: OutcomeCardProps) {
  return (
    <div
      className="lifted-panel shrink-0 rounded-md p-4"
      style={{ background: "var(--surface-1)" }}
    >
      <OutcomeForm sessionId={sessionId} initialOutcome={initialOutcome} />
    </div>
  );
}
