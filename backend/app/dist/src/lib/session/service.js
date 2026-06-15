import { prisma } from '../db.js';
import { getTargetLanguage } from '../interpreter/translator.js';
import { generateCaseId } from './case-id.js';
// Helper — Prisma schema stores arrays as JSON strings
function toJsonStr(value) {
    return JSON.stringify(value ?? []);
}
// Helper — parse a stored JSON string back to array, gracefully
function fromJsonStr(value) {
    if (!value)
        return [];
    try {
        return JSON.parse(value);
    }
    catch {
        return [];
    }
}
export async function createTravelHealthSession(input) {
    const data = {
        caseId: generateCaseId(),
        symptoms: toJsonStr(input.symptoms),
        duration: input.duration,
        allergies: toJsonStr(input.allergies),
        currentMeds: toJsonStr(input.currentMeds),
        includedPassport: input.includedPassport ?? false,
        includedDocuments: input.includedDocuments && input.includedDocuments.length > 0
            ? toJsonStr(input.includedDocuments)
            : undefined,
        lat: input.lat,
        lng: input.lng,
    };
    if (input.userId)
        data.userId = input.userId;
    if (input.location)
        data.location = input.location;
    if (input.countryCode)
        data.country = { connect: { code: input.countryCode.toUpperCase() } };
    return prisma.travelHealthSession.create({ data });
}
export async function getTravelHealthSession(sessionId) {
    const session = await prisma.travelHealthSession.findUnique({
        where: { id: sessionId },
        include: { country: true },
    });
    if (!session)
        return null;
    const countryCode = session.country?.code ?? null;
    // Deserialise JSON-string fields back to arrays for the API response
    return {
        ...session,
        symptoms: fromJsonStr(session.symptoms),
        allergies: fromJsonStr(session.allergies),
        currentMeds: fromJsonStr(session.currentMeds),
        includedDocuments: fromJsonStr(session.includedDocuments),
        medRecs: fromJsonStr(session.medRecs),
        providerRecs: fromJsonStr(session.providerRecs),
        outcome: session.outcome ? JSON.parse(session.outcome) : null,
        countryCode,
        targetLanguage: countryCode ? getTargetLanguage(countryCode) : 'English',
    };
}
//# sourceMappingURL=service.js.map