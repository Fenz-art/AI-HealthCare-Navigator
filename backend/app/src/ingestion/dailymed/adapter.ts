import { prisma } from '../../lib/db.js';
import { IngestionResult } from '../sources.js';
import { normalizeMedication, RawMedicationRecord } from '../normalizers/medication-normalizer.js';
import { createJob, updateJobProgress, failJob, completeJob } from '../jobs/service.js';

const DAILYMED_BASE = 'https://dailymed.nlm.nih.gov/dailymed/services/v2';
const BATCH_SIZE = 50;
const MAX_PAGES = 5;

interface DailyMedSpl {
  setid: string;
  title?: string;
  manufacturer?: string;
}

export async function ingestDailyMed(dataSourceId: string): Promise<IngestionResult> {
  const jobId = await createJob(dataSourceId, 'DAILYMED');
  const errors: string[] = [];
  let imported = 0;
  let failed = 0;

  try {
    await updateJobProgress(jobId, { status: 'RUNNING', progress: 5 });

    const allRecords: RawMedicationRecord[] = [];
    let page = 0;

    while (page < MAX_PAGES) {
      const url = `${DAILYMED_BASE}/spls?page=${page + 1}&pagesize=${BATCH_SIZE}`;

      const response = await fetch(url, {
        headers: { 'User-Agent': 'CareCompass/1.0' },
      });

      if (!response.ok) {
        errors.push(`DailyMed API error: ${response.status}`);
        break;
      }

      const data = await response.json() as {
        data?: DailyMedSpl[];
        metadata?: { total?: number };
      };

      const results = data.data ?? [];
      if (results.length === 0) break;

      for (const spl of results) {
        try {
          const detailUrl = `${DAILYMED_BASE}/spls/${spl.setid}.json`;
          const detailResponse = await fetch(detailUrl, {
            headers: { 'User-Agent': 'CareCompass/1.0' },
          });

          if (!detailResponse.ok) continue;

          const detail = await detailResponse.json() as Record<string, unknown>;

          const ingredients = extractIngredients(detail);
          const brandName = extractBrandName(detail) || spl.title || 'Unknown';
          const manufacturer = spl.manufacturer || extractManufacturer(detail);

          for (const ingredient of ingredients) {
            allRecords.push({
              sourceId: spl.setid,
              sourceType: 'DAILYMED',
              country: 'US',
              brandName,
              ingredient: ingredient.name,
              strength: ingredient.strength ?? undefined,
              route: extractRoute(detail) ?? undefined,
              manufacturer: manufacturer ?? undefined,
              meta: { title: spl.title, setid: spl.setid },
            });
          }
        } catch {
          failed++;
          errors.push(`Failed to process SPL ${spl.setid}`);
        }
      }

      page++;

      const progress = Math.min(5 + Math.floor((page / MAX_PAGES) * 85), 90);
      await updateJobProgress(jobId, { progress });
    }

    await updateJobProgress(jobId, { progress: 90 });

    for (const record of allRecords) {
      try {
        const normalized = normalizeMedication(record);
        await prisma.medicationReference.upsert({
          where: {
            sourceId_sourceType: {
              sourceId: normalized.sourceId,
              sourceType: normalized.sourceType,
            },
          },
          update: {
            brandName: normalized.brandName,
            ingredient: normalized.ingredient,
            strength: normalized.strength,
            route: normalized.route,
            manufacturer: normalized.manufacturer,
            meta: normalized.meta,
          },
          create: normalized,
        });
        imported++;
      } catch {
        failed++;
      }
    }

    await completeJob(jobId, imported, failed);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    await failJob(jobId, msg);
    errors.push(msg);
  }

  return { sourceType: 'DAILYMED', imported, failed, errors };
}

function extractIngredients(detail: Record<string, unknown>): { name: string; strength?: string }[] {
  try {
    const sections = detail as Record<string, unknown[]>;
    const activeIngredients = sections['ACTIVE_INGREDIENT'] ?? [];
    return activeIngredients.map((ing: unknown) => {
      const ingRecord = ing as Record<string, string>;
      return {
        name: ingRecord['ACTIVE_INGREDIENT_NAME'] ?? ingRecord['SUBSTANCE_NAME'] ?? 'Unknown',
        strength: ingRecord['ACTIVE_INGREDIENT_STRENGTH'],
      };
    });
  } catch {
    return [{ name: 'Unknown' }];
  }
}

function extractBrandName(detail: Record<string, unknown>): string | null {
  try {
    const props = detail as Record<string, unknown[]>;
    const prop = props['PROPRIETARYNAME']?.[0];
    if (typeof prop === 'string') return prop;
    if (prop && typeof prop === 'object') {
      return (prop as Record<string, string>)['PROPRIETARYNAME'] ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

function extractManufacturer(detail: Record<string, unknown>): string | null {
  try {
    const props = detail as Record<string, unknown[]>;
    const prop = props['LABELER_NAME']?.[0];
    if (typeof prop === 'string') return prop;
    return null;
  } catch {
    return null;
  }
}

function extractRoute(detail: Record<string, unknown>): string | null {
  try {
    const props = detail as Record<string, unknown[]>;
    const route = props['ROUTE']?.[0];
    if (typeof route === 'string') return route;
    return null;
  } catch {
    return null;
  }
}
