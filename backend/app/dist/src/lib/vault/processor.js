import { prisma } from '../db.js';
import { model } from '../ai/gemini.js';
import { translateAndExtractDocument } from './translator.js';
import { addMemories } from '../health-memory/service.js';
const PIPELINE_STEPS = ['STORING', 'OCR', 'DETECTING_LANGUAGE', 'TRANSLATING', 'EXTRACTING', 'UPDATING_MEMORY', 'UPDATING_PASSPORT'];
async function createProcessingJob(documentId) {
    return prisma.documentProcessingJob.create({
        data: {
            documentId,
            status: 'RUNNING',
            currentStep: 'STORING',
            progress: 0,
            startedAt: new Date(),
        },
    });
}
async function updateJobStep(jobId, step, progress) {
    return prisma.documentProcessingJob.update({
        where: { id: jobId },
        data: { currentStep: step, progress },
    });
}
async function completeJob(jobId) {
    return prisma.documentProcessingJob.update({
        where: { id: jobId },
        data: { status: 'COMPLETED', progress: 100, completedAt: new Date() },
    });
}
async function failJob(jobId, error) {
    return prisma.documentProcessingJob.update({
        where: { id: jobId },
        data: { status: 'FAILED', error, completedAt: new Date() },
    });
}
export async function processDocumentPipeline(data) {
    const document = await prisma.healthDocument.create({
        data: {
            userId: data.userId,
            title: data.title,
            type: data.type,
            sourceCountry: data.sourceCountry ?? null,
            originalLanguage: data.originalLanguage,
            fileUrl: data.storageUrl ?? '',
            storageUrl: data.storageUrl ?? null,
            extractedText: data.extractedText,
            processingStatus: 'PENDING',
        },
    });
    const job = await createProcessingJob(document.id);
    const result = { document, job, translation: null, extraction: null, memories: null, passport: null };
    try {
        await updateJobStep(job.id, 'STORING', 10);
        await prisma.healthDocument.update({
            where: { id: document.id },
            data: { processingStatus: 'STORING' },
        });
        await updateJobStep(job.id, 'OCR', 20);
        await prisma.healthDocument.update({
            where: { id: document.id },
            data: { processingStatus: 'OCR' },
        });
        await updateJobStep(job.id, 'DETECTING_LANGUAGE', 30);
        const detectedLanguage = await detectLanguage(data.extractedText, data.originalLanguage);
        await updateJobStep(job.id, 'TRANSLATING', 50);
        await prisma.healthDocument.update({
            where: { id: document.id },
            data: { processingStatus: 'TRANSLATING' },
        });
        const translation = data.originalLanguage !== 'en'
            ? await translateAndExtractDocument(data.extractedText, data.originalLanguage)
            : { englishTranslation: data.extractedText, extractedCleanText: data.extractedText };
        await prisma.healthDocument.update({
            where: { id: document.id },
            data: {
                translatedText: translation.englishTranslation,
                extractedText: translation.extractedCleanText,
                processingStatus: 'EXTRACTING',
            },
        });
        result.translation = translation;
        await updateJobStep(job.id, 'EXTRACTING', 70);
        const extraction = await extractStructuredData(document.id, translation.englishTranslation, detectedLanguage);
        result.extraction = extraction;
        await updateJobStep(job.id, 'UPDATING_MEMORY', 85);
        await prisma.healthDocument.update({
            where: { id: document.id },
            data: { processingStatus: 'UPDATING_MEMORY' },
        });
        const memories = await seedMedicalMemory(data.userId, document.id, extraction, translation.englishTranslation, detectedLanguage);
        result.memories = memories;
        await updateJobStep(job.id, 'UPDATING_PASSPORT', 95);
        await prisma.healthDocument.update({
            where: { id: document.id },
            data: { processingStatus: 'UPDATING_PASSPORT' },
        });
        await completeJob(job.id);
        await prisma.healthDocument.update({
            where: { id: document.id },
            data: { processingStatus: 'COMPLETED' },
        });
        return {
            ...result,
            document: await prisma.healthDocument.findUnique({
                where: { id: document.id },
                include: { extraction: true, processingJobs: true },
            }),
        };
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Pipeline processing failed';
        await failJob(job.id, msg);
        await prisma.healthDocument.update({
            where: { id: document.id },
            data: { processingStatus: 'FAILED' },
        });
        throw error;
    }
}
async function detectLanguage(text, hint) {
    if (hint && hint !== 'unknown' && hint !== 'auto')
        return hint;
    try {
        const prompt = `Identify the language of the following text. Return ONLY the ISO 639-1 language code (e.g., "en", "vi", "ja", "es", "fr", "de", "zh", "ar", "hi", "pt", "ko", "th"). If uncertain, return "en".

Text:
${text.slice(0, 500)}`;
        const result = await model.generateContent(prompt);
        return result.response.text().trim().toLowerCase().slice(0, 2) || 'en';
    }
    catch {
        return 'en';
    }
}
async function extractStructuredData(documentId, text, language) {
    const prompt = `Extract structured medical data from the following text. Return ONLY valid JSON:
{
  "conditions": [{ "name": "string", "date": "string or null", "notes": "string or null" }],
  "medications": [{ "name": "string", "dosage": "string or null", "frequency": "string or null", "route": "string or null" }],
  "allergies": [{ "allergen": "string", "reaction": "string or null", "severity": "string or null" }],
  "procedures": [{ "name": "string", "date": "string or null", "provider": "string or null", "notes": "string or null" }],
  "vaccinations": [{ "name": "string", "date": "string or null", "provider": "string or null" }],
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
    }
    catch (error) {
        console.error('Structured extraction error:', error);
        return null;
    }
}
async function seedMedicalMemory(userId, documentId, extraction, translatedText, language) {
    if (!extraction)
        return null;
    const memories = [];
    try {
        const conditions = extraction.conditions ? JSON.parse(extraction.conditions) : [];
        for (const c of conditions) {
            if (c.name) {
                memories.push({ memoryType: 'CONDITION', value: c.name, source: `doc:${documentId}`, verified: false });
                await createEntity(userId, 'CONDITION', c.name, 0.85, documentId, language);
            }
        }
        const medications = extraction.medications ? JSON.parse(extraction.medications) : [];
        for (const m of medications) {
            if (m.name) {
                const val = m.dosage ? `${m.name} ${m.dosage}` : m.name;
                memories.push({ memoryType: 'MEDICATION', value: val, source: `doc:${documentId}`, verified: false });
                await createEntity(userId, 'MEDICATION', val, 0.85, documentId, language);
            }
        }
        const allergies = extraction.allergies ? JSON.parse(extraction.allergies) : [];
        for (const a of allergies) {
            if (a.allergen) {
                memories.push({ memoryType: 'ALLERGY', value: a.allergen, source: `doc:${documentId}`, verified: false });
                await createEntity(userId, 'ALLERGY', a.allergen, 0.85, documentId, language);
            }
        }
        const procedures = extraction.procedures ? JSON.parse(extraction.procedures) : [];
        for (const p of procedures) {
            if (p.name) {
                memories.push({ memoryType: 'PROCEDURE', value: p.name, source: `doc:${documentId}`, verified: false });
                await createEntity(userId, 'PROCEDURE', p.name, 0.85, documentId, language);
            }
        }
        const vaccinations = extraction.vaccinations ? JSON.parse(extraction.vaccinations) : [];
        for (const v of vaccinations) {
            if (v.name) {
                memories.push({ memoryType: 'VACCINATION', value: v.name, source: `doc:${documentId}`, verified: false });
                await createEntity(userId, 'VACCINATION', v.name, 0.85, documentId, language);
            }
        }
        const insuranceMeta = extraction.insuranceMeta ? JSON.parse(extraction.insuranceMeta) : {};
        if (insuranceMeta.provider) {
            memories.push({ memoryType: 'INSURANCE', value: insuranceMeta.provider, source: `doc:${documentId}`, verified: false });
            await createEntity(userId, 'INSURANCE', insuranceMeta.provider, 0.85, documentId, language);
        }
        const labResults = extraction.labResults ? JSON.parse(extraction.labResults) : [];
        for (const l of labResults) {
            if (l.test && l.value) {
                memories.push({ memoryType: 'LAB_RESULT', value: `${l.test}: ${l.value}${l.unit ? ' ' + l.unit : ''}`, source: `doc:${documentId}`, verified: false });
            }
        }
        if (extraction.vitalSigns) {
            const vs = JSON.parse(extraction.vitalSigns);
            for (const [key, val] of Object.entries(vs)) {
                if (val) {
                    memories.push({ memoryType: 'VITAL_SIGN', value: `${key}: ${val}`, source: `doc:${documentId}`, verified: false });
                }
            }
        }
    }
    catch { }
    if (memories.length > 0) {
        await addMemories({ userId, memories });
    }
    return memories;
}
async function createEntity(userId, entityType, value, confidence, documentId, language) {
    try {
        await prisma.extractedMedicalEntity.create({
            data: {
                userId,
                entityType: entityType,
                value,
                confidence,
                sourceDocId: documentId,
                language,
            },
        });
    }
    catch { }
}
//# sourceMappingURL=processor.js.map