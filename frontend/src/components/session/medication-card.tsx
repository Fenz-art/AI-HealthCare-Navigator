"use client";

import type { MedicationRecommendation } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

type MedicationCardProps = {
  med: MedicationRecommendation;
};

export function MedicationCard({ med }: MedicationCardProps) {
  return (
    <article className="surface-card p-4">
      <p className="text-lg font-semibold">{med.brand.name}</p>
      <p className="text-sm text-muted-foreground">
        {med.activeIngredient.name} · {med.country.name}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant="secondary">{med.brand.otcStatus}</Badge>
        <Badge variant="outline">{med.brand.doseRule}</Badge>
      </div>
    </article>
  );
}
