import { prisma } from '../db.js';
import type { MemoryType } from '@prisma/client';

export async function addMemory(data: {
  userId: string;
  memoryType: MemoryType;
  value: string;
  source?: string;
  verified?: boolean;
}) {
  const memory = await prisma.medicalMemory.create({
    data: {
      userId: data.userId,
      memoryType: data.memoryType,
      value: data.value,
      source: data.source ?? 'extraction',
      verified: data.verified ?? false,
    },
  });

  await syncPassportFromMemory(data.userId);
  return memory;
}

export async function addMemories(data: {
  userId: string;
  memories: { memoryType: MemoryType; value: string; source?: string; verified?: boolean }[];
}) {
  const created = await prisma.medicalMemory.createMany({
    data: data.memories.map((m) => ({
      userId: data.userId,
      memoryType: m.memoryType,
      value: m.value,
      source: m.source ?? 'extraction',
      verified: m.verified ?? false,
    })),
  });

  await syncPassportFromMemory(data.userId);
  return created;
}

export async function getUserMemories(userId: string, memoryType?: MemoryType) {
  return prisma.medicalMemory.findMany({
    where: {
      userId,
      ...(memoryType ? { memoryType } : {}),
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getMemorySummary(userId: string) {
  const memories = await prisma.medicalMemory.findMany({
    where: { userId },
  });

  const summary: Record<string, string[]> = {};
  for (const m of memories) {
    const key = m.memoryType;
    if (!summary[key]) summary[key] = [];
    if (!summary[key].includes(m.value)) summary[key].push(m.value);
  }

  return {
    conditions: summary.CONDITION ?? [],
    medications: summary.MEDICATION ?? [],
    allergies: summary.ALLERGY ?? [],
    procedures: summary.PROCEDURE ?? [],
    vaccinations: summary.VACCINATION ?? [],
    insurance: summary.INSURANCE ?? [],
    emergencyContacts: summary.EMERGENCY_CONTACT ?? [],
    labResults: summary.LAB_RESULT ?? [],
    vitalSigns: summary.VITAL_SIGN ?? [],
  };
}

export async function deleteMemory(memoryId: string) {
  const memory = await prisma.medicalMemory.findUnique({ where: { id: memoryId } });
  if (!memory) return null;
  const deleted = await prisma.medicalMemory.delete({ where: { id: memoryId } });
  await syncPassportFromMemory(memory.userId);
  return deleted;
}

export async function verifyMemory(memoryId: string) {
  const memory = await prisma.medicalMemory.update({
    where: { id: memoryId },
    data: { verified: true },
  });
  await syncPassportFromMemory(memory.userId);
  return memory;
}

async function syncPassportFromMemory(userId: string) {
  const memories = await prisma.medicalMemory.findMany({ where: { userId } });

  const conditions = [...new Set(memories.filter((m) => m.memoryType === 'CONDITION').map((m) => m.value))];
  const medications = [...new Set(memories.filter((m) => m.memoryType === 'MEDICATION').map((m) => m.value))];
  const allergies = [...new Set(memories.filter((m) => m.memoryType === 'ALLERGY').map((m) => m.value))];
  const vaccinations = [...new Set(memories.filter((m) => m.memoryType === 'VACCINATION').map((m) => m.value))];
  const emergencyContacts = [...new Set(memories.filter((m) => m.memoryType === 'EMERGENCY_CONTACT').map((m) => m.value))];

  const passport = await prisma.healthPassport.findUnique({ where: { userId } });
  if (!passport) return null;

  const existingConditions = passport.chronicConditions ? JSON.parse(passport.chronicConditions) : [];
  const existingMeds = passport.currentMedications ? JSON.parse(passport.currentMedications) : [];
  const existingAllergies = passport.allergies ? JSON.parse(passport.allergies) : [];
  const existingVaccinations = passport.vaccinations ? JSON.parse(passport.vaccinations) : [];
  const existingContacts = passport.emergencyContacts ? JSON.parse(passport.emergencyContacts) : [];

  return prisma.healthPassport.update({
    where: { userId },
    data: {
      chronicConditions: JSON.stringify([...new Set([...existingConditions, ...conditions])]),
      currentMedications: JSON.stringify([...new Set([...existingMeds, ...medications])]),
      allergies: JSON.stringify([...new Set([...existingAllergies, ...allergies])]),
      vaccinations: JSON.stringify([...new Set([...existingVaccinations, ...vaccinations])]),
      emergencyContacts: JSON.stringify([...new Set([...existingContacts, ...emergencyContacts])]),
    },
  });
}
