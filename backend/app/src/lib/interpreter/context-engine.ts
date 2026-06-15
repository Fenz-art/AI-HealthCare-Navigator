import { prisma } from '../db.js';
import { getMemorySummary } from '../health-memory/service.js';
import { buildInterpreterContext } from './builder.js';
import { getTargetLanguage } from './translator.js';

type ContextSource = 'medical' | 'passport' | 'medication' | 'conversation' | 'memory' | 'session';

export interface InjectedContext {
  raw: string;
  sources: ContextSource[];
  language: string;
  countryCode: string;
}

export async function buildFullContext(params: {
  userId?: string;
  sessionId?: string;
  conversationId?: string;
  countryCode?: string;
  recentTranscripts?: { role: string; text: string }[];
}): Promise<InjectedContext> {
  const sources: ContextSource[] = [];
  const parts: string[] = [];

  // 1. Medical Memory (the moat)
  if (params.userId) {
    try {
      const memory = await getMemorySummary(params.userId);
      const memoryLines: string[] = [];
      if (memory.allergies.length > 0) {
        memoryLines.push(`Known Allergies: ${memory.allergies.join(', ')}`);
        sources.push('medical');
      }
      if (memory.medications.length > 0) {
        memoryLines.push(`Known Medications: ${memory.medications.join(', ')}`);
        sources.push('medical');
      }
      if (memory.conditions.length > 0) {
        memoryLines.push(`Known Conditions: ${memory.conditions.join(', ')}`);
        sources.push('medical');
      }
      if (memory.vaccinations.length > 0) {
        memoryLines.push(`Vaccinations: ${memory.vaccinations.join(', ')}`);
      }
      if (memory.labResults.length > 0) {
        memoryLines.push(`Recent Labs: ${memory.labResults.join(', ')}`);
      }
      if (memoryLines.length > 0) {
        parts.push(`[MEDICAL MEMORY]\n${memoryLines.join('\n')}`);
      }
    } catch (e) {
      console.warn('Failed to load medical memory:', e);
    }
  }

  // 2. Session Context
  if (params.sessionId) {
    try {
      const session = await prisma.travelHealthSession.findUnique({
        where: { id: params.sessionId },
        include: {
          country: true,
          user: {
            include: {
              healthPassport: true,
              healthDocuments: { where: { isSharedInSession: true } },
            },
          },
        },
      });
      if (session) {
        const passport = session.user?.healthPassport ?? null;
        const docs = session.user?.healthDocuments ?? [];
        const ctx = buildInterpreterContext(session as any, passport, docs);
        if (ctx) {
          parts.push(`[SESSION CONTEXT]\n${ctx}`);
          sources.push('session');
        }
        if (session.country) {
          parts.push(`[COUNTRY]\nLocation: ${session.country.name} (${session.country.code})`);
        }
      }
    } catch (e) {
      console.warn('Failed to load session context:', e);
    }
  }

  // 3. Country context
  if (params.countryCode) {
    const language = getTargetLanguage(params.countryCode);
    parts.push(`[TARGET]\nTarget Language: ${language}\nCountry: ${params.countryCode}`);
  }

  // 4. Conversation Recent History
  if (params.conversationId) {
    try {
      const messages = await prisma.message.findMany({
        where: { conversationId: params.conversationId },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
      if (messages.length > 0) {
        const history = messages.reverse().map((m) => {
          const role = m.senderType === 'TRAVELER' ? 'Patient' :
            m.senderType === 'ASSISTANT' || m.senderType === 'AGENT' ? 'Provider' : 'System';
          return `${role}: ${m.content}`;
        });
        parts.push(`[RECENT CONVERSATION]\n${history.join('\n')}`);
        sources.push('conversation');
      }
    } catch (e) {
      console.warn('Failed to load conversation history:', e);
    }
  }

  // 5. Current exchange context (previous turns in this session)
  if (params.recentTranscripts && params.recentTranscripts.length > 0) {
    const exchangeHistory = params.recentTranscripts.map((t) =>
      `${t.role === 'patient' ? 'Patient' : 'Provider'}: ${t.text}`
    );
    parts.push(`[CURRENT EXCHANGE]\n${exchangeHistory.join('\n')}`);
  }

  return {
    raw: parts.join('\n\n'),
    sources,
    language: params.countryCode ? getTargetLanguage(params.countryCode) : 'English',
    countryCode: params.countryCode ?? 'US',
  };
}

export function buildTranslationPrompt(params: {
  context: string;
  transcript: string;
  direction: 'patientToProvider' | 'providerToPatient';
  sourceLanguage: string;
  targetLanguage: string;
}): string {
  const speakerLabel = params.direction === 'patientToProvider' ? 'Patient' : 'Provider';
  const listenerLabel = params.direction === 'patientToProvider' ? 'Provider' : 'Patient';

  return `
You are a precise medical interpreter. Translate the following speech accurately.

${params.context}

Direction: ${speakerLabel} speaks ${params.sourceLanguage} → Translate to ${params.targetLanguage} for the ${listenerLabel}.

Rules:
- Use medically appropriate terminology
- If the ${speakerLabel.toLowerCase()} mentions something that contradicts known medical context (e.g., says "no allergies" but known allergies exist), include the known context naturally
- Preserve the meaning entirely. Do not add new medical advice.
- Output ONLY the translated text. No labels, no explanations.

Speech to translate:
"${params.transcript}"
`.trim();
}
