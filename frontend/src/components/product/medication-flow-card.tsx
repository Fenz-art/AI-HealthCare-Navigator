"use client";

import type { MedicationRecommendation } from "@/lib/types";
import { Pill } from "lucide-react";

type MedicationFlowCardProps = {
  medications: MedicationRecommendation[];
};

export function MedicationFlowCard({ medications }: MedicationFlowCardProps) {
  return (
    <div className="cc-panel space-y-3">
      <div className="flex items-center gap-2">
        <Pill className="size-4 text-[var(--cc-pharmacy)]" />
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--cc-text-secondary)]">
          Medication
        </p>
      </div>
      {medications.map((med) => (
        <div key={med.id} className="rounded-xl bg-[var(--cc-bg)] p-3">
          <p className="font-medium">{med.brand.name}</p>
          <p className="text-xs text-[var(--cc-text-secondary)]">
            {med.activeIngredient.name} · {med.country.name}
          </p>
          <div className="mt-2 flex gap-2 text-[10px] font-medium uppercase tracking-wide">
            <span className="rounded-full bg-[var(--cc-elevated)] px-2 py-0.5">
              {med.brand.otcStatus}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
