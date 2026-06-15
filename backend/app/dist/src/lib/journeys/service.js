import { prisma } from '../db.js';
import { z } from 'zod';
export const CreateJourneySchema = z.object({
    userId: z.string(),
    sessionId: z.string().optional(),
    country: z.string(),
    city: z.string().optional(),
    symptoms: z.array(z.string()),
    severity: z.string(),
    recommendation: z.string(),
    medicationFound: z.boolean().optional(),
    medicationId: z.string().optional(),
    providerVisited: z.boolean().optional(),
    providerId: z.string().optional(),
    interpreterUsed: z.boolean().optional(),
    outcomeStatus: z.enum(['RECOVERED', 'IMPROVED', 'UNCHANGED', 'WORSENED']),
    recoveryTimeDays: z.number().int().optional(),
    notes: z.string().optional(),
});
export const UpdateJourneyOutcomeSchema = z.object({
    medicationFound: z.boolean().optional(),
    providerVisited: z.boolean().optional(),
    interpreterUsed: z.boolean().optional(),
    outcomeStatus: z.enum(['RECOVERED', 'IMPROVED', 'UNCHANGED', 'WORSENED']).optional(),
    recoveryTimeDays: z.number().int().optional(),
    notes: z.string().optional(),
});
export async function createJourney(input) {
    const data = CreateJourneySchema.parse(input);
    return prisma.healthcareJourney.create({
        data: {
            userId: data.userId,
            sessionId: data.sessionId,
            country: data.country,
            city: data.city,
            symptoms: data.symptoms,
            severity: data.severity,
            recommendation: data.recommendation,
            medicationFound: data.medicationFound ?? false,
            medicationId: data.medicationId,
            providerVisited: data.providerVisited ?? false,
            providerId: data.providerId,
            interpreterUsed: data.interpreterUsed ?? false,
            outcomeStatus: data.outcomeStatus,
            recoveryTimeDays: data.recoveryTimeDays,
            notes: data.notes,
        },
    });
}
export async function getUserJourneys(userId) {
    return prisma.healthcareJourney.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });
}
export async function getJourney(id) {
    return prisma.healthcareJourney.findUnique({ where: { id } });
}
export async function updateJourneyOutcome(id, input) {
    const data = UpdateJourneyOutcomeSchema.parse(input);
    return prisma.healthcareJourney.update({
        where: { id },
        data,
    });
}
export async function createJourneyFromSession(sessionId, userId) {
    const session = await prisma.travelHealthSession.findUnique({
        where: { id: sessionId },
        include: { country: true },
    });
    if (!session)
        throw new Error('Session not found');
    const symptoms = parseArr(session.symptoms);
    const severity = session.severity ?? 'SELF_CARE';
    const recommendation = severityToRecommendation(severity);
    const country = session.country?.name ?? session.location ?? 'Unknown';
    const city = session.location ?? undefined;
    return createJourney({
        userId,
        sessionId: session.id,
        country,
        city,
        symptoms,
        severity,
        recommendation,
        medicationFound: false,
        providerVisited: false,
        interpreterUsed: session.interpreterContext != null && session.interpreterContextTranslated != null,
        outcomeStatus: 'UNCHANGED',
    });
}
function parseArr(value) {
    if (Array.isArray(value))
        return value;
    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        }
        catch {
            return [];
        }
    }
    return [];
}
function severityToRecommendation(severity) {
    switch (severity) {
        case 'SELF_CARE': return 'SELF_CARE';
        case 'PHARMACY': return 'PHARMACY';
        case 'CLINIC': return 'CLINIC';
        case 'HOSPITAL': return 'CLINIC';
        case 'EMERGENCY': return 'EMERGENCY';
        default: return 'SELF_CARE';
    }
}
//# sourceMappingURL=service.js.map