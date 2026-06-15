import express from 'express';

import dotenv from 'dotenv';
import { ZodError } from 'zod';
import { prisma } from './lib/db.js';
import { createTravelHealthSession, getTravelHealthSession } from './lib/session/service.js';
import { CreateSessionSchema, WorkflowInputSchema } from './lib/session/schema.js';
import { findLocalEquivalents } from './lib/medications/repository.js';
import { findNearbyProviders } from './lib/providers/geoapify.js';
import { recordOutcome, OutcomeSchema } from './lib/outcomes/service.js';
import {
  getOutcomeInsightsByUser,
  getOutcomeInsightsByJourney,
  getOutcomeInsightsByCountry,
  getMedicationOutcomesByMedication,
  getProviderOutcome,
  getUserOutcomeSummary,
} from './lib/outcomes/query.js';

import { createJourney, getUserJourneys, getJourney, updateJourneyOutcome, CreateJourneySchema, UpdateJourneyOutcomeSchema } from './lib/journeys/service.js';
import { buildInterpreterContext } from './lib/interpreter/builder.js';
import { executeWorkflow } from './lib/workflow/orchestrator.js';
import { getTargetLanguage } from './lib/interpreter/translator.js';
import { translateAndExtractDocument } from './lib/vault/translator.js';
import {
  createConversation,
  getConversation,
  getUserConversations,
  sendMessage,
  getConversationMessages,
  addParticipant,
  removeParticipant,
  markAsRead,
} from './lib/conversation/service.js';
import {
  createTask,
  getTask,
  getTaskWithDocument,
  getUserTasks,
  getAllUserTasksByStatus,
  updateTaskProgress,
  executeTranslateDocumentTask,
  executeExtractMedicalDataTask,
  executeGenerateSummaryTask,
  executeExtractConditionsTask,
  executeExtractMedicationsTask,
  executeGenerateProviderSummaryTask,
  executeGeneratePharmacistSummaryTask,
  executeGenerateDoctorSummaryTask,
  executeGenerateTravelPackageTask,
  executeGenerateClinicalSummaryTask,
  executeGenerateMedicationTimelineTask,
  executeGenerateConditionTimelineTask,
  executeGenerateVaccinationHistoryTask,
  executeTranslatePrescriptionTask,
  executeFindMedicationEquivalentsTask,
  executeGenerateMedicationSummaryTask,
  executeTranslateDocumentsTask,
  executePreparePassportPackageTask,
  executePrepareInsuranceSummaryTask,
  executePrepareVisitSummaryTask,
  getAllowedTaskTypesForRole,
} from './lib/agent/service.js';
import {
  processDocumentUpload,
  getDocumentWithExtraction,
  getUserVaultWithExtraction,
  updatePassportFromExtractions,
} from './lib/vault/intelligence.js';
import {
  processDocumentPipeline,
} from './lib/vault/processor.js';
import {
  addMemory,
  getUserMemories,
  getMemorySummary,
  deleteMemory,
  verifyMemory,
} from './lib/health-memory/service.js';
import {
  createCandidates,
} from './lib/medical-memory-candidates/service.js';
import {
  sharePassport,

  getSharedPassport,
  getUserSharedPassports,
  revokeShare,
  getShareTimeline,
  generateQrCode,
} from './lib/passport/service.js';
import {
  upsertPresence,
  getUserPresence,
  getOnlineUsers,
  getPresenceForUsers,
  markMessageRead,
  getMessageReadReceipts,
  markConversationMessagesRead,
  createConversationEvent,
  getConversationEvents,
  createNotification,
  getUserNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  createActivityItem,
  getUserActivity,
  getAllActivity,
} from './lib/real-time/service.js';
import { Prisma } from '@prisma/client';

// ProviderType is stored as a plain string in the schema
type ProviderType = 'PHARMACY' | 'CLINIC' | 'HOSPITAL';

function parseSessionJsonArr(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try { return JSON.parse(value); } catch { return []; }
  }
  return [];
}

function severityToRec(severity: string): string {
  switch (severity) {
    case 'SELF_CARE':  return 'SELF_CARE';
    case 'PHARMACY':   return 'PHARMACY';
    case 'CLINIC':     return 'CLINIC';
    case 'HOSPITAL':   return 'CLINIC';
    case 'EMERGENCY':  return 'EMERGENCY';
    default:           return 'SELF_CARE';
  }
}

dotenv.config();

const app = express();

const corsOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim());

app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  const allowAll = corsOrigins.includes('*');
  const isAllowed =
    allowAll || (requestOrigin != null && corsOrigins.includes(requestOrigin));

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', allowAll ? '*' : requestOrigin!);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }

  next();
});

app.use(express.json());

app.get('/health', (_, res) => res.json({ status: 'ok' }));

app.post('/sessions', async (req, res) => {
  try {
    const input = CreateSessionSchema.parse(req.body);
    const session = await createTravelHealthSession(input);
    res.status(201).json(session);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Invalid session payload.', details: error.flatten() });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Unable to create travel health session.' });
  }
});

app.get('/sessions/:id', async (req, res) => {
  try {
    const session = await getTravelHealthSession(req.params.id);
    if (!session) {
      res.status(404).json({ error: 'Session not found.' });
      return;
    }
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch session.' });
  }
});

