import { prisma } from '../../lib/db.js';
export async function createJob(dataSourceId, sourceType) {
    const job = await prisma.ingestionJob.create({
        data: {
            dataSourceId,
            sourceType,
            status: 'QUEUED',
        },
    });
    return job.id;
}
export async function updateJobProgress(jobId, data) {
    await prisma.ingestionJob.update({
        where: { id: jobId },
        data: {
            ...(data.status ? { status: data.status, startedAt: data.status === 'RUNNING' ? new Date() : undefined } : {}),
            ...(data.progress !== undefined ? { progress: data.progress } : {}),
        },
    });
}
export async function completeJob(jobId, recordsImported, recordsFailed) {
    await prisma.ingestionJob.update({
        where: { id: jobId },
        data: {
            status: 'COMPLETED',
            progress: 100,
            recordsImported,
            recordsFailed,
            completedAt: new Date(),
        },
    });
    // Update data source last sync time
    const job = await prisma.ingestionJob.findUnique({
        where: { id: jobId },
        include: { dataSource: true },
    });
    if (job?.dataSourceId) {
        await prisma.dataSource.update({
            where: { id: job.dataSourceId },
            data: { lastSyncAt: new Date() },
        });
    }
}
export async function failJob(jobId, error) {
    await prisma.ingestionJob.update({
        where: { id: jobId },
        data: {
            status: 'FAILED',
            error,
            completedAt: new Date(),
        },
    });
}
export async function getRecentJobs(limit = 20) {
    return prisma.ingestionJob.findMany({
        orderBy: { createdAt: 'desc' },
        take: limit,
        include: { dataSource: true },
    });
}
export async function getDataSourceStats() {
    const sources = await prisma.dataSource.findMany({
        include: {
            jobs: {
                orderBy: { createdAt: 'desc' },
                take: 1,
            },
        },
    });
    const totalReferences = await prisma.medicationReference.count();
    const countriesWithData = await prisma.medicationReference.groupBy({
        by: ['country'],
    });
    const totalJobs = await prisma.ingestionJob.count();
    const failedJobs = await prisma.ingestionJob.count({
        where: { status: 'FAILED' },
    });
    return {
        sources,
        totalReferences,
        countriesCovered: countriesWithData.map((c) => c.country),
        totalJobs,
        failedJobs,
    };
}
export async function ensureDataSources() {
    const { SOURCE_CONFIGS } = await import('../sources.js');
    for (const config of Object.values(SOURCE_CONFIGS)) {
        await prisma.dataSource.upsert({
            where: { id: config.sourceType },
            update: {
                name: config.name,
                country: config.country,
                sourceType: config.sourceType,
                active: config.active,
            },
            create: {
                id: config.sourceType,
                name: config.name,
                country: config.country,
                sourceType: config.sourceType,
                active: config.active,
            },
        });
    }
}
//# sourceMappingURL=service.js.map