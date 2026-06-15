import { prisma } from '../db.js';
export async function findLocalEquivalents(activeIngredientName, countryCode) {
    // First try the legacy Brand/MedicationEdge models
    const legacy = await prisma.medicationEdge.findMany({
        where: {
            country: { code: countryCode },
            activeIngredient: {
                name: { equals: activeIngredientName, mode: 'insensitive' },
            },
        },
        include: {
            brand: true,
            activeIngredient: true,
            country: true,
        },
    });
    // Also search the new MedicationReference model
    const references = await prisma.medicationReference.findMany({
        where: {
            ingredient: { contains: activeIngredientName, mode: 'insensitive' },
            country: countryCode.toUpperCase(),
        },
        orderBy: { brandName: 'asc' },
    });
    // Return in a format compatible with both old code (flat array for MedicationEdge-based logic)
    // and new code (accessing references separately)
    return Object.assign(legacy.map((e) => ({
        id: e.id,
        brand: e.brand,
        activeIngredient: e.activeIngredient,
        country: e.country,
        notes: e.notes,
    })), { legacy, references });
}
export async function findEquivalentsGlobally(ingredientName) {
    const [legacy, references] = await Promise.all([
        prisma.medicationEdge.findMany({
            where: {
                activeIngredient: {
                    name: { equals: ingredientName, mode: 'insensitive' },
                },
            },
            include: {
                brand: true,
                activeIngredient: true,
                country: true,
            },
        }),
        prisma.medicationReference.findMany({
            where: {
                ingredient: { contains: ingredientName, mode: 'insensitive' },
            },
            orderBy: [{ country: 'asc' }, { brandName: 'asc' }],
        }),
    ]);
    return { legacy, references };
}
export async function searchByBrandName(brandName) {
    const [legacy, references] = await Promise.all([
        prisma.brand.findMany({
            where: {
                name: { contains: brandName, mode: 'insensitive' },
            },
            include: {
                country: true,
                activeIngredient: true,
            },
        }),
        prisma.medicationReference.findMany({
            where: {
                brandName: { contains: brandName, mode: 'insensitive' },
            },
            orderBy: { brandName: 'asc' },
        }),
    ]);
    return { legacy, references };
}
export async function getCountriesWithData() {
    const [legacyCountries, refCountries] = await Promise.all([
        prisma.country.findMany({
            include: {
                _count: { select: { brands: true } },
            },
        }),
        prisma.medicationReference.groupBy({
            by: ['country'],
            _count: true,
        }),
    ]);
    return {
        legacy: legacyCountries.map((c) => ({
            name: c.name,
            code: c.code,
            brandCount: c._count.brands,
        })),
        references: refCountries.map((c) => ({
            country: c.country,
            count: c._count,
        })),
    };
}
//# sourceMappingURL=repository.js.map