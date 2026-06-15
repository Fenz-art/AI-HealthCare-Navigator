import { prisma } from '../db.js';
function avg(values) {
    if (values.length === 0)
        return null;
    return values.reduce((a, b) => a + b, 0) / values.length;
}
export async function getOutcomeInsightsByUser(userId) {
    return prisma.outcomeInsight.findMany({
        where: { userId },
        orderBy: { generatedAt: 'desc' },
        take: 200,
    });
}
export async function getOutcomeInsightsByJourney(journeyId) {
    return prisma.outcomeInsight.findMany({
        where: { journeyId },
        orderBy: { generatedAt: 'desc' },
        take: 200,
    });
}
export async function getOutcomeInsightsByCountry(country) {
    return prisma.outcomeInsight.findMany({
        where: { country },
        orderBy: { generatedAt: 'desc' },
        take: 200,
    });
}
export async function getMedicationOutcomesByMedication(medicationId) {
    return prisma.medicationOutcome.findMany({
        where: { medicationId },
        orderBy: { createdAt: 'desc' },
        take: 200,
    });
}
export async function getProviderOutcome(providerId) {
    return prisma.providerOutcome.findUnique({ where: { providerId } });
}
export async function getUserOutcomeSummary(userId) {
    const journeys = await prisma.healthcareJourney.findMany({
        where: { userId },
        select: {
            country: true,
            medicationId: true,
            providerId: true,
            interpreterUsed: true,
            outcomeStatus: true,
            recoveryTimeDays: true,
            severity: true,
            symptoms: true,
        },
    });
    const recoveryNumbers = journeys
        .map((j) => j.recoveryTimeDays)
        .filter((x) => x != null);
    const topCountries = Object.entries(journeys.reduce((acc, j) => {
        acc[j.country] = (acc[j.country] ?? 0) + 1;
        return acc;
    }, {}))
        .map(([country, count]) => ({ country, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    const interpreterUsage = journeys.length === 0
        ? 0
        : journeys.filter((j) => j.interpreterUsed).length / journeys.length;
    const topMedications = Object.entries(journeys.reduce((acc, j) => {
        if (!j.medicationId)
            return acc;
        acc[j.medicationId] = (acc[j.medicationId] ?? 0) + 1;
        return acc;
    }, {}))
        .map(([medicationId, count]) => ({ medicationId, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    // No diagnosis column exists; return top observed symptoms token as a proxy.
    const topConditions = Object.entries(journeys.reduce((acc, j) => {
        const sym = Array.isArray(j.symptoms) && j.symptoms.length > 0 ? String(j.symptoms[0]) : null;
        if (!sym)
            return acc;
        acc[sym] = (acc[sym] ?? 0) + 1;
        return acc;
    }, {}))
        .map(([condition, count]) => ({ condition, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    return {
        journeys: journeys.length,
        avgRecoveryDays: avg(recoveryNumbers),
        interpreterUsage,
        topCountries,
        topConditions,
        topMedications,
    };
}
//# sourceMappingURL=query.js.map