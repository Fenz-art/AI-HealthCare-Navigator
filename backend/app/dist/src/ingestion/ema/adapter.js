import { prisma } from '../../lib/db.js';
import { createJob, updateJobProgress, failJob, completeJob } from '../jobs/service.js';
export async function ingestEMA(dataSourceId) {
    const jobId = await createJob(dataSourceId, 'EMA');
    const errors = [];
    try {
        await updateJobProgress(jobId, { status: 'RUNNING', progress: 10 });
        // EMA API integration placeholder
        // The EMA API requires registration and API keys
        // Placeholder for future implementation
        await updateJobProgress(jobId, { progress: 50 });
        // Mock import for phase 1
        const mockRecords = [
            { brandName: 'Doliprane', ingredient: 'Paracetamol', country: 'FR' },
            { brandName: 'Panadol', ingredient: 'Paracetamol', country: 'DE' },
            { brandName: 'Aspirina', ingredient: 'Acetylsalicylic acid', country: 'IT' },
        ];
        let imported = 0;
        for (const record of mockRecords) {
            await prisma.medicationReference.upsert({
                where: {
                    sourceId_sourceType: {
                        sourceId: `ema-mock-${record.brandName}`,
                        sourceType: 'EMA',
                    },
                },
                update: {
                    brandName: record.brandName,
                    ingredient: record.ingredient,
                    country: record.country,
                },
                create: {
                    sourceId: `ema-mock-${record.brandName}`,
                    sourceType: 'EMA',
                    country: record.country,
                    brandName: record.brandName,
                    ingredient: record.ingredient,
                },
            });
            imported++;
        }
        await completeJob(jobId, imported, 0);
        return { sourceType: 'EMA', imported, failed: 0, errors };
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        await failJob(jobId, msg);
        errors.push(msg);
        return { sourceType: 'EMA', imported: 0, failed: 1, errors };
    }
}
//# sourceMappingURL=adapter.js.map