import { prisma } from '../lib/db.js';
import { ingestOpenFDA } from './openfda/adapter.js';
import { ingestDailyMed } from './dailymed/adapter.js';
import { ingestEMA } from './ema/adapter.js';
import { ingestNHS } from './nhs/adapter.js';
import { ensureDataSources } from './jobs/service.js';
export async function ensureDataSourcesExist() {
    await ensureDataSources();
}
export async function runIngestion(sourceType) {
    const dataSource = await prisma.dataSource.findUnique({
        where: { id: sourceType },
    });
    if (!dataSource) {
        throw new Error(`Data source ${sourceType} not found. Run ensureDataSources() first.`);
    }
    if (!dataSource.active) {
        throw new Error(`Data source ${sourceType} is inactive.`);
    }
    switch (sourceType) {
        case 'OPENFDA':
            return ingestOpenFDA(dataSource.id);
        case 'DAILYMED':
            return ingestDailyMed(dataSource.id);
        case 'EMA':
            return ingestEMA(dataSource.id);
        case 'NHS':
            return ingestNHS(dataSource.id);
        default:
            throw new Error(`Unknown source type: ${sourceType}`);
    }
}
export async function runAllIngestions() {
    const results = {};
    for (const sourceType of ['OPENFDA', 'DAILYMED', 'EMA', 'NHS']) {
        try {
            results[sourceType] = await runIngestion(sourceType);
        }
        catch (err) {
            results[sourceType] = {
                sourceType,
                imported: 0,
                failed: 1,
                errors: [err instanceof Error ? err.message : 'Unknown error'],
            };
        }
    }
    return results;
}
export async function findMedicationEquivalents(ingredient, countryCode) {
    const references = await prisma.medicationReference.findMany({
        where: {
            ingredient: {
                contains: ingredient,
                mode: 'insensitive',
            },
            country: countryCode.toUpperCase(),
        },
        orderBy: { brandName: 'asc' },
    });
    return references;
}
export async function findMedicationByBrand(brandName, countryCode) {
    const where = {
        brandName: {
            contains: brandName,
            mode: 'insensitive',
        },
    };
    if (countryCode) {
        where.country = countryCode.toUpperCase();
    }
    return prisma.medicationReference.findMany({
        where,
        orderBy: { brandName: 'asc' },
    });
}
export async function searchMedicationGlobally(query) {
    const [byIngredient, byBrand] = await Promise.all([
        prisma.medicationReference.findMany({
            where: {
                ingredient: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            orderBy: { brandName: 'asc' },
            take: 50,
        }),
        prisma.medicationReference.findMany({
            where: {
                brandName: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            orderBy: { brandName: 'asc' },
            take: 50,
        }),
    ]);
    const seen = new Set();
    return [...byIngredient, ...byBrand].filter((r) => {
        const key = `${r.sourceType}-${r.sourceId}`;
        if (seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
}
//# sourceMappingURL=orchestrator.js.map