import { prisma } from '../db.js';
import { model } from '../ai/gemini.js';
import { translateAndExtractDocument } from './translator.js';

export async function processDocumentUpload(data: {
  userId: string;
  title: string;
  type: string;
  sourceCountry?: string;
  originalLanguage: string;
  extractedText: string;
}) {
  const translationResult = await translateAndExtractDocument(data.extractedText, data.originalLanguage);

  const document = await prisma.healthDocument.create({
    data: {
      userId: data.userId,
      title: data.title,
      type: data.type,
      sourceCountry: data.sourceCountry ?? null,
      originalLanguage: data.originalLanguage,
      fileUrl: '',
      extractedText: translationResult.extractedCleanText,
      translatedText: translationResult.englishTranslation,
    },
  });

  const extraction = await extractStructuredData(document.id, translationResult.englishTranslation);

  return { document, extraction };
}

async function extractStructuredData(documentId: string, text: string) {
  const prompt = `Extract structured medical data from the following text. Return ONLY valid JSON:
{
  "conditions": [{ "name": "string", "date": "string or null", "notes": "string or null" }],
  "medications": [{ "name": "string", "dosage": "string or null", "frequency": "string or null", "route": "string or null" }],
  "allergies": [{ "allergen": "string", "reaction": "string or null", "severity": "string or null" }],
  "procedures": [{ "name": "string", "date": "string or null", "provider": "string or null", "notes": "string or null" }],
  "insuranceMeta": { "provider": "string or null", "policyNumber": "string or null", "groupNumber": "string or null", "expiry": "string or null" },
  "vitalSigns": { "bloodPressure": "string or null", "heartRate": "string or null", "temperature": "string or null", "respiratoryRate": "string or null" },
  "labResults": [{ "test": "string", "value": "string", "unit": "string or null", "referenceRange": "string or null", "date": "string or null" }]
}

If no data is found for a field, use empty array or null.

Text:
${text}`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    const cleaned = response.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return prisma.medicalExtraction.upsert({
      where: { documentId },
      update: {
        conditions: JSON.stringify(parsed.conditions ?? []),
        medications: JSON.stringify(parsed.medications ?? []),
        allergies: JSON.stringify(parsed.allergies ?? []),
        procedures: JSON.stringify(parsed.procedures ?? []),
        insuranceMeta: JSON.stringify(parsed.insuranceMeta ?? {}),
        vitalSigns: JSON.stringify(parsed.vitalSigns ?? {}),
        labResults: JSON.stringify(parsed.labResults ?? []),
      },
      create: {
        documentId,
        conditions: JSON.stringify(parsed.conditions ?? []),
        medications: JSON.stringify(parsed.medications ?? []),
        allergies: JSON.stringify(parsed.allergies ?? []),
        procedures: JSON.stringify(parsed.procedures ?? []),
        insuranceMeta: JSON.stringify(parsed.insuranceMeta ?? {}),
        vitalSigns: JSON.stringify(parsed.vitalSigns ?? {}),
        labResults: JSON.stringify(parsed.labResults ?? []),
      },
    });
  } catch (error) {
    console.error('Structured extraction error:', error);
    return null;
  }
}

export async function getDocumentWithExtraction(documentId: string) {
  return prisma.healthDocument.findUnique({
    where: { id: documentId },
    include: { extraction: true },
  });
}

export async function getUserVaultWithExtraction(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      healthPassport: true,
      healthDocuments: { include: { extraction: true } },
    },
  });
}

export async function updatePassportFromExtractions(userId: string) {
  const extractions = await prisma.medicalExtraction.findMany({
    where: { document: { userId } },
  });

  const allConditions: string[] = [];
  const allMedications: string[] = [];
  const allAllergies: string[] = [];
  const allProcedures: string[] = [];

  for (const ext of extractions) {
    try {
      if (ext.conditions) {
        const conditions = JSON.parse(ext.conditions);
        conditions.forEach((c: { name: string }) => {
          if (c.name && !allConditions.includes(c.name)) allConditions.push(c.name);
        });
      }
      if (ext.medications) {
        const meds = JSON.parse(ext.medications);
        meds.forEach((m: { name: string }) => {
          if (m.name && !allMedications.includes(m.name)) allMedications.push(m.name);
        });
      }
      if (ext.allergies) {
        const allergies = JSON.parse(ext.allergies);
        allergies.forEach((a: { allergen: string }) => {
          if (a.allergen && !allAllergies.includes(a.allergen)) allAllergies.push(a.allergen);
        });
      }
      if (ext.procedures) {
        const procedures = JSON.parse(ext.procedures);
        procedures.forEach((p: { name: string }) => {
          if (p.name && !allProcedures.includes(p.name)) allProcedures.push(p.name);
        });
      }
    } catch { }
  }

  const passport = await prisma.healthPassport.findUnique({ where: { userId } });
  if (!passport) return null;

  const existingConditions = passport.chronicConditions ? JSON.parse(passport.chronicConditions) : [];
  const existingMeds = passport.currentMedications ? JSON.parse(passport.currentMedications) : [];
  const existingAllergies = passport.allergies ? JSON.parse(passport.allergies) : [];

  const mergedConditions = [...new Set([...existingConditions, ...allConditions])];
  const mergedMeds = [...new Set([...existingMeds, ...allMedications])];
  const mergedAllergies = [...new Set([...existingAllergies, ...allAllergies])];

  return prisma.healthPassport.update({
    where: { userId },
    data: {
      chronicConditions: JSON.stringify(mergedConditions),
      currentMedications: JSON.stringify(mergedMeds),
      allergies: JSON.stringify(mergedAllergies),
    },
  });
}
