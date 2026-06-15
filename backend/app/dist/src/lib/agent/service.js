import { prisma } from '../db.js';
import { model } from '../ai/gemini.js';
import { translateAndExtractDocument } from '../vault/translator.js';
import { addMemories, getMemorySummary } from '../health-memory/service.js';
export async function createTask(data) {
    return prisma.agentTask.create({
        data: {
            userId: data.userId,
            type: data.type,
            title: data.title,
            description: data.description ?? null,
            input: data.input ? JSON.stringify(data.input) : null,
            documentId: data.documentId ?? null,
        },
    });
}
export async function getTask(taskId) {
    return prisma.agentTask.findUnique({ where: { id: taskId } });
}
export async function getTaskWithDocument(taskId) {
    return prisma.agentTask.findUnique({
        where: { id: taskId },
        include: { document: { include: { extraction: true } } },
    });
}
export async function getUserTasks(userId, options) {
    return prisma.agentTask.findMany({
        where: {
            userId,
            ...(options?.status ? { status: options.status } : {}),
        },
        orderBy: { createdAt: 'desc' },
        take: options?.limit ?? 50,
    });
}
export async function getAllUserTasksByStatus(userId) {
    const tasks = await prisma.agentTask.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 100,
    });
    return {
        running: tasks.filter((t) => t.status === 'PROCESSING'),
        queued: tasks.filter((t) => t.status === 'PENDING'),
        completed: tasks.filter((t) => t.status === 'COMPLETED'),
        failed: tasks.filter((t) => t.status === 'FAILED'),
        cancelled: tasks.filter((t) => t.status === 'CANCELLED'),
        all: tasks,
    };
}
export async function updateTaskProgress(taskId, data) {
    return prisma.agentTask.update({
        where: { id: taskId },
        data: {
            ...(data.progress !== undefined ? { progress: data.progress } : {}),
            ...(data.status ? { status: data.status } : {}),
            ...(data.output ? { output: JSON.stringify(data.output) } : {}),
            ...(data.error ? { error: data.error } : {}),
        },
    });
}
export async function executeTranslateDocumentTask(taskId) {
    const task = await prisma.agentTask.findUnique({
        where: { id: taskId },
        include: { document: true },
    });
    if (!task || !task.document)
        throw new Error('Task or document not found');
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const doc = task.document;
    const sourceText = doc.extractedText || '';
    const sourceLang = doc.originalLanguage || 'unknown';
    await updateTaskProgress(taskId, { progress: 30 });
    const result = await translateAndExtractDocument(sourceText, sourceLang);
    await updateTaskProgress(taskId, { progress: 70 });
    await prisma.healthDocument.update({
        where: { id: doc.id },
        data: {
            translatedText: result.englishTranslation,
            extractedText: result.extractedCleanText,
        },
    });
    await updateTaskProgress(taskId, {
        progress: 100,
        status: 'COMPLETED',
        output: {
            englishTranslation: result.englishTranslation,
            extractedCleanText: result.extractedCleanText,
            documentId: doc.id,
        },
    });
}
export async function executeExtractMedicalDataTask(taskId) {
    const task = await prisma.agentTask.findUnique({
        where: { id: taskId },
        include: { document: true },
    });
    if (!task || !task.document)
        throw new Error('Task or document not found');
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const text = task.document.translatedText || task.document.extractedText || '';
    const prompt = `Extract structured medical data from the following document text. Return ONLY a JSON object with these fields (use empty arrays/objects for missing data):
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

Document text:
${text}`;
    await updateTaskProgress(taskId, { progress: 40 });
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleaned = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        await updateTaskProgress(taskId, { progress: 70 });
        const extraction = await prisma.medicalExtraction.upsert({
            where: { documentId: task.document.id },
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
                documentId: task.document.id,
                conditions: JSON.stringify(parsed.conditions ?? []),
                medications: JSON.stringify(parsed.medications ?? []),
                allergies: JSON.stringify(parsed.allergies ?? []),
                procedures: JSON.stringify(parsed.procedures ?? []),
                insuranceMeta: JSON.stringify(parsed.insuranceMeta ?? {}),
                vitalSigns: JSON.stringify(parsed.vitalSigns ?? {}),
                labResults: JSON.stringify(parsed.labResults ?? []),
            },
        });
        await updateTaskProgress(taskId, {
            progress: 100,
            status: 'COMPLETED',
            output: { extractionId: extraction.id, documentId: task.document.id },
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Extraction failed';
        await updateTaskProgress(taskId, { status: 'FAILED', error: msg });
        throw error;
    }
}
export async function executeGenerateSummaryTask(taskId) {
    const task = await prisma.agentTask.findUnique({
        where: { id: taskId },
        include: { document: true },
    });
    if (!task)
        throw new Error('Task not found');
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 20 });
    const document = task.document;
    let context = '';
    if (document) {
        const extraction = await prisma.medicalExtraction.findUnique({
            where: { documentId: document.id },
        });
        if (extraction) {
            context = `Document: ${document.title}\nExtracted conditions: ${extraction.conditions}\nMedications: ${extraction.medications}\nAllergies: ${extraction.allergies}`;
        }
        else {
            context = `Document: ${document.title}\nContent: ${document.translatedText || document.extractedText}`;
        }
    }
    const prompt = `Generate a concise provider-ready medical summary from the following data. Format as a clear, professional summary that a healthcare provider can quickly read.

Data:
${context || 'No document data available. Generate a general health summary.'}

Return ONLY a JSON object with:
{
  "summary": "string - 2-3 paragraph provider summary",
  "keyFindings": ["string - bullet points of important findings"],
  "recommendations": ["string - suggested next steps"]
}`;
    await updateTaskProgress(taskId, { progress: 50 });
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleaned = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        await updateTaskProgress(taskId, {
            progress: 100,
            status: 'COMPLETED',
            output: parsed,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Summary generation failed';
        await updateTaskProgress(taskId, { status: 'FAILED', error: msg });
        throw error;
    }
}
export async function executeExtractConditionsTask(taskId) {
    const task = await prisma.agentTask.findUnique({
        where: { id: taskId },
        include: { document: true },
    });
    if (!task)
        throw new Error('Task not found');
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const text = task.document?.translatedText || task.document?.extractedText || task.input || '';
    const userId = task.userId;
    const prompt = `Extract all medical conditions, diagnoses, and chronic illnesses from the following text. Return ONLY a JSON array of objects:
[{ "name": "string", "date": "string or null", "notes": "string or null" }]

If no conditions are found, return an empty array.

Text:
${typeof text === 'string' ? text : JSON.stringify(text)}`;
    await updateTaskProgress(taskId, { progress: 40 });
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleaned = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed.length > 0) {
            const memories = parsed.filter((c) => c.name).map((c) => ({
                memoryType: 'CONDITION',
                value: c.name,
                source: `task:${taskId}`,
                verified: false,
            }));
            if (memories.length > 0) {
                await addMemories({ userId, memories });
            }
        }
        await updateTaskProgress(taskId, {
            progress: 100,
            status: 'COMPLETED',
            output: { conditions: parsed, count: Array.isArray(parsed) ? parsed.length : 0 },
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Condition extraction failed';
        await updateTaskProgress(taskId, { status: 'FAILED', error: msg });
    }
}
export async function executeExtractMedicationsTask(taskId) {
    const task = await prisma.agentTask.findUnique({
        where: { id: taskId },
        include: { document: true },
    });
    if (!task)
        throw new Error('Task not found');
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const text = task.document?.translatedText || task.document?.extractedText || task.input || '';
    const userId = task.userId;
    const prompt = `Extract all medications, including name, dosage, frequency, and route from the following text. Return ONLY a JSON array of objects:
[{ "name": "string", "dosage": "string or null", "frequency": "string or null", "route": "string or null" }]

If no medications are found, return an empty array.

Text:
${typeof text === 'string' ? text : JSON.stringify(text)}`;
    await updateTaskProgress(taskId, { progress: 40 });
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleaned = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (Array.isArray(parsed) && parsed.length > 0) {
            const memories = parsed.filter((m) => m.name).map((m) => ({
                memoryType: 'MEDICATION',
                value: m.dosage ? `${m.name} ${m.dosage}` : m.name,
                source: `task:${taskId}`,
                verified: false,
            }));
            if (memories.length > 0) {
                await addMemories({ userId, memories });
            }
        }
        await updateTaskProgress(taskId, {
            progress: 100,
            status: 'COMPLETED',
            output: { medications: parsed, count: Array.isArray(parsed) ? parsed.length : 0 },
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Medication extraction failed';
        await updateTaskProgress(taskId, { status: 'FAILED', error: msg });
    }
}
export async function executeGenerateProviderSummaryTask(taskId) {
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const task = await prisma.agentTask.findUnique({ where: { id: taskId } });
    if (!task)
        throw new Error('Task not found');
    const userId = task.userId;
    const summary = await getMemorySummary(userId);
    const prompt = `Generate a professional provider-ready medical summary from the following patient health data. Format as a clear summary a doctor or specialist can quickly read.

Patient Health Data:
Conditions: ${summary.conditions.join(', ') || 'None reported'}
Medications: ${summary.medications.join(', ') || 'None reported'}
Allergies: ${summary.allergies.join(', ') || 'None reported'}
Vaccinations: ${summary.vaccinations.join(', ') || 'None reported'}
Procedures: ${summary.procedures.join(', ') || 'None reported'}
Insurance: ${summary.insurance.join(', ') || 'Not provided'}

Return ONLY a JSON object with:
{
  "summary": "string - 2-3 paragraph clinical summary",
  "keyFindings": ["string - bullet points"],
  "recommendations": ["string - suggested next steps"],
  "activeIssues": ["string - current active medical issues"]
}`;
    await updateTaskProgress(taskId, { progress: 50 });
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleaned = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        await updateTaskProgress(taskId, {
            progress: 100,
            status: 'COMPLETED',
            output: parsed,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Provider summary generation failed';
        await updateTaskProgress(taskId, { status: 'FAILED', error: msg });
    }
}
export async function executeGeneratePharmacistSummaryTask(taskId) {
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const task = await prisma.agentTask.findUnique({ where: { id: taskId } });
    if (!task)
        throw new Error('Task not found');
    const userId = task.userId;
    const summary = await getMemorySummary(userId);
    const prompt = `Generate a pharmacist-ready medication summary from the following patient data. Focus on medication interactions, allergies, and current prescriptions.

Patient Data:
Medications: ${summary.medications.join(', ') || 'None reported'}
Allergies: ${summary.allergies.join(', ') || 'None reported'}
Conditions: ${summary.conditions.join(', ') || 'None reported'}

Return ONLY a JSON object with:
{
  "summary": "string - pharmacist-focused summary",
  "currentMedications": ["string - list with dosages"],
  "allergies": ["string - relevant allergies"],
  "interactionConcerns": ["string - potential interactions"],
  "recommendations": ["string - pharmacist recommendations"]
}`;
    await updateTaskProgress(taskId, { progress: 50 });
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleaned = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        await updateTaskProgress(taskId, {
            progress: 100,
            status: 'COMPLETED',
            output: parsed,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Pharmacist summary generation failed';
        await updateTaskProgress(taskId, { status: 'FAILED', error: msg });
    }
}
export async function executeGenerateDoctorSummaryTask(taskId) {
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const task = await prisma.agentTask.findUnique({ where: { id: taskId } });
    if (!task)
        throw new Error('Task not found');
    const userId = task.userId;
    const summary = await getMemorySummary(userId);
    const prompt = `Generate a comprehensive doctor-ready medical summary from the following patient data. Focus on conditions, procedures, vaccinations, and medication timeline.

Patient Data:
Conditions: ${summary.conditions.join(', ') || 'None reported'}
Medications: ${summary.medications.join(', ') || 'None reported'}
Allergies: ${summary.allergies.join(', ') || 'None reported'}
Vaccinations: ${summary.vaccinations.join(', ') || 'None reported'}
Procedures: ${summary.procedures.join(', ') || 'None reported'}

Return ONLY a JSON object with:
{
  "summary": "string - clinical summary for a doctor",
  "conditions": ["string - all conditions with details"],
  "procedures": ["string - past procedures"],
  "vaccinations": ["string - vaccination history"],
  "medicationTimeline": ["string - medication history timeline"],
  "recommendations": ["string - suggested next steps for the doctor"]
}`;
    await updateTaskProgress(taskId, { progress: 50 });
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleaned = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        await updateTaskProgress(taskId, {
            progress: 100,
            status: 'COMPLETED',
            output: parsed,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Doctor summary generation failed';
        await updateTaskProgress(taskId, { status: 'FAILED', error: msg });
    }
}
export async function executeGenerateTravelPackageTask(taskId) {
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const task = await prisma.agentTask.findUnique({ where: { id: taskId } });
    if (!task)
        throw new Error('Task not found');
    const userId = task.userId;
    const summary = await getMemorySummary(userId);
    const input = task.input ? JSON.parse(task.input) : {};
    const destination = input.destination || 'your destination';
    const prompt = `Generate a travel health package for a patient traveling to ${destination}.

Patient Health Data:
Conditions: ${summary.conditions.join(', ') || 'None reported'}
Medications: ${summary.medications.join(', ') || 'None reported'}
Allergies: ${summary.allergies.join(', ') || 'None reported'}
Vaccinations: ${summary.vaccinations.join(', ') || 'None reported'}

Return ONLY a JSON object with:
{
  "summary": "string - travel health overview",
  "medicationCarry": ["string - medications to bring"],
  "vaccinationReminders": ["string - needed or recommended vaccines"],
  "healthRisks": ["string - health risks at destination"],
  "emergencyPrep": ["string - emergency preparation steps"],
  "documentsToBring": ["string - recommended documents"]
}`;
    await updateTaskProgress(taskId, { progress: 50 });
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleaned = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        await updateTaskProgress(taskId, {
            progress: 100,
            status: 'COMPLETED',
            output: parsed,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Travel package generation failed';
        await updateTaskProgress(taskId, { status: 'FAILED', error: msg });
    }
}
export async function executeGenerateClinicalSummaryTask(taskId) {
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const task = await prisma.agentTask.findUnique({ where: { id: taskId } });
    if (!task)
        throw new Error('Task not found');
    const userId = task.userId;
    const summary = await getMemorySummary(userId);
    const prompt = `Generate a clinical summary from the following patient data. Focus on conditions, diagnoses, and clinical findings for a doctor's review.

Patient Data:
Conditions: ${summary.conditions.join(', ') || 'None reported'}
Medications: ${summary.medications.join(', ') || 'None reported'}
Allergies: ${summary.allergies.join(', ') || 'None reported'}
Vaccinations: ${summary.vaccinations.join(', ') || 'None reported'}
Procedures: ${summary.procedures.join(', ') || 'None reported'}
Insurance: ${summary.insurance.join(', ') || 'Not provided'}

Return ONLY a JSON object with:
{
  "summary": "string - clinical summary",
  "diagnoses": ["string - active diagnoses"],
  "clinicalFindings": ["string - key clinical findings"],
  "treatmentPlan": ["string - treatment recommendations"],
  "followUp": ["string - follow-up recommendations"]
}`;
    await updateTaskProgress(taskId, { progress: 50 });
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleaned = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        await updateTaskProgress(taskId, {
            progress: 100,
            status: 'COMPLETED',
            output: parsed,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Clinical summary generation failed';
        await updateTaskProgress(taskId, { status: 'FAILED', error: msg });
    }
}
export async function executeGenerateMedicationTimelineTask(taskId) {
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const task = await prisma.agentTask.findUnique({ where: { id: taskId } });
    if (!task)
        throw new Error('Task not found');
    const userId = task.userId;
    const summary = await getMemorySummary(userId);
    const prompt = `Generate a medication timeline from the following patient data. Organize medications chronologically if possible.

Patient Data:
Medications: ${summary.medications.join(', ') || 'None reported'}
Conditions: ${summary.conditions.join(', ') || 'None reported'}
Allergies: ${summary.allergies.join(', ') || 'None reported'}

Return ONLY a JSON object with:
{
  "timeline": [{ "medication": "string", "details": "string", "period": "string or null" }],
  "currentMedications": ["string - actively taken"],
  "pastMedications": ["string - previously taken"],
  "notes": "string - additional context"
}`;
    await updateTaskProgress(taskId, { progress: 50 });
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleaned = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        await updateTaskProgress(taskId, {
            progress: 100,
            status: 'COMPLETED',
            output: parsed,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Medication timeline generation failed';
        await updateTaskProgress(taskId, { status: 'FAILED', error: msg });
    }
}
export async function executeGenerateConditionTimelineTask(taskId) {
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const task = await prisma.agentTask.findUnique({ where: { id: taskId } });
    if (!task)
        throw new Error('Task not found');
    const userId = task.userId;
    const summary = await getMemorySummary(userId);
    const prompt = `Generate a condition timeline from the following patient data. Organize conditions chronologically if possible.

Patient Data:
Conditions: ${summary.conditions.join(', ') || 'None reported'}
Medications: ${summary.medications.join(', ') || 'None reported'}
Procedures: ${summary.procedures.join(', ') || 'None reported'}

Return ONLY a JSON object with:
{
  "timeline": [{ "condition": "string", "status": "string", "date": "string or null", "notes": "string or null" }],
  "activeConditions": ["string - currently active"],
  "resolvedConditions": ["string - past or resolved"],
  "chronicConditions": ["string - ongoing chronic issues"]
}`;
    await updateTaskProgress(taskId, { progress: 50 });
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleaned = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        await updateTaskProgress(taskId, {
            progress: 100,
            status: 'COMPLETED',
            output: parsed,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Condition timeline generation failed';
        await updateTaskProgress(taskId, { status: 'FAILED', error: msg });
    }
}
export async function executeGenerateVaccinationHistoryTask(taskId) {
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const task = await prisma.agentTask.findUnique({ where: { id: taskId } });
    if (!task)
        throw new Error('Task not found');
    const userId = task.userId;
    const summary = await getMemorySummary(userId);
    const prompt = `Generate a vaccination history from the following patient data.

Patient Data:
Vaccinations: ${summary.vaccinations.join(', ') || 'None reported'}
Conditions: ${summary.conditions.join(', ') || 'None reported'}

Return ONLY a JSON object with:
{
  "summary": "string - vaccination history overview",
  "vaccinations": [{ "name": "string", "date": "string or null", "status": "string", "notes": "string or null" }],
  "missingVaccinations": ["string - recommended but not recorded"],
  "recommendations": ["string - suggested vaccinations"]
}`;
    await updateTaskProgress(taskId, { progress: 50 });
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleaned = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        await updateTaskProgress(taskId, {
            progress: 100,
            status: 'COMPLETED',
            output: parsed,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Vaccination history generation failed';
        await updateTaskProgress(taskId, { status: 'FAILED', error: msg });
    }
}
export async function executeTranslatePrescriptionTask(taskId) {
    const task = await prisma.agentTask.findUnique({
        where: { id: taskId },
        include: { document: true },
    });
    if (!task || !task.document)
        throw new Error('Task or document not found');
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const doc = task.document;
    const sourceText = doc.extractedText || '';
    const sourceLang = doc.originalLanguage || 'unknown';
    await updateTaskProgress(taskId, { progress: 30 });
    const result = await translateAndExtractDocument(sourceText, sourceLang);
    await updateTaskProgress(taskId, { progress: 70 });
    await prisma.healthDocument.update({
        where: { id: doc.id },
        data: {
            translatedText: result.englishTranslation,
            extractedText: result.extractedCleanText,
        },
    });
    await updateTaskProgress(taskId, {
        progress: 100,
        status: 'COMPLETED',
        output: {
            englishTranslation: result.englishTranslation,
            extractedCleanText: result.extractedCleanText,
            documentId: doc.id,
        },
    });
}
export async function executeFindMedicationEquivalentsTask(taskId) {
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const task = await prisma.agentTask.findUnique({ where: { id: taskId } });
    if (!task)
        throw new Error('Task not found');
    const userId = task.userId;
    const summary = await getMemorySummary(userId);
    const prompt = `Find medication equivalents or alternatives for the patient's current medications.

Patient Data:
Medications: ${summary.medications.join(', ') || 'None reported'}
Allergies: ${summary.allergies.join(', ') || 'None reported'}
Conditions: ${summary.conditions.join(', ') || 'None reported'}

Return ONLY a JSON object with:
{
  "equivalents": [{ "original": "string", "alternatives": ["string - generic or alternative names"], "notes": "string or null" }],
  "interactionWarnings": ["string - potential interactions with alternatives"],
  "recommendations": ["string - pharmacist recommendations"]
}`;
    await updateTaskProgress(taskId, { progress: 50 });
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleaned = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        await updateTaskProgress(taskId, {
            progress: 100,
            status: 'COMPLETED',
            output: parsed,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Medication equivalents search failed';
        await updateTaskProgress(taskId, { status: 'FAILED', error: msg });
    }
}
export async function executeGenerateMedicationSummaryTask(taskId) {
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const task = await prisma.agentTask.findUnique({ where: { id: taskId } });
    if (!task)
        throw new Error('Task not found');
    const userId = task.userId;
    const summary = await getMemorySummary(userId);
    const prompt = `Generate a medication summary for a pharmacist from the following patient data.

Patient Data:
Medications: ${summary.medications.join(', ') || 'None reported'}
Allergies: ${summary.allergies.join(', ') || 'None reported'}
Conditions: ${summary.conditions.join(', ') || 'None reported'}

Return ONLY a JSON object with:
{
  "summary": "string - medication summary for pharmacist",
  "activePrescriptions": ["string - current prescriptions with dosages"],
  "allergies": ["string - relevant allergies"],
  "potentialInteractions": ["string - possible drug interactions"],
  "recommendations": ["string - pharmacist recommendations"]
}`;
    await updateTaskProgress(taskId, { progress: 50 });
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleaned = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        await updateTaskProgress(taskId, {
            progress: 100,
            status: 'COMPLETED',
            output: parsed,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Medication summary generation failed';
        await updateTaskProgress(taskId, { status: 'FAILED', error: msg });
    }
}
export async function executeTranslateDocumentsTask(taskId) {
    const task = await prisma.agentTask.findUnique({
        where: { id: taskId },
        include: { document: true },
    });
    if (!task || !task.document)
        throw new Error('Task or document not found');
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const doc = task.document;
    const sourceText = doc.extractedText || '';
    const sourceLang = doc.originalLanguage || 'unknown';
    await updateTaskProgress(taskId, { progress: 30 });
    const result = await translateAndExtractDocument(sourceText, sourceLang);
    await updateTaskProgress(taskId, { progress: 70 });
    await prisma.healthDocument.update({
        where: { id: doc.id },
        data: {
            translatedText: result.englishTranslation,
            extractedText: result.extractedCleanText,
        },
    });
    await updateTaskProgress(taskId, {
        progress: 100,
        status: 'COMPLETED',
        output: {
            englishTranslation: result.englishTranslation,
            extractedCleanText: result.extractedCleanText,
            documentId: doc.id,
        },
    });
}
export async function executePreparePassportPackageTask(taskId) {
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const task = await prisma.agentTask.findUnique({ where: { id: taskId } });
    if (!task)
        throw new Error('Task not found');
    const userId = task.userId;
    const summary = await getMemorySummary(userId);
    const prompt = `Prepare a health passport package from the following patient data.

Patient Data:
Conditions: ${summary.conditions.join(', ') || 'None reported'}
Medications: ${summary.medications.join(', ') || 'None reported'}
Allergies: ${summary.allergies.join(', ') || 'None reported'}
Vaccinations: ${summary.vaccinations.join(', ') || 'None reported'}
Procedures: ${summary.procedures.join(', ') || 'None reported'}
Insurance: ${summary.insurance.join(', ') || 'Not provided'}

Return ONLY a JSON object with:
{
  "summary": "string - passport package overview",
  "documents": ["string - list of included documents"],
  "medicalHistory": "string - condensed medical history",
  "emergencyContacts": ["string - emergency information"],
  "recommendations": ["string - travel or health recommendations"]
}`;
    await updateTaskProgress(taskId, { progress: 50 });
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleaned = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        await updateTaskProgress(taskId, {
            progress: 100,
            status: 'COMPLETED',
            output: parsed,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Passport package preparation failed';
        await updateTaskProgress(taskId, { status: 'FAILED', error: msg });
    }
}
export async function executePrepareInsuranceSummaryTask(taskId) {
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const task = await prisma.agentTask.findUnique({ where: { id: taskId } });
    if (!task)
        throw new Error('Task not found');
    const userId = task.userId;
    const summary = await getMemorySummary(userId);
    const prompt = `Prepare an insurance summary from the following patient data.

Patient Data:
Insurance: ${summary.insurance.join(', ') || 'Not provided'}
Conditions: ${summary.conditions.join(', ') || 'None reported'}
Medications: ${summary.medications.join(', ') || 'None reported'}
Procedures: ${summary.procedures.join(', ') || 'None reported'}

Return ONLY a JSON object with:
{
  "summary": "string - insurance summary",
  "providerInfo": "string - insurance provider details",
  "coverageDetails": ["string - coverage information"],
  "claimsHistory": ["string - past claims if available"],
  "recommendations": ["string - insurance-related recommendations"]
}`;
    await updateTaskProgress(taskId, { progress: 50 });
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleaned = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        await updateTaskProgress(taskId, {
            progress: 100,
            status: 'COMPLETED',
            output: parsed,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Insurance summary preparation failed';
        await updateTaskProgress(taskId, { status: 'FAILED', error: msg });
    }
}
export async function executePrepareVisitSummaryTask(taskId) {
    await updateTaskProgress(taskId, { status: 'PROCESSING', progress: 10 });
    const task = await prisma.agentTask.findUnique({ where: { id: taskId } });
    if (!task)
        throw new Error('Task not found');
    const userId = task.userId;
    const summary = await getMemorySummary(userId);
    const prompt = `Generate a visit summary for a doctor from the following patient data.

Patient Data:
Conditions: ${summary.conditions.join(', ') || 'None reported'}
Medications: ${summary.medications.join(', ') || 'None reported'}
Allergies: ${summary.allergies.join(', ') || 'None reported'}
Vaccinations: ${summary.vaccinations.join(', ') || 'None reported'}
Procedures: ${summary.procedures.join(', ') || 'None reported'}

Return ONLY a JSON object with:
{
  "summary": "string - visit summary for doctor",
  "reasonForVisit": "string - stated or inferred reason",
  "vitals": { "bloodPressure": "string or null", "heartRate": "string or null", "temperature": "string or null" },
  "assessment": ["string - doctor's assessment points"],
  "plan": ["string - treatment or management plan"],
  "followUp": "string - follow-up instructions"
}`;
    await updateTaskProgress(taskId, { progress: 50 });
    try {
        const result = await model.generateContent(prompt);
        const response = result.response.text();
        const cleaned = response.replace(/```json|```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        await updateTaskProgress(taskId, {
            progress: 100,
            status: 'COMPLETED',
            output: parsed,
        });
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : 'Visit summary preparation failed';
        await updateTaskProgress(taskId, { status: 'FAILED', error: msg });
    }
}
export function getAllowedTaskTypesForRole(role) {
    switch (role) {
        case 'DOCTOR':
            return ['GENERATE_CLINICAL_SUMMARY', 'GENERATE_MEDICATION_TIMELINE', 'GENERATE_CONDITION_TIMELINE', 'GENERATE_VACCINATION_HISTORY', 'TRANSLATE_DOCUMENTS', 'PREPARE_VISIT_SUMMARY'];
        case 'PHARMACIST':
            return ['TRANSLATE_PRESCRIPTION', 'FIND_MEDICATION_EQUIVALENTS', 'GENERATE_MEDICATION_SUMMARY'];
        case 'MEDICAL_ASSISTANT':
            return ['TRANSLATE_DOCUMENTS', 'PREPARE_PASSPORT_PACKAGE', 'PREPARE_INSURANCE_SUMMARY'];
        default:
            return [];
    }
}
//# sourceMappingURL=service.js.map