app.post('/workflow', async (req, res) => {
  try {
    const input = WorkflowInputSchema.parse(req.body);
    const result = await executeWorkflow(input);
    res.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Invalid workflow payload.', details: error.flatten() });
      return;
    }
    if (error instanceof Error && error.message === 'Session not found') {
      res.status(404).json({ error: 'Session not found.' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Workflow execution failed.' });
  }
});

app.post('/sessions/:id/workflow', async (req, res) => {
  try {
    const input = WorkflowInputSchema.parse({
      ...req.body,
      sessionId: req.params.id
    });
    const result = await executeWorkflow(input);
    res.json({ success: true, data: result });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Invalid workflow payload.', details: error.flatten() });
      return;
    }
    if (error instanceof Error && error.message === 'Session not found') {
      res.status(404).json({ error: 'Session not found.' });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Workflow execution failed.' });
  }
});

app.post('/sessions/:id/consent', async (req, res) => {
  try {
    const { includedPassport, includedDocuments } = req.body;

    const session = await prisma.travelHealthSession.update({
      where: { id: req.params.id },
      data: {
        includedPassport: includedPassport ?? false,
        includedDocuments:
          Array.isArray(includedDocuments) && includedDocuments.length > 0
            ? includedDocuments
            : undefined,
      } as Prisma.TravelHealthSessionUpdateInput,
      include: { country: true }
    });

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update session consent.' });
  }
});

app.get('/users/:id/vault', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        healthPassport: true,
        healthDocuments: true,
      }
    }) as Prisma.UserGetPayload<{ include: { healthPassport: true; healthDocuments: true } }> | null;

    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    res.json({
      healthPassport: user.healthPassport,
      healthDocuments: user.healthDocuments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load health vault.' });
  }
});

app.post('/vault/upload', async (req, res) => {
  try {
    const { userId, title, type, sourceCountry, originalLanguage, extractedText } = req.body;

    if (!userId || !title || !type || !originalLanguage || !extractedText) {
      res.status(400).json({ error: 'Missing required upload fields.' });
      return;
    }

    const translationResult = await translateAndExtractDocument(extractedText, originalLanguage);

    const document = await prisma.healthDocument.create({
      data: {
        userId,
        title,
        type,
        sourceCountry,
        originalLanguage,
        fileUrl: 'https://example.com/mock-health-document',
        extractedText,
        translatedText: translationResult.englishTranslation,
      }
    });

    res.status(201).json({ success: true, data: document });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to upload health document.' });
  }
});

app.get('/medications', async (req, res) => {
  try {
    const ingredient = String(req.query.ingredient || '');
    const countryCode = String(req.query.countryCode || '');
    if (!ingredient || !countryCode) {
      res.status(400).json({ error: 'ingredient and countryCode are required.' });
      return;
    }

    const results = await findLocalEquivalents(ingredient, countryCode);
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch medication equivalents.' });
  }
});

app.get('/providers', async (req, res) => {
  try {
    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const type = String(req.query.type || '');
    const radius = Number(req.query.radius || 5000);

    if (Number.isNaN(lat) || Number.isNaN(lng) || !type) {
      res.status(400).json({ error: 'lat, lng, and type are required.' });
      return;
    }

    const providerType = type.toUpperCase() as ProviderType;
    if (!['PHARMACY', 'CLINIC', 'HOSPITAL'].includes(providerType)) {
      res.status(400).json({ error: 'type must be PHARMACY, CLINIC, or HOSPITAL.' });
      return;
    }

    const providers = await findNearbyProviders(lat, lng, providerType, radius);
    res.json(providers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch nearby providers.' });
  }
});

app.get('/sessions/:id/interpreter', async (req, res) => {
  try {
    const session = await prisma.travelHealthSession.findUnique({
      where: { id: req.params.id },
      include: {
        country: true,
        user: {
          include: {
            healthPassport: true,
            healthDocuments: true,
          }
        }
      }
    }) as Prisma.TravelHealthSessionGetPayload<{
      include: {
        country: true;
        user: {
          include: {
            healthPassport: true;
            healthDocuments: true;
          };
        };
      };
    }> | null;

    if (!session) {
      res.status(404).json({ error: 'Session not found.' });
      return;
    }

    const english =
      session.interpreterContext ?? buildInterpreterContext(
        session,
        session.user?.healthPassport ?? null,
        session.user?.healthDocuments ?? []
      );
    const translated =
      session.interpreterContextTranslated ?? english;
    const countryCode = session.country?.code ?? 'US';

    res.json({
      interpreterContext: english,
      interpreterContextEnglish: english,
      interpreterContextTranslated: translated,
      countryCode,
      targetLanguage: getTargetLanguage(countryCode)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to build interpreter context.' });
  }
});

app.post('/sessions/:id/outcome', async (req, res) => {
  try {
    const validated = OutcomeSchema.parse(req.body);
    const updated = await recordOutcome(req.params.id, validated);

    // Auto-create a HealthcareJourney when outcome is recorded
    const session = await prisma.travelHealthSession.findUnique({
      where: { id: req.params.id },
      include: { country: true, user: true }
    });
    if (session?.userId) {
      const symptoms = parseSessionJsonArr(session.symptoms);
      const severity = session.severity ?? 'SELF_CARE';
      const country = session.country?.name ?? session.location ?? 'Unknown';
      const city = session.location ?? undefined;

      const outcomeStatus = validated.symptomsImproved ? 'RECOVERED' : 'IMPROVED';

      await createJourney({
        userId:           session.userId,
        sessionId:        session.id,
        country,
        city,
        symptoms:         symptoms as string[],
        severity,
        recommendation:   severityToRec(severity),
        medicationFound:  validated.purchasedMedication ?? false,
        providerVisited:  validated.receivedHelp ?? false,
        interpreterUsed:  session.interpreterContext != null,
        outcomeStatus:    outcomeStatus as 'RECOVERED' | 'IMPROVED',
      }).catch(err => console.error('Failed to auto-create journey:', err));
    }

    res.json(updated);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Invalid outcome payload.', details: error.flatten() });
      return;
    }
    console.error(error);
    res.status(400).json({ error: 'Invalid outcome payload.' });
  }
});

// ── Journey Routes ───────────────────────────────────────────────────

app.post('/journeys', async (req, res) => {
  try {
    const input = CreateJourneySchema.parse(req.body);
    const journey = await createJourney(input);
    res.status(201).json(journey);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Invalid journey payload.', details: error.flatten() });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Unable to create journey.' });
  }
});

