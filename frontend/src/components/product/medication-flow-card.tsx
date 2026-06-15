"use client";

import type { MedicationRecommendation } from "@/lib/types";
import { Pill } from "lucide-react";

type MedicationFlowCardProps = {
  medications: MedicationRecommendation[];
};

/**
 * NATURAL SPRINT — Medication panel.
 * Surface ladder. Lavender-blue pill icon. Hairline borders.
 */
export function MedicationFlowCard({ medications }: MedicationFlowCardProps) {
  return (
    <div
      className="lifted-panel space-y-2 overflow-y-auto rounded-md p-4"
      style={{ background: "var(--surface-1)" }}
    >
      <div className="flex items-center gap-2">
        <Pill className="size-3.5" style={{ color: "var(--lavender)" }} />
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "var(--ink-tertiary)" }}>
          Medication
        </p>
      </div>

      {medications.map((med) => (
        <div
          key={med.id}
          className="group cursor-pointer rounded px-3 py-2.5 transition-colors duration-100 hover:bg-[var(--surface-3)]"
          style={{ border: "1px solid var(--hairline)" }}
        >
          <div className="flex items-center justify-between">
            <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>
              {med.brand.name}
            </p>
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-medium opacity-0 transition-opacity duration-100 group-hover:opacity-100"
              style={{ background: "var(--lavender-muted)", color: "var(--lavender-hover)" }}
            >
              View
            </span>
          </div>
          <p className="mt-0.5 text-[12px]" style={{ color: "var(--ink-tertiary)" }}>
            {med.activeIngredient.name} · {med.country.name}
          </p>
          <span
            className="mt-1.5 inline-block rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide"
            style={{ background: "var(--surface-3)", color: "var(--ink-tertiary)", border: "1px solid var(--hairline)" }}
          >
            {med.brand.otcStatus}
          </span>
        </div>
      ))}
    </div>
  );
}
