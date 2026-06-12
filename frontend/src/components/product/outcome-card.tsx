"use client";

import { OutcomeForm } from "@/components/session/outcome-form";
import type { OutcomePayload } from "@/lib/types";

type OutcomeCardProps = {
  sessionId: string;
  initialOutcome: OutcomePayload | null;
};

export function OutcomeCard({ sessionId, initialOutcome }: OutcomeCardProps) {
  return (
    <div className="cc-panel shrink-0">
      <OutcomeForm sessionId={sessionId} initialOutcome={initialOutcome} />
    </div>
  );
}