app.get('/journeys', async (req, res) => {
  try {
    const userId = req.query.userId as string;
    if (!userId) {
      res.status(400).json({ error: 'userId query parameter is required.' });
      return;
    }
    const journeys = await getUserJourneys(userId);
    res.json(journeys);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch journeys.' });
  }
});

app.get('/journeys/:id', async (req, res) => {
  try {
    const journey = await getJourney(req.params.id);
    if (!journey) {
      res.status(404).json({ error: 'Journey not found.' });
      return;
    }
    res.json(journey);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch journey.' });
  }
});

app.post('/journeys/:id/outcome', async (req, res) => {
  try {
    const input = UpdateJourneyOutcomeSchema.parse(req.body);
    const journey = await updateJourneyOutcome(req.params.id, input);

    // Sprint 8 — Outcome Intelligence auto-generation (async)
    import('./lib/outcomes/service.js')
      .then((m) => m.generateInsightsForJourney(journey.id))
      .catch((e) => console.warn('Failed to generate journey insights:', e));

    res.json(journey);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Invalid journey outcome payload.', details: error.flatten() });
      return;
    }
    console.error(error);
    res.status(500).json({ error: 'Unable to update journey outcome.' });
  }
});


// ── Sprint 8: Outcome Intelligence APIs ─────────────────────────────

app.get('/outcomes/user/:userId', async (req, res) => {
  try {
    const insights = await getOutcomeInsightsByUser(req.params.userId);
    res.json(insights);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Unable to fetch user outcome insights.' });
  }
});

app.get('/outcomes/journey/:journeyId', async (req, res) => {
  try {
    const insights = await getOutcomeInsightsByJourney(req.params.journeyId);
    res.json(insights);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Unable to fetch journey outcome insights.' });
  }
});

app.get('/outcomes/country/:country', async (req, res) => {
  try {
    const insights = await getOutcomeInsightsByCountry(req.params.country);
    res.json(insights);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Unable to fetch country outcome insights.' });
  }
});

app.get('/outcomes/medications/:medicationId', async (req, res) => {
  try {
    const outcomes = await getMedicationOutcomesByMedication(req.params.medicationId);
    res.json(outcomes);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Unable to fetch medication outcomes.' });
  }
});

app.get('/outcomes/provider/:providerId', async (req, res) => {
  try {
    const outcome = await getProviderOutcome(req.params.providerId);
    res.json(outcome);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Unable to fetch provider outcome.' });
  }
});

app.get('/outcomes/user/:userId/summary', async (req, res) => {
  try {
    const summary = await getUserOutcomeSummary(req.params.userId);
    res.json(summary);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Unable to fetch user outcome summary.' });
  }
});

// ── Conversation Routes ──────────────────────────────────────────────

app.post('/conversations', async (req, res) => {

  try {
    const { userIds, title } = req.body;
    if (!Array.isArray(userIds) || userIds.length < 2) {
      res.status(400).json({ error: 'At least 2 user IDs required.' });
      return;
    }
    const conversation = await createConversation(userIds, title);
    res.status(201).json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create conversation.' });
  }
});

app.get('/conversations/user/:userId', async (req, res) => {
  try {
    const conversations = await getUserConversations(req.params.userId);
    res.json(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch conversations.' });
  }
});

app.get('/conversations/:id', async (req, res) => {
  try {
    const conversation = await getConversation(req.params.id);
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found.' });
      return;
    }
    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch conversation.' });
  }
});

app.post('/conversations/:id/messages', async (req, res) => {
  try {
    const { senderId, senderType, content, attachments } = req.body;
    if (!senderId || !senderType || !content) {
      res.status(400).json({ error: 'senderId, senderType, and content are required.' });
      return;
    }
    const message = await sendMessage({
      conversationId: req.params.id,
      senderId,
      senderType,
      content,
      attachments,
    });
    res.status(201).json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to send message.' });
  }
});

app.get('/conversations/:id/messages', async (req, res) => {
  try {
    const offset = Number(req.query.offset) || 0;
    const limit = Number(req.query.limit) || 100;
    const messages = await getConversationMessages(req.params.id, { offset, limit });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch messages.' });
  }
});

app.post('/conversations/:id/participants', async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!userId) {
      res.status(400).json({ error: 'userId is required.' });
      return;
    }
    const participant = await addParticipant(req.params.id, userId, role);
    res.status(201).json(participant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to add participant.' });
  }
});

app.delete('/conversations/:id/participants/:userId', async (req, res) => {
  try {
    await removeParticipant(req.params.id, req.params.userId);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to remove participant.' });
  }
});

app.post('/conversations/:id/read', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ error: 'userId is required.' });
      return;
    }
    await markAsRead(req.params.id, userId);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to mark as read.' });
  }
});

// ── Agent Task Routes ────────────────────────────────────────────────

app.post('/tasks', async (req, res) => {
  try {
    const { userId, type, title, description, input, documentId } = req.body;
    if (!userId || !type || !title) {
      res.status(400).json({ error: 'userId, type, and title are required.' });
      return;
    }
    const task = await createTask({ userId, type, title, description, input, documentId });
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create task.' });
  }
});

app.get('/tasks/:id', async (req, res) => {
  try {
    const task = await getTask(req.params.id);
    if (!task) {
      res.status(404).json({ error: 'Task not found.' });
      return;
    }
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch task.' });
  }
});

