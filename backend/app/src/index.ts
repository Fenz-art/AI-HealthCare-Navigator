import express from 'express';
import dotenv from 'dotenv';
import { ZodError } from 'zod';
import { prisma } from '@/lib/db';
import { createTravelHealthSession, getTravelHealthSession } from '@/lib/session/service';
import { CreateSessionSchema, WorkflowInputSchema } from '@/lib/session/schema';
import { findLocalEquivalents } from '@/lib/medications/repository';
import { findNearbyProviders } from '@/lib/providers/geoapify';
import { recordOutcome, OutcomeSchema } from '@/lib/outcomes/service';
import { buildInterpreterContext } from '@/lib/interpreter/builder';
import { executeWorkflow } from '@/lib/workflow/orchestrator';
import { getTargetLanguage } from '@/lib/interpreter/translator';
import { translateAndExtractDocument } from '@/lib/vault/translator';
import { Prisma, ProviderType } from '@prisma/client';

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

const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`Healthcare GLM backend listening on port ${port}`);
});
