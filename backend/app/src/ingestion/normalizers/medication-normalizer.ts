export interface RawMedicationRecord {
  sourceId: string;
  sourceType: string;
  country: string;
  brandName: string;
  ingredient: string;
  strength?: string | null;
  otc?: boolean | null;
  route?: string | null;
  manufacturer?: string | null;
  meta?: Record<string, unknown>;
}

export interface NormalizedMedication {
  sourceId: string;
  sourceType: string;
  country: string;
  brandName: string;
  ingredient: string;
  strength: string | null;
  otc: boolean | null;
  route: string | null;
  manufacturer: string | null;
  meta: string | null;
}

export function normalizeMedication(record: RawMedicationRecord): NormalizedMedication {
  return {
    sourceId: record.sourceId,
    sourceType: record.sourceType,
    country: record.country.toUpperCase(),
    brandName: record.brandName.trim(),
    ingredient: normalizeIngredientName(record.ingredient),
    strength: record.strength ?? null,
    otc: record.otc ?? null,
    route: record.route ?? null,
    manufacturer: record.manufacturer ?? null,
    meta: record.meta ? JSON.stringify(record.meta) : null,
  };
}

export function normalizeIngredientName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9\s\-]/g, '')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function normalizeBrandName(name: string): string {
  return name.trim().replace(/\s+/g, ' ');
}