app.get('/tasks/user/:userId', async (req, res) => {
  try {
    const status = req.query.status as string | undefined;
    const limit = Number(req.query.limit) || 50;
    const tasks = await getUserTasks(req.params.userId, { limit, status: status as any });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch tasks.' });
  }
});

app.patch('/tasks/:id', async (req, res) => {
  try {
    const { progress, status, output, error: taskError } = req.body;
    const task = await updateTaskProgress(req.params.id, { progress, status, output, error: taskError });
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update task.' });
  }
});

app.post('/tasks/:id/execute', async (req, res) => {
  try {
    const task = await getTask(req.params.id);
    if (!task) {
      res.status(404).json({ error: 'Task not found.' });
      return;
    }

    res.json({ success: true, message: 'Task execution started.', taskId: task.id });

    switch (task.type) {
      case 'TRANSLATE_DOCUMENT':
        await executeTranslateDocumentTask(task.id);
        break;
      case 'EXTRACT_MEDICAL_DATA':
        await executeExtractMedicalDataTask(task.id);
        break;
      case 'GENERATE_SUMMARY':
        await executeGenerateSummaryTask(task.id);
        break;
      case 'EXTRACT_CONDITIONS':
        await executeExtractConditionsTask(task.id);
        break;
      case 'EXTRACT_MEDICATIONS':
        await executeExtractMedicationsTask(task.id);
        break;
      case 'GENERATE_PROVIDER_SUMMARY':
        await executeGenerateProviderSummaryTask(task.id);
        break;
      case 'GENERATE_PHARMACIST_SUMMARY':
        await executeGeneratePharmacistSummaryTask(task.id);
        break;
      case 'GENERATE_DOCTOR_SUMMARY':
        await executeGenerateDoctorSummaryTask(task.id);
        break;
      case 'GENERATE_TRAVEL_PACKAGE':
        await executeGenerateTravelPackageTask(task.id);
        break;
      case 'GENERATE_CLINICAL_SUMMARY':
        await executeGenerateClinicalSummaryTask(task.id);
        break;
      case 'GENERATE_MEDICATION_TIMELINE':
        await executeGenerateMedicationTimelineTask(task.id);
        break;
      case 'GENERATE_CONDITION_TIMELINE':
        await executeGenerateConditionTimelineTask(task.id);
        break;
      case 'GENERATE_VACCINATION_HISTORY':
        await executeGenerateVaccinationHistoryTask(task.id);
        break;
      case 'TRANSLATE_PRESCRIPTION':
        await executeTranslatePrescriptionTask(task.id);
        break;
      case 'FIND_MEDICATION_EQUIVALENTS':
        await executeFindMedicationEquivalentsTask(task.id);
        break;
      case 'GENERATE_MEDICATION_SUMMARY':
        await executeGenerateMedicationSummaryTask(task.id);
        break;
      case 'TRANSLATE_DOCUMENTS':
        await executeTranslateDocumentsTask(task.id);
        break;
      case 'PREPARE_PASSPORT_PACKAGE':
        await executePreparePassportPackageTask(task.id);
        break;
      case 'PREPARE_INSURANCE_SUMMARY':
        await executePrepareInsuranceSummaryTask(task.id);
        break;
      case 'PREPARE_VISIT_SUMMARY':
        await executePrepareVisitSummaryTask(task.id);
        break;
      default:
        await updateTaskProgress(task.id, { status: 'FAILED', error: `Unsupported task type: ${task.type}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to execute task.' });
  }
});

// ── Vault Intelligence Routes ────────────────────────────────────────

app.post('/vault/process', async (req, res) => {
  try {
    const { userId, title, type, sourceCountry, originalLanguage, extractedText } = req.body;
    if (!userId || !title || !type || !originalLanguage || !extractedText) {
      res.status(400).json({ error: 'Missing required fields.' });
      return;
    }
    const result = await processDocumentUpload({
      userId, title, type, sourceCountry, originalLanguage, extractedText,
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to process document.' });
  }
});

app.get('/vault/documents/:id', async (req, res) => {
  try {
    const doc = await getDocumentWithExtraction(req.params.id);
    if (!doc) {
      res.status(404).json({ error: 'Document not found.' });
      return;
    }
    res.json(doc);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch document.' });
  }
});

app.get('/users/:id/vault/extractions', async (req, res) => {
  try {
    const user = await getUserVaultWithExtraction(req.params.id);
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }
    res.json({
      healthPassport: user.healthPassport,
      healthDocuments: user.healthDocuments,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to load vault with extractions.' });
  }
});

app.post('/users/:id/passport/sync', async (req, res) => {
  try {
    const passport = await updatePassportFromExtractions(req.params.id);
    res.json({ success: true, data: passport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to sync passport.' });
  }
});

// ── Enhanced Document Processing Pipeline ─────────────────────────

app.post('/vault/process/pipeline', async (req, res) => {
  try {
    const { userId, title, type, sourceCountry, originalLanguage, extractedText, storageUrl } = req.body;
    if (!userId || !title || !type || !extractedText) {
      res.status(400).json({ error: 'Missing required fields: userId, title, type, extractedText' });
      return;
    }
    const result = await processDocumentPipeline({
      userId, title, type, sourceCountry, originalLanguage: originalLanguage || 'auto', extractedText, storageUrl,
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to process document pipeline.' });
  }
});

app.get('/vault/documents/:id/jobs', async (req, res) => {
  try {
    const jobs = await prisma.documentProcessingJob.findMany({
      where: { documentId: req.params.id },
      orderBy: { startedAt: 'desc' },
    });
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch processing jobs.' });
  }
});

app.get('/vault/documents/:id/entities', async (req, res) => {
  try {
    const doc = await prisma.healthDocument.findUnique({ where: { id: req.params.id } });
    if (!doc) { res.status(404).json({ error: 'Document not found.' }); return; }
    const entities = await prisma.extractedMedicalEntity.findMany({
      where: { sourceDocId: req.params.id },
      orderBy: { confidence: 'desc' },
    });
    res.json(entities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch entities.' });
  }
});

// ── MedicalMemory Routes ─────────────────────────────────────────────

app.get('/memory/:userId', async (req, res) => {
  try {
    const memoryType = req.query.memoryType as string | undefined;
    const memories = await getUserMemories(req.params.userId, memoryType as any);
    res.json(memories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch medical memory.' });
  }
});

app.get('/memory/:userId/summary', async (req, res) => {
  try {
    const summary = await getMemorySummary(req.params.userId);
    res.json(summary);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch memory summary.' });
  }
});

app.post('/memory', async (req, res) => {
  try {
    const { userId, memoryType, value, source, verified } = req.body;
    if (!userId || !memoryType || !value) {
      res.status(400).json({ error: 'userId, memoryType, and value are required.' });
      return;
    }
    const memory = await addMemory({ userId, memoryType, value, source, verified });
    res.status(201).json(memory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to add medical memory.' });
  }
});

app.delete('/memory/:id', async (req, res) => {
  try {
    const result = await deleteMemory(req.params.id);
    if (!result) { res.status(404).json({ error: 'Memory not found.' }); return; }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to delete memory.' });
  }
});

app.post('/memory/:id/verify', async (req, res) => {
  try {
    const memory = await verifyMemory(req.params.id);
    res.json(memory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to verify memory.' });
  }
});

// ── Enhanced Agent Task Routes ───────────────────────────────────

app.get('/tasks/user/:userId/grouped', async (req, res) => {
  try {
    const grouped = await getAllUserTasksByStatus(req.params.userId);
    res.json(grouped);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch grouped tasks.' });
  }
});

app.get('/tasks/:id/detailed', async (req, res) => {
  try {
    const task = await getTaskWithDocument(req.params.id);
    if (!task) { res.status(404).json({ error: 'Task not found.' }); return; }
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch detailed task.' });
  }
});

// ── Passport Sharing Routes ──────────────────────────────────────────

app.post('/passport/share', async (req, res) => {
  try {
    const { passportId, createdBy, conversationId, shareType } = req.body;
    if (!createdBy) {
      res.status(400).json({ error: 'createdBy is required.' });
      return;
    }
    const result = await sharePassport({ passportId, createdBy, conversationId, shareType });
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to share passport.' });
  }
});

app.get('/passport/shared/:token', async (req, res) => {
  try {
    const ip = (req.headers['x-forwarded-for'] as string | undefined)?.split(',')[0]?.trim() ??
      req.socket?.remoteAddress;

    const userAgent = req.headers['user-agent'] as string | undefined;

    const result = await getSharedPassport(req.params.token, {
      ip: ip ?? null,
      userAgent: userAgent ?? null,
    });

    if (!result) {
      res.status(404).json({ error: 'Shared passport not found or expired.' });
      return;
    }
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch shared passport.' });
  }
});

app.get('/passport/shares/:userId', async (req, res) => {
  try {
    const shares = await getUserSharedPassports(req.params.userId);
    res.json(shares);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch shared passports.' });
  }
});

app.post('/passport/revoke/:token', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ error: 'userId is required.' });
      return;
    }
    const result = await revokeShare(req.params.token, userId);
    if (!result) {
      res.status(404).json({ error: 'Share not found or not authorized.' });
      return;
    }
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to revoke share.' });
  }
});

app.get('/passport/timeline/:userId', async (req, res) => {
  try {
    const timeline = await getShareTimeline(req.params.userId);
    res.json(timeline);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch share timeline.' });
  }
});

app.get('/passport/qr/:token', async (req, res) => {
  try {
    const qrDataUrl = await generateQrCode(req.params.token);
    res.json({ qrCodeUrl: qrDataUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to generate QR code.' });
  }
});

// ── Sprint 4: Real-Time Healthcare Communication Routes ──────────────
// ── Presence ─────────────────────────────────────────────────────────

app.post('/presence', async (req, res) => {
  try {
    const { userId, status, currentPage } = req.body;
    if (!userId || !status) {
      res.status(400).json({ error: 'userId and status are required.' });
      return;
    }
    if (!['ONLINE', 'AWAY', 'OFFLINE'].includes(status)) {
      res.status(400).json({ error: 'status must be ONLINE, AWAY, or OFFLINE.' });
      return;
    }
    const presence = await upsertPresence(userId, status, currentPage);
    res.json(presence);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update presence.' });
  }
});

app.get('/presence/:userId', async (req, res) => {
  try {
    const presence = await getUserPresence(req.params.userId);
    res.json(presence ?? { userId: req.params.userId, status: 'OFFLINE', lastSeenAt: null, currentPage: null });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch presence.' });
  }
});

app.get('/presence/online', async (_req, res) => {
  try {
    const users = await getOnlineUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch online users.' });
  }
});

app.post('/presence/batch', async (req, res) => {
  try {
    const { userIds } = req.body;
    if (!Array.isArray(userIds)) {
      res.status(400).json({ error: 'userIds array is required.' });
      return;
    }
    const presences = await getPresenceForUsers(userIds);
    res.json(presences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch presences.' });
  }
});

// ── Read Receipts ────────────────────────────────────────────────────

app.post('/messages/:id/read', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ error: 'userId is required.' });
      return;
    }
    const receipt = await markMessageRead(req.params.id, userId);
    res.json(receipt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to mark message as read.' });
  }
});

app.get('/messages/:id/receipts', async (req, res) => {
  try {
    const receipts = await getMessageReadReceipts(req.params.id);
    res.json(receipts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch read receipts.' });
  }
});

app.post('/conversations/:id/read-all', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      res.status(400).json({ error: 'userId is required.' });
      return;
    }
    const result = await markConversationMessagesRead(req.params.id, userId);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to mark conversation as read.' });
  }
});

// ── Conversation Events ──────────────────────────────────────────────

app.post('/conversations/:id/events', async (req, res) => {
  try {
    const { eventType, title, description, metadata, actorId, actorName } = req.body;
    if (!eventType || !title) {
      res.status(400).json({ error: 'eventType and title are required.' });
      return;
    }
    const event = await createConversationEvent({
      conversationId: req.params.id,
      eventType, title, description, metadata, actorId, actorName,
    });
    res.status(201).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create event.' });
  }
});

app.get('/conversations/:id/events', async (req, res) => {
  try {
    const events = await getConversationEvents(req.params.id);
    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch events.' });
  }
});

// ── Notifications ────────────────────────────────────────────────────

app.get('/notifications/:userId', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const notifications = await getUserNotifications(req.params.userId, limit);
    const unreadCount = await getUnreadNotificationCount(req.params.userId);
    res.json({ notifications, unreadCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch notifications.' });
  }
});

app.get('/notifications/:userId/unread-count', async (req, res) => {
  try {
    const count = await getUnreadNotificationCount(req.params.userId);
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch unread count.' });
  }
});

app.post('/notifications/:id/read', async (req, res) => {
  try {
    await markNotificationRead(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to mark notification as read.' });
  }
});

app.post('/notifications/user/:userId/read-all', async (req, res) => {
  try {
    const result = await markAllNotificationsRead(req.params.userId);
    res.json({ success: true, count: result.count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to mark all as read.' });
  }
});

// ── Activity Feed ────────────────────────────────────────────────────

app.get('/activity/:userId', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const activity = await getUserActivity(req.params.userId, limit);
    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch activity.' });
  }
});

app.get('/activity', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 100;
    const activity = await getAllActivity(limit);
    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch all activity.' });
  }
});

app.post('/activity', async (req, res) => {
  try {
    const { userId, eventType, title, description, metadata, linkUrl } = req.body;
    if (!userId || !eventType || !title) {
      res.status(400).json({ error: 'userId, eventType, and title are required.' });
      return;
    }
    const item = await createActivityItem({ userId, eventType, title, description, metadata, linkUrl });
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create activity item.' });
  }
});

// ── Sprint 5: Provider Workspace Routes ─────────────────────────────

import {
  getOrCreateWorkspace,
  getWorkspace,
  updateWorkspace,
  getWorkspaceById,
  getAllWorkspacesByRole,
  submitVerification,
  updateVerificationStatus,
  getVerifications,
  getProviderActivityFeed,
} from './lib/provider/service.js';

app.post('/provider/workspace', async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!userId || !role) {
      res.status(400).json({ error: 'userId and role are required.' });
      return;
    }
    const workspace = await getOrCreateWorkspace(userId, role);
    res.status(201).json(workspace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create workspace.' });
  }
});

app.get('/provider/workspace/:userId', async (req, res) => {
  try {
    const workspace = await getWorkspace(req.params.userId);
    if (!workspace) {
      res.status(404).json({ error: 'Workspace not found.' });
      return;
    }
    res.json(workspace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch workspace.' });
  }
});

app.patch('/provider/workspace/:userId', async (req, res) => {
  try {
    const workspace = await updateWorkspace(req.params.userId, req.body);
    res.json(workspace);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update workspace.' });
  }
});

app.get('/provider/workspaces/role/:role', async (req, res) => {
  try {
    const workspaces = await getAllWorkspacesByRole(req.params.role);
    res.json(workspaces);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch workspaces.' });
  }
});

app.post('/provider/verification', async (req, res) => {
  try {
    const { providerId, type, documentUrl, documentName } = req.body;
    if (!providerId || !type) {
      res.status(400).json({ error: 'providerId and type are required.' });
      return;
    }
    const verification = await submitVerification({ providerId, type, documentUrl, documentName });
    res.status(201).json(verification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to submit verification.' });
  }
});

app.patch('/provider/verification/:id', async (req, res) => {
  try {
    const { status, verifiedBy, notes } = req.body;
    if (!status) {
      res.status(400).json({ error: 'status is required.' });
      return;
    }
    const verification = await updateVerificationStatus(req.params.id, status, verifiedBy, notes);
    res.json(verification);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to update verification.' });
  }
});

app.get('/provider/verifications/:providerId', async (req, res) => {
  try {
    const verifications = await getVerifications(req.params.providerId);
    res.json(verifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch verifications.' });
  }
});

app.get('/provider/activity/:userId', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 50;
    const activity = await getProviderActivityFeed(req.params.userId, limit);
    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch provider activity.' });
  }
});

app.get('/agent/allowed-tasks/:role', async (req, res) => {
  try {
    const taskTypes = getAllowedTaskTypesForRole(req.params.role);
    res.json({ role: req.params.role, taskTypes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch allowed tasks.' });
  }
});

// ── Sprint 6: Healthcare Knowledge Platform / Ingestion Routes ─────

import {
  ensureDataSourcesExist,
  runIngestion,
  runAllIngestions,
  findMedicationEquivalents,
  findMedicationByBrand,
  searchMedicationGlobally,
} from './ingestion/orchestrator.js';
import {
  getRecentJobs,
  getDataSourceStats,
} from './ingestion/jobs/service.js';
import {
  findEquivalentsGlobally,
  searchByBrandName,
  getCountriesWithData,
} from './lib/medications/repository.js';

// Initialize data sources on startup
ensureDataSourcesExist().catch((err) => {
  console.error('Failed to ensure data sources:', err);
});

// ── Medication Intelligence Routes ──────────────────────────────────

app.get('/api/medications/equivalents', async (req, res) => {
  try {
    const ingredient = String(req.query.ingredient || '');
    const countryCode = String(req.query.countryCode || '');
    if (!ingredient) {
      res.status(400).json({ error: 'ingredient query parameter is required.' });
      return;
    }

    if (countryCode) {
      const result = await findMedicationEquivalents(ingredient, countryCode);
      res.json(result);
    } else {
      const result = await findEquivalentsGlobally(ingredient);
      res.json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to find medication equivalents.' });
  }
});

app.get('/api/medications/search', async (req, res) => {
  try {
    const query = String(req.query.q || '');
    if (!query) {
      res.status(400).json({ error: 'q query parameter is required.' });
      return;
    }

    const [global, byBrand] = await Promise.all([
      searchMedicationGlobally(query),
      searchByBrandName(query),
    ]);

    res.json({ references: global, brands: byBrand.legacy });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to search medications.' });
  }
});

app.get('/api/medications/countries', async (_req, res) => {
  try {
    const data = await getCountriesWithData();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch countries.' });
  }
});

// ── Ingestion Routes ────────────────────────────────────────────────

app.post('/api/ingestion/run/:sourceType', async (req, res) => {
  try {
    const sourceType = req.params.sourceType.toUpperCase();
    if (!['OPENFDA', 'DAILYMED', 'EMA', 'NHS'].includes(sourceType)) {
      res.status(400).json({ error: 'Invalid source type. Must be OPENFDA, DAILYMED, EMA, or NHS.' });
      return;
    }

    res.json({ success: true, message: `Ingestion started for ${sourceType}` });

    runIngestion(sourceType as 'OPENFDA' | 'DAILYMED' | 'EMA' | 'NHS')
      .then((result) => {
        console.log(`Ingestion complete for ${sourceType}:`, result);
      })
      .catch((err) => {
        console.error(`Ingestion failed for ${sourceType}:`, err);
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to start ingestion.' });
  }
});

app.post('/api/ingestion/run-all', async (_req, res) => {
  try {
    res.json({ success: true, message: 'All ingestions started.' });

    runAllIngestions()
      .then((results) => {
        console.log('All ingestions complete:', results);
      })
      .catch((err) => {
        console.error('Ingestions failed:', err);
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to start ingestions.' });
  }
});

app.get('/api/ingestion/jobs', async (_req, res) => {
  try {
    const limit = Number(_req.query.limit) || 20;
    const jobs = await getRecentJobs(limit);
    res.json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch jobs.' });
  }
});

app.get('/api/ingestion/stats', async (_req, res) => {
  try {
    const stats = await getDataSourceStats();
    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch stats.' });
  }
});

app.get('/api/ingestion/sources', async (_req, res) => {
  try {
    const { prisma } = await import('./lib/db.js');
    const sources = await prisma.dataSource.findMany({
      include: {
        jobs: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
    res.json(sources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch sources.' });
  }
});

// ── Sprint 7: Interpreter Session Routes ────────────────────────────

import {
  createInterpreterSession,
  getInterpreterSession,
  addTranscriptEntry,
  endInterpreterSession,
  getUserInterpreterSessions,
} from './lib/interpreter/session-service.js';

app.post('/interpreter-sessions', async (req, res) => {
  try {
    const { patientId, providerId, sessionId, conversationId, sourceLanguage, targetLanguage, mode } = req.body;
    if (!patientId || !sourceLanguage || !targetLanguage) {
      res.status(400).json({ error: 'patientId, sourceLanguage, and targetLanguage are required.' });
      return;
    }
    const session = await createInterpreterSession({
      patientId, providerId, sessionId, conversationId, sourceLanguage, targetLanguage, mode,
    });

    // Create conversation event if conversationId provided
    if (session.conversationId) {
      createConversationEvent({
        conversationId: session.conversationId,
        eventType: 'INTERPRETER_SESSION_STARTED',
        title: `Interpreter Started`,
        description: `${sourceLanguage} ↔ ${targetLanguage}`,
        metadata: {
          interpreterSessionId: session.id,
          sourceLanguage,
          targetLanguage,
        },
        actorId: patientId,
      }).catch((e) => console.warn('Failed to create conversation event:', e));
    }

    res.status(201).json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to create interpreter session.' });
  }
});

app.get('/interpreter-sessions/:id', async (req, res) => {
  try {
    const session = await getInterpreterSession(req.params.id);
    if (!session) {
      res.status(404).json({ error: 'Interpreter session not found.' });
      return;
    }
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch interpreter session.' });
  }
});

app.get('/interpreter-sessions/user/:userId', async (req, res) => {
  try {
    const sessions = await getUserInterpreterSessions(req.params.userId);
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch interpreter sessions.' });
  }
});

app.post('/interpreter-sessions/:id/exchange', async (req, res) => {
  try {
    const { role, originalText, translatedText, sourceLanguage, targetLanguage } = req.body;
    if (!role || !originalText || !translatedText) {
      res.status(400).json({ error: 'role, originalText, and translatedText are required.' });
      return;
    }
    const session = await addTranscriptEntry(req.params.id, {
      role,
      originalText,
      translatedText,
      sourceLanguage: sourceLanguage || 'unknown',
      targetLanguage: targetLanguage || 'unknown',
      timestamp: new Date().toISOString(),
    });
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to add transcript entry.' });
  }
});

app.post('/interpreter-sessions/:id/end', async (req, res) => {
  try {
    const session = await endInterpreterSession(req.params.id);

    // Create conversation event for ending
    if (session.conversationId) {
      const duration = session.durationSeconds
        ? `${Math.floor(session.durationSeconds / 60)}m ${session.durationSeconds % 60}s`
        : 'Unknown';
      createConversationEvent({
        conversationId: session.conversationId,
        eventType: 'INTERPRETER_ENDED',
        title: 'Interpreter Ended',
        description: `Duration: ${duration}`,
        metadata: {
          interpreterSessionId: session.id,
          durationSeconds: session.durationSeconds,
          transcriptEntryCount: Array.isArray(session.transcript) ? session.transcript.length : 0,
        },
      }).catch((e) => console.warn('Failed to create conversation event:', e));
    }

    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to end interpreter session.' });
  }
});

// ── Transcript Intelligence ──────────────────────────────────────────

app.post('/interpreter-sessions/:id/extract-memory', async (req, res) => {
  try {
    const session = await getInterpreterSession(req.params.id);
    if (!session) {
      res.status(404).json({ error: 'Interpreter session not found.' });
      return;
    }

    const transcript = session.transcript as any[];
    if (!transcript || transcript.length === 0) {
      res.status(400).json({ error: 'No transcript entries to analyze.' });
      return;
    }

    const transcriptText = transcript
      .map((e: any) => `${e.role}: ${e.originalText} → ${e.translatedText}`)
      .join('\n');

    // Use Gemini to extract medical memory candidates
    const { generateText } = await import('./lib/ai/utils.js');
    const extractionPrompt = `
      Analyze the following medical interpreter transcript and extract any mentions of:
      1. Allergies (things the patient is allergic to)
      2. Medications (medications mentioned)
      3. Conditions (medical conditions mentioned)
      4. Procedures (medical procedures mentioned)

      Transcript:
      ${transcriptText}

      Return ONLY a JSON object with arrays: { "allergies": [], "medications": [], "conditions": [], "procedures": [] }
      Only include items that are clearly stated. Do not guess.
    `;

    const extractionResult = await generateText(extractionPrompt);
    let candidates: any = {};
    try {
      const cleaned = extractionResult.replace(/```json|```/g, '').trim();
      candidates = JSON.parse(cleaned);
    } catch {
      console.warn('Failed to parse extraction result:', extractionResult);
    }

    // Store candidates only (no permanent MedicalMemory writes here)
    const candidateInputs: any[] = [];
    const typeMap: Record<string, string> = {
      allergies: 'ALLERGY',
      medications: 'MEDICATION',
      conditions: 'CONDITION',
      procedures: 'PROCEDURE',
    };

    for (const [key, values] of Object.entries(candidates)) {
      const memoryType = typeMap[key];
      if (memoryType && Array.isArray(values)) {
        for (const value of values) {
          if (typeof value === 'string' && value.trim()) {
            candidateInputs.push({
              userId: session.patientId,
              sessionId: session.id,
              memoryType,
              value: value.trim(),
              source: `interpreter-session:${session.id}`,
              status: 'PENDING_REVIEW',
              confidence: 0,
              context: transcriptText,
            });
          }
        }
      }
    }

    let createdCount = 0;
    if (candidateInputs.length > 0) {
      const created = await createCandidates(candidateInputs);
      // createMany returns { count }
      createdCount = typeof created.count === 'number' ? created.count : candidateInputs.length;
    }

    res.json({
      extracted: candidates,
      memoryCandidatesAdded: createdCount,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to extract medical memory.' });
  }
});

// ── Memory Candidate Review Routes ─────────────────────────────

app.get('/memory-candidates/user/:userId', async (req, res) => {
  try {
    const { getUserCandidates } = await import('./lib/medical-memory-candidates/service.js');
    const candidates = await getUserCandidates(req.params.userId);
    res.json(candidates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch memory candidates.' });
  }
});

app.post('/memory-candidates/:id/approve', async (req, res) => {
  try {
    // Security: the approveCandidate() function enforces ownership (candidate.userId === reviewedByUserId)
    // Backend auth wiring is currently unavailable in this Express app bundle.
    const reviewedByUserId = req.body?.reviewedByUserId;
    if (!reviewedByUserId) {
      res.status(400).json({ error: 'reviewedByUserId is required in body for approval.' });
      return;
    }

    const { approveCandidate } = await import('./lib/medical-memory-candidates/service.js');
    const updated = await approveCandidate(req.params.id, reviewedByUserId);
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Unable to approve candidate.' });
  }
});

app.post('/memory-candidates/:id/reject', async (req, res) => {
  try {
    const reviewedByUserId = req.body?.reviewedByUserId;
    if (!reviewedByUserId) {
      res.status(400).json({ error: 'reviewedByUserId is required in body for rejection.' });
      return;
    }

    const { rejectCandidate } = await import('./lib/medical-memory-candidates/service.js');
    const updated = await rejectCandidate(req.params.id, reviewedByUserId);
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Unable to reject candidate.' });
  }
});

// ── Admin Routes

app.get('/api/admin/stats', async (_req, res) => {
  try {
    const [users, sessions, tasks, references, brands, providers] = await Promise.all([
      prisma.user.count(),
      prisma.travelHealthSession.count(),
      prisma.agentTask.count(),
      prisma.medicationReference.count(),
      prisma.brand.count(),
      prisma.provider.count(),
    ]);

    res.json({
      users,
      sessions,
      tasks,
      medicationReferences: references,
      brands,
      providers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Unable to fetch admin stats.' });
  }
});

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Healthcare GLM backend listening on port ${port}`);
});
