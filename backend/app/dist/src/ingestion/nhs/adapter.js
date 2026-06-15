import { prisma } from '../../lib/db.js';
import { createJob, updateJobProgress, failJob, completeJob } from '../jobs/service.js';
export async function ingestNHS(dataSourceId) {
    const jobId = await createJob(dataSourceId, 'NHS');
    const errors = [];
    try {
        await updateJobProgress(jobId, { status: 'RUNNING', progress: 10 });
        // NHS API requires API key registration
        // Placeholder for future implementation
        await updateJobProgress(jobId, { progress: 50 });
        // Mock data for phase 1
        const mockRecords = [
            { brandName: 'Calpol', ingredient: 'Paracetamol', country: 'GB' },
            { brandName: 'Nurofen', ingredient: 'Ibuprofen', country: 'GB' },
        ];
        let imported = 0;
        for (const record of mockRecords) {
            await prisma.medicationReference.upsert({
                where: {
                    sourceId_sourceType: {
                        sourceId: `nhs-mock-${record.brandName}`,
                        sourceType: 'NHS',
                    },
                },
                update: {
                    brandName: record.brandName,
                    ingredient: record.ingredient,
                    country: record.country,
                },
                create: {
                    sourceId: `nhs-mock-${record.brandName}`,
                    sourceType: 'NHS',
                    country: record.country,
                    brandName: record.brandName,
                    ingredient: record.ingredient,
                },
            });
            imported++;
        }
        await completeJob(jobId, imported, 0);
        return { sourceType: 'NHS', imported, failed: 0, errors };
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        await failJob(jobId, msg);
        errors.push(msg);
        return { sourceType: 'NHS', imported: 0, failed: 1, errors };
    }
}
//# sourceMappingURL=adapter.js.map