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
export declare function normalizeMedication(record: RawMedicationRecord): NormalizedMedication;
export declare function normalizeIngredientName(name: string): string;
export declare function normalizeBrandName(name: string): string;
