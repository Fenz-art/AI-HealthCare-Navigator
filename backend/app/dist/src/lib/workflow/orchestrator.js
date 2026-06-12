import { prisma } from '@/lib/db';
import { determineSeverity } from '@/lib/severity/engine';
import { extractActiveIngredients } from '@/lib/medications/extractor';
import { findLocalEquivalents } from '@/lib/medications/repository';
import { findNearbyProviders } from '@/lib/providers/geoapify';
import { buildInterpreterContext } from '@/lib/interpreter/builder';
import { getTargetLanguage, translateInterpreterContext } from '@/lib/interpreter/translator';
function severityToProviderType(severity) {
    switch (severity) {
        case 'PHARMACY':
            return 'PHARMACY';
        case 'CLINIC':
            return 'CLINIC';
        case 'HOSPITAL':
        case 'EMERGENCY':
            return 'HOSPITAL';
        default:
            return null;
    }
}
function severityToAction(severity) {
    switch (severity) {
        case 'SELF_CARE':
            return 'SELF_CARE';
        case 'EMERGENCY':
            return 'CALL_EMERGENCY_SERVICES';
        case 'PHARMACY':
            return 'PHARMACY';
        case 'CLINIC':
            return 'CLINIC';
        case 'HOSPITAL':
            return 'HOSPITAL';
        default:
            return 'CLINIC';
    }
}
function dedupeMedications(meds) {
    const seen = new Set();
    return meds.filter((med) => {
        const key = med?.brand?.id ?? med?.id;
        if (!key || seen.has(key))
            return false;
        seen.add(key);
        return true;
    });
}
export async function executeWorkflow(input) {
    const session = await prisma.travelHealthSession.findUnique({
        where: { id: input.sessionId },
        include: {
            country: true,
            user: {
                include: {
                    healthPassport: true,
                    healthDocuments: true,
                }
            }
        }
    });
    if (!session) {
        throw new Error('Session not found');
    }
    const countryCode = input.countryCode.toUpperCase();
    const severityResult = await determineSeverity(session.symptoms ?? [], session.duration ?? 'Unknown', session.allergies ?? [], session.currentMeds ?? []);
    const action = severityToAction(severityResult.severity);
    let medRecs = [];
    let providerRecs = [];
    if (severityResult.severity === 'PHARMACY') {
        const activeIngredients = await extractActiveIngredients(session.symptoms);
        for (const ingredient of activeIngredients) {
            const equivalents = await findLocalEquivalents(ingredient, countryCode);
            medRecs.push(...equivalents);
        }
        medRecs = dedupeMedications(medRecs);
        providerRecs = await findNearbyProviders(input.lat, input.lng, 'PHARMACY');
    }
    else if (severityResult.severity === 'CLINIC') {
        providerRecs = await findNearbyProviders(input.lat, input.lng, 'CLINIC');
    }
    else if (severityResult.severity === 'HOSPITAL' ||
        severityResult.severity === 'EMERGENCY') {
        providerRecs = await findNearbyProviders(input.lat, input.lng, 'HOSPITAL');
    }
    const sessionWithRecs = {
        ...session,
        severity: severityResult.severity,
        medRecs,
        providerRecs,
        location: session.location ?? undefined
    };
    const interpreterContext = buildInterpreterContext(sessionWithRecs, session.user?.healthPassport ?? null, session.user?.healthDocuments ?? []);
    const interpreterContextTranslated = await translateInterpreterContext(interpreterContext, countryCode);
    await prisma.travelHealthSession.update({
        where: { id: input.sessionId },
        data: {
            severity: severityResult.severity,
            lat: input.lat,
            lng: input.lng,
            medRecs: medRecs.length > 0 ? medRecs : undefined,
            providerRecs: providerRecs.length > 0 ? providerRecs : undefined,
            interpreterContext,
            interpreterContextTranslated,
            country: { connect: { code: countryCode } }
        }
    });
    return {
        sessionId: input.sessionId,
        severity: severityResult,
        action,
        medications: medRecs,
        providers: providerRecs,
        interpreterContext,
        interpreterContextTranslated,
        targetLanguage: getTargetLanguage(countryCode)
    };
}
export { severityToProviderType };
//# sourceMappingURL=orchestrator.js.map