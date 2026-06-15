export function normalizeMedicationName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function normalizeOptionalMedicationName(name: string | null | undefined): string | null {
  if (!name) return null;

  const normalized = normalizeMedicationName(name);
  return normalized.length === 0 ? null : normalized;
}
