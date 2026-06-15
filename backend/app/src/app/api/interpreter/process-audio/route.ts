import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';
import { model } from '@/lib/ai/gemini';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { auth } from '@/auth';
import { buildFullContext, buildTranslationPrompt } from '@/lib/interpreter/context-engine';
import { addTranscriptEntry } from '@/lib/interpreter/session-service';





const ProcessAudioSchema = z.object({
  audioBase64: z.string(),
  direction: z.enum(['patientToProvider', 'providerToPatient']),
  interpreterSessionId: z.string().optional(),
  sessionId: z.string().optional(),
  conversationId: z.string().optional(),
  userId: z.string().optional(), // ignored for authorization (IDOR hardening)
  countryCode: z.string().optional(),
  sourceLanguage: z.string().optional(),
  targetLanguage: z.string().optional(),
  startNewSession: z.boolean().optional(),
});

const languageMap: Record<string, string> = {
  JP: 'Japanese', TH: 'Thai', MX: 'Spanish', FR: 'French',
  DE: 'German', BR: 'Portuguese', IT: 'Italian', ES: 'Spanish',
  IN: 'Hindi', GB: 'English', US: 'English', AU: 'English',
  KR: 'Korean', VN: 'Vietnamese', TR: 'Turkish', AE: 'Arabic',
  EG: 'Arabic', ZA: 'Afrikaans', NG: 'English', SE: 'Swedish',
};

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const authUserId = session?.user?.id as string | undefined;

    if (!authUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ProcessAudioSchema.parse(body);
    const { audioBase64, direction, interpreterSessionId, sessionId, conversationId, sourceLanguage, targetLanguage, startNewSession } = parsed;


    let activeSessionId = interpreterSessionId;
    let sourceLang = sourceLanguage;
    let targetLang = targetLanguage;

    // Resolve languages from direction and session context
    if (!sourceLang || !targetLang) {
      if (sessionId) {
        const session = await prisma.travelHealthSession.findUnique({
          where: { id: sessionId },
          include: { country: true },
        });
        if (session?.country?.code) {
          const countryCode = session.country.code;
          if (direction === 'patientToProvider') {
            sourceLang = languageMap[countryCode] || 'Vietnamese';
            targetLang = 'English';
          } else {
            sourceLang = 'English';
            targetLang = languageMap[countryCode] || 'Vietnamese';
          }
        }
      }
      if (!sourceLang) sourceLang = direction === 'patientToProvider' ? 'Vietnamese' : 'English';
      if (!targetLang) targetLang = direction === 'patientToProvider' ? 'English' : 'Vietnamese';
    }

    // IDOR hardening: never trust request body identity keys.
    // Treat interpreterSessionId/sessionId/conversationId as lookup keys only.

    // Resolve / validate interpreter session ownership.
    // Rule: caller must match interpreterSession.patientId OR interpreterSession.providerId.
    const interpreterSession = activeSessionId
      ? await prisma.interpreterSession.findUnique({ where: { id: activeSessionId } })
      : null;

    if (activeSessionId && !interpreterSession) {
      return NextResponse.json({ error: 'Interpreter session not found' }, { status: 404 });
    }

    // If session exists, enforce ownership.
    if (interpreterSession) {
      const isParticipant = interpreterSession.patientId === authUserId ||
        interpreterSession.providerId === authUserId;

      if (!isParticipant) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // Start new session if requested.
    // New sessions are created only for the authenticated user as patient.
    if (startNewSession) {
      // For new session creation, we still require the caller to be authenticated (already enforced).
      // Use authUserId as the only identity input.
      const newSession = await prisma.interpreterSession.create({
        data: {
          patientId: authUserId,
          sessionId: sessionId || null,
          conversationId: conversationId || null,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
          mode: 'bidirectional',
          active: true,
          transcript: [],
        },
      });
      activeSessionId = newSession.id;
    }


    // 1. Deepgram STT
    let transcript = '';
    if (!process.env.DEEPGRAM_API_KEY) {
      console.warn('DEEPGRAM_API_KEY not configured, using mock transcription');
      transcript = '[Mock Transcription - Deepgram not configured]';
    } else {
      try {
        const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
        const audioBuffer = Buffer.from(audioBase64, 'base64');

        const sttLanguage = direction === 'providerToPatient' ? 'en' :
          sourceLang === 'English' ? 'en' : undefined;

        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
          mimetype: 'audio/webm',
          language: sttLanguage,
        });

        if (error || !result?.results?.channels?.[0]?.alternatives?.[0]?.transcript) {
          transcript = '[Transcription failed]';
        } else {
          transcript = result.results.channels[0].alternatives[0].transcript;
        }
      } catch (error) {
        console.error('Deepgram error:', error);
        transcript = '[Deepgram service unavailable]';
      }
    }

    // 2. Load recent transcript context from active interpreter session
    let recentTranscripts: { role: string; text: string }[] = [];
    if (activeSessionId) {
      try {
        const activeSession = await prisma.interpreterSession.findUnique({ where: { id: activeSessionId } });
        if (activeSession) {
          const t = activeSession.transcript as any[];
          recentTranscripts = t.slice(-10).map((entry: any) => ({
            role: entry.role,
            text: entry.originalText,
          }));
        }
      } catch (e) {
        console.warn('Failed to load recent transcripts:', e);
      }
    }

    // 3. Build context engine
    const contextInfo = await buildFullContext({
      userId: authUserId,
      sessionId,
      conversationId,
      countryCode: (await prisma.travelHealthSession.findUnique({ where: { id: sessionId || '' } }))?.country?.id || undefined,
      recentTranscripts,
    });


    // 4. Gemini Context-Aware Translation
    const prompt = buildTranslationPrompt({
      context: contextInfo.raw,
      transcript,
      direction,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
    });

    const translationResult = await model.generateContent(prompt);
    const translatedText = translationResult.response.text().trim();

    // 5. Store the exchange in the interpreter session
    let storedSession = null;
    if (activeSessionId) {
      try {
        storedSession = await addTranscriptEntry(activeSessionId, {
          role: direction === 'patientToProvider' ? 'patient' : 'provider',
          originalText: transcript,
          translatedText,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
          timestamp: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Failed to store transcript entry:', e);
      }
    }

    // 6. ElevenLabs TTS
    let responseBase64 = '';
    if (!process.env.ELEVENLABS_API_KEY) {
      console.warn('ELEVENLABS_API_KEY not configured, skipping TTS');
    } else {
      try {
        const voiceId = direction === 'patientToProvider'
          ? process.env.ELEVENLABS_ENGLISH_VOICE_ID || 'default'
          : process.env.ELEVENLABS_LOCAL_VOICE_ID || 'default';

        const ttsResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': process.env.ELEVENLABS_API_KEY!,
          },
          body: JSON.stringify({
            text: translatedText,
            model_id: 'eleven_multilingual_v2',
            voice_settings: { stability: 0.5, similarity_boost: 0.75 },
          }),
        });

        if (ttsResponse.ok) {
          const audioArrayBuffer = await ttsResponse.arrayBuffer();
          responseBase64 = Buffer.from(audioArrayBuffer).toString('base64');
        }
      } catch (error) {
        console.error('ElevenLabs error:', error);
      }
    }

    return NextResponse.json({
      transcript,
      translatedText,
      audioBase64: responseBase64,
      interpreterSessionId: activeSessionId,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang,
      contextSources: contextInfo.sources,
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }
    console.error('Interpreter Pipeline Error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
