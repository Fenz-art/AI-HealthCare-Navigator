import { prisma } from '../db.js';
import { z } from 'zod';
import { generateJourneyInsights } from './insights.js';
export const OutcomeSchema = z.object({
    receivedHelp: z.boolean(),
    purchasedMedication: z.boolean(),
    symptomsImproved: z.boolean(),
});
export async function recordOutcome(sessionId, data) {
    const payload = OutcomeSchema.parse(data);
    // outcome is stored as a JSON string in the Prisma schema (String? field)
    return prisma.travelHealthSession.update({
        where: { id: sessionId },
        data: { outcome: JSON.stringify(payload) },
    });
}
// Public Sprint 8 API (used by server routes after journey outcome updates)
export async function generateInsightsForJourney(journeyId) {
    return generateJourneyInsights(journeyId);
}
//# sourceMappingURL=service.js.map