import { prisma } from '../db.js';
export async function createInterpreterSession(data) {
    return prisma.interpreterSession.create({
        data: {
            patientId: data.patientId,
            providerId: data.providerId ?? null,
            sessionId: data.sessionId ?? null,
            conversationId: data.conversationId ?? null,
            sourceLanguage: data.sourceLanguage,
            targetLanguage: data.targetLanguage,
            mode: data.mode ?? 'bidirectional',
            active: true,
            transcript: [],
        },
    });
}
export async function getInterpreterSession(id) {
    return prisma.interpreterSession.findUnique({ where: { id } });
}
export async function addTranscriptEntry(id, entry) {
    const session = await prisma.interpreterSession.findUnique({ where: { id } });
    if (!session)
        throw new Error('Interpreter session not found');
    const transcript = session.transcript || [];
    transcript.push(entry);
    return prisma.interpreterSession.update({
        where: { id },
        data: { transcript: transcript },
    });
}
export async function endInterpreterSession(id) {
    const session = await prisma.interpreterSession.findUnique({ where: { id } });
    if (!session)
        throw new Error('Interpreter session not found');
    const startedAt = new Date(session.startedAt).getTime();
    const endedAt = Date.now();
    const durationSeconds = Math.round((endedAt - startedAt) / 1000);
    return prisma.interpreterSession.update({
        where: { id },
        data: {
            active: false,
            endedAt: new Date(),
            durationSeconds,
        },
    });
}
export async function getUserInterpreterSessions(userId) {
    return prisma.interpreterSession.findMany({
        where: {
            OR: [{ patientId: userId }, { providerId: userId }],
        },
        orderBy: { startedAt: 'desc' },
    });
}
export async function getActiveSessionsByPatient(patientId) {
    return prisma.interpreterSession.findMany({
        where: { patientId, active: true },
        orderBy: { startedAt: 'desc' },
    });
}
//# sourceMappingURL=session-service.js.map