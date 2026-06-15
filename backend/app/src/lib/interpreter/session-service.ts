import { prisma } from '../db.js';
import type { Prisma } from '@prisma/client';

export type TranscriptEntry = {
  role: 'patient' | 'provider' | 'system';
  originalText: string;
  translatedText: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: string;
};

export async function createInterpreterSession(data: {
  patientId: string;
  providerId?: string;
  sessionId?: string;
  conversationId?: string;
  sourceLanguage: string;
  targetLanguage: string;
  mode?: string;
}) {
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

export async function getInterpreterSession(id: string) {
  return prisma.interpreterSession.findUnique({ where: { id } });
}

export async function addTranscriptEntry(
  id: string,
  entry: TranscriptEntry
) {
  const session = await prisma.interpreterSession.findUnique({ where: { id } });
  if (!session) throw new Error('Interpreter session not found');

  const transcript = (session.transcript as TranscriptEntry[]) || [];
  transcript.push(entry);

  return prisma.interpreterSession.update({
    where: { id },
    data: { transcript: transcript as any },
  });
}

export async function endInterpreterSession(id: string) {
  const session = await prisma.interpreterSession.findUnique({ where: { id } });
  if (!session) throw new Error('Interpreter session not found');

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

export async function getUserInterpreterSessions(userId: string) {
  return prisma.interpreterSession.findMany({
    where: {
      OR: [{ patientId: userId }, { providerId: userId }],
    },
    orderBy: { startedAt: 'desc' },
  });
}

export async function getActiveSessionsByPatient(patientId: string) {
  return prisma.interpreterSession.findMany({
    where: { patientId, active: true },
    orderBy: { startedAt: 'desc' },
  });
}
