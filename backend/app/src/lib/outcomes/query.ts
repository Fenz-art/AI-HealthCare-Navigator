import { prisma } from '../db.js';
import { normalizeMedicationName } from './normalization.js';

function avg(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

type CountSummary = { label: string; count: number };
type CountrySummary = { country: string; count: number };
type MedicationSummary = { medicationId: string; count: number };
type ConditionSummary = { condition: string; count: number };

function topCounts(values: string[], limit = 5): CountSummary[] {
  return Object.entries(
    values.reduce<Record<string, number>>((acc, value) => {
      const normalized = value.trim();
      if (!normalized) return acc;
      acc[normalized] = (acc[normalized] ?? 0) + 1;
      return acc;
    }, {})
  )
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
}

function topCountries(values: string[]): CountrySummary[] {
  return topCounts(values).map(({ label, count }) => ({ country: label, count }));
}

function topMedications(values: string[]): MedicationSummary[] {
  return topCounts(values).map(({ label, count }) => ({ medicationId: label, count }));
}

function topConditions(values: string[]): ConditionSummary[] {
  return topCounts(values).map(({ label, count }) => ({ condition: label, count }));
}

export async function getOutcomeInsightsByUser(userId: string) {
  return prisma.outcomeInsight.findMany({
    where: { userId },
    orderBy: { generatedAt: 'desc' },
    take: 200,
  });
}

export async function getOutcomeInsightsByJourney(journeyId: string) {
  return prisma.outcomeInsight.findMany({
    where: { journeyId },
    orderBy: { generatedAt: 'desc' },
    take: 200,
  });
}

export async function getOutcomeInsightsByCountry(country: string) {
  return prisma.outcomeInsight.findMany({
    where: { country },
    orderBy: { generatedAt: 'desc' },
    take: 200,
  });
}

export async function getMedicationOutcomesByMedication(medicationId: string) {
  const normalizedMedicationId = normalizeMedicationName(medicationId);
  if (!normalizedMedicationId) return [];

  return prisma.medicationOutcome.findMany({
    where: { medicationId: normalizedMedicationId },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });
}

export async function getProviderOutcome(providerId: string) {
  return prisma.providerOutcome.findUnique({ where: { providerId } });
}

export async function getUserOutcomeSummary(userId: string) {
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
    .filter((x): x is number => x != null);

  const topCountries = topCountries(journeys.map((j) => j.country));

  const interpreterUsageRate = journeys.length === 0
    ? 0
    : journeys.filter((j) => j.interpreterUsed).length / journeys.length;

  const medicationNames = journeys
    .map((j) => j.medicationId)
    .filter((value): value is string => typeof value === 'string')
    .map(normalizeMedicationName)
    .filter((value) => value.length > 0);

  const topMedications = topCounts(medicationNames);

  const topConditions = topCounts(
    journeys
      .map((j) => (Array.isArray(j.symptoms) && j.symptoms.length > 0 ? String(j.symptoms[0]) : ''))
  );

  return {
    journeys: journeys.length,
    avgRecoveryDays: avg(recoveryNumbers),
    interpreterUsageRate,
    topCountries,
    topConditions,
    topMedications,
  };
}

