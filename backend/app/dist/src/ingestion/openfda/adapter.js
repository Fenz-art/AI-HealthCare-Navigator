import { prisma } from '../../lib/db.js';
import { normalizeMedication } from '../normalizers/medication-normalizer.js';
import { createJob, updateJobProgress, failJob, completeJob } from '../jobs/service.js';
const OPENFDA_API = 'https://api.fda.gov/drug/label.json';
const BATCH_SIZE = 100;
const MAX_RECORDS = 1000;
export async function ingestOpenFDA(dataSourceId) {
    const jobId = await createJob(dataSourceId, 'OPENFDA');
    const errors = [];
    let imported = 0;
    let failed = 0;
    try {
        await updateJobProgress(jobId, { status: 'RUNNING', progress: 5 });
        const allRecords = [];
        let skip = 0;
        while (skip < MAX_RECORDS) {
            const url = `${OPENFDA_API}?limit=${BATCH_SIZE}&skip=${skip}`;
            const response = await fetch(url, {
                headers: { 'User-Agent': 'CareCompass/1.0' },
            });
            if (!response.ok) {
                errors.push(`OpenFDA API error: ${response.status} ${response.statusText}`);
                break;
            }
            const data = await response.json();
            if (data.error) {
                errors.push(`OpenFDA error: ${data.error.message}`);
                break;
            }
            const results = data.results ?? [];
            if (results.length === 0)
                break;
            for (const result of results) {
                const openfda = result.openfda;
                if (!openfda)
                    continue;
                const brandNames = openfda.brand_name ?? [];
                const genericNames = openfda.generic_name ?? [];
                const manufacturer = openfda.manufacturer_name?.[0];
                const routes = openfda.route ?? result.route ?? [];
                for (const brandName of brandNames) {
                    for (const genericName of genericNames) {
                        allRecords.push({
                            sourceId: `${brandName}|${genericName}|US`,
                            sourceType: 'OPENFDA',
                            country: 'US',
                            brandName,
                            ingredient: genericName,
                            route: routes[0],
                            manufacturer,
                            otc: openfda.product_type?.[0]?.toLowerCase().includes('otc') || undefined,
                            meta: {
                                routes,
                                productType: openfda.product_type?.[0],
                                effectiveTime: result.effective_time,
                            },
                        });
                    }
                }
            }
            skip += BATCH_SIZE;
            const progress = Math.min(5 + Math.floor((skip / MAX_RECORDS) * 85), 90);
            await updateJobProgress(jobId, { progress });
        }
        await updateJobProgress(jobId, { progress: 90 });
        for (const record of allRecords) {
            try {
                const normalized = normalizeMedication(record);
                await prisma.medicationReference.upsert({
                    where: {
                        sourceId_sourceType: {
                            sourceId: normalized.sourceId,
                            sourceType: normalized.sourceType,
                        },
                    },
                    update: {
                        brandName: normalized.brandName,
                        ingredient: normalized.ingredient,
                        strength: normalized.strength,
                        otc: normalized.otc,
                        route: normalized.route,
                        manufacturer: normalized.manufacturer,
                        meta: normalized.meta,
                    },
                    create: normalized,
                });
                imported++;
            }
            catch (err) {
                failed++;
                errors.push(`Failed to import ${record.brandName}: ${err instanceof Error ? err.message : 'unknown'}`);
            }
        }
        await completeJob(jobId, imported, failed);
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        await failJob(jobId, msg);
        errors.push(msg);
    }
    return { sourceType: 'OPENFDA', imported, failed, errors };
}
//# sourceMappingURL=adapter.js.map