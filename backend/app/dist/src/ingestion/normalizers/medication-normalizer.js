export function normalizeMedication(record) {
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
export function normalizeIngredientName(name) {
    return name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .replace(/[^a-z0-9\s\-]/g, '')
        .replace(/\b\w/g, (c) => c.toUpperCase());
}
export function normalizeBrandName(name) {
    return name.trim().replace(/\s+/g, ' ');
}
//# sourceMappingURL=medication-normalizer.js.map