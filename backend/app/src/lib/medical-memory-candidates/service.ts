import { prisma } from '../db.js';
import type { CandidateStatus, MemoryType, Prisma } from '@prisma/client';

export type CreateMemoryCandidateInput = {
  userId: string;
  sessionId?: string | null;
  memoryType: MemoryType;
  value: string;
  source?: string;
  confidence?: number;
  context?: string | null;
  status?: CandidateStatus;
};

function normalizeCandidateInput(m: CreateMemoryCandidateInput): Omit<
  Prisma.MemoryCandidateCreateManyInput,
  'userId' | 'memoryType' | 'value'
> {
  return {
    sessionId: m.sessionId ?? null,
    source: m.source ?? 'interpreter-extraction',
    confidence: m.confidence ?? 0,
    context: m.context ?? null,
    status: m.status ?? 'PENDING_REVIEW',
    reviewedBy: undefined,
    reviewedAt: undefined,
  };
}

export async function createCandidate(data: CreateMemoryCandidateInput) {
  return prisma.memoryCandidate.create({
    data: {
      userId: data.userId,
      sessionId: data.sessionId ?? null,
      memoryType: data.memoryType,
      value: data.value,
      source: data.source ?? 'interpreter-extraction',
      confidence: data.confidence ?? 0,
      context: data.context ?? null,
      status: data.status ?? 'PENDING_REVIEW',
    },
  });
}

export async function createCandidates(data: CreateMemoryCandidateInput[]) {
  if (data.length === 0) return { count: 0 };

  // createMany does not return rows; fetch count via transaction
  return prisma.memoryCandidate.createMany({
    data: data.map((m) => ({
      userId: m.userId,
      sessionId: m.sessionId ?? null,
      memoryType: m.memoryType,
      value: m.value,
      source: m.source ?? 'interpreter-extraction',
      confidence: m.confidence ?? 0,
      context: m.context ?? null,
      status: m.status ?? 'PENDING_REVIEW',
    })),
  });
}

export async function getUserCandidates(userId: string) {
  return prisma.memoryCandidate.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function approveCandidate(candidateId: string, reviewedByUserId: string) {
  return prisma.$transaction(async (tx) => {
    const candidate = await tx.memoryCandidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    // Ownership enforcement (security)
    if (candidate.userId !== reviewedByUserId) {
      throw new Error('Forbidden');
    }


    if (candidate.status === 'APPROVED') {
      return candidate;
    }

    const updatedCandidate = await tx.memoryCandidate.update({
      where: { id: candidateId },
      data: {
        status: 'APPROVED',
        reviewedBy: reviewedByUserId,
        reviewedAt: new Date(),
      },
    });

    const derivedSourceType = (() => {
      const src = (candidate.source ?? '').toLowerCase();
      if (src.startsWith('interpreter-session:')) return 'INTERPRETER_SESSION';
      if (src === 'manual') return 'MANUAL';
      if (src === 'memory-candidate-approved') return 'MEMORY_CANDIDATE_APPROVED';
      return 'UNKNOWN';
    })();

    // Create permanent memory (approval == verification)
    await tx.medicalMemory.create({
      data: {
        userId: candidate.userId,
        memoryType: candidate.memoryType,
        value: candidate.value,
        source: candidate.source ?? 'memory-candidate-approved',

        sourceType: derivedSourceType,
        sourceSessionId: candidate.sessionId ?? null,
        sourceDocumentId: null,
        confidence: candidate.confidence ?? null,

        verified: true,
        verifiedAt: new Date(),
        verifiedBy: reviewedByUserId,
      },
    });



    return updatedCandidate;
  });
}

export async function rejectCandidate(candidateId: string, reviewedByUserId: string) {
  return prisma.$transaction(async (tx) => {
    const candidate = await tx.memoryCandidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) {
      throw new Error('Candidate not found');
    }

    // Ownership enforcement (security)
    if (candidate.userId !== reviewedByUserId) {
      throw new Error('Forbidden');
    }

    if (candidate.status === 'REJECTED') {
      return candidate;
    }


    // Explicitly do NOT create MedicalMemory
    const updated = await tx.memoryCandidate.update({
      where: { id: candidateId },
      data: {
        status: 'REJECTED',
        reviewedBy: reviewedByUserId,
        reviewedAt: new Date(),
      },
    });

    return updated;
  });
}

