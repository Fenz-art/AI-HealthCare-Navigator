import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@deepgram/sdk';
import { model } from '@/lib/ai/gemini';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const ProcessAudioSchema = z.object({
  audioBase64: z.string(),
  sessionId: z.string(),
  direction: z.enum(['toLocal', 'toEnglish']),
});

const languageMap: Record<string, string> = {
  JP: 'Japanese',
  TH: 'Thai',
  MX: 'Spanish',
  FR: 'French',
  DE: 'German',
  BR: 'Portuguese',
  IT: 'Italian',
  ES: 'Spanish',
  IN: 'Hindi',
  GB: 'English',
  US: 'English',
  AU: 'English',
  KR: 'Korean',
  VN: 'Vietnamese',
  TR: 'Turkish',
  AE: 'Arabic',
  EG: 'Arabic',
  ZA: 'Afrikaans',
  NG: 'English',
  SE: 'Swedish',
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { audioBase64, sessionId, direction } = ProcessAudioSchema.parse(body);

    // 1. Fetch Session Context
    const session = await prisma.travelHealthSession.findUnique({
      where: { id: sessionId },
      include: {
        medRecs: true,
        providerRecs: true,
      },
    });

    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // 2. Deepgram STT
    if (!process.env.DEEPGRAM_API_KEY) {
      console.warn('DEEPGRAM_API_KEY not configured, using mock transcription');
      var transcript = '[Mock Transcription - Deepgram not configured]';
    } else {
      try {
        const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
        const audioBuffer = Buffer.from(audioBase64, 'base64');
        
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
          mimetype: 'audio/webm',
          language: direction === 'toLocal' ? 'en' : undefined,
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

    // 3. Gemini Context-Aware Translation
    const targetLanguage = languageMap[session.countryId || 'US'] || 'English';

    const medRecsText = session.medRecs && Array.isArray(session.medRecs)
      ? (session.medRecs as any[]).map((m: any) => `${m.brand?.name || 'Unknown'} (${m.activeIngredient?.name || 'Unknown'})`).join(', ')
      : 'None';

    const prompt = `
      You are a medical interpreter assisting a traveler. 
      Translate the following speech based on the direction.
      
      Patient Context (MUST FACTOR THIS IN):
      Symptoms: ${session.symptoms.join(', ')}
      Allergies: ${session.allergies.join(', ') || 'None'}
      Current Meds: ${session.currentMeds.join(', ') || 'None'}
      Recommended Meds: ${medRecsText}

      Direction: ${direction === 'toLocal' ? `English to ${targetLanguage}` : `${targetLanguage} to English`}
      
      Rule: If the provider asks about allergies, and the patient forgets, inject the allergy context naturally in the translation.
      
      Speech to translate:
      "${transcript}"
      
      Output strictly ONLY the translated text. No pleasantries, no labels.
    `;

    const translationResult = await model.generateContent(prompt);
    const translatedText = translationResult.response.text().trim();

    // 4. ElevenLabs TTS (Mock if not configured)
    let responseBase64 = '';
    if (!process.env.ELEVENLABS_API_KEY) {
      console.warn('ELEVENLABS_API_KEY not configured, skipping TTS');
    } else {
      try {
        const voiceId = direction === 'toLocal' 
          ? process.env.ELEVENLABS_LOCAL_VOICE_ID || 'default'
          : process.env.ELEVENLABS_ENGLISH_VOICE_ID || 'default';

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
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.errors }, { status: 400 });
    }
    console.error('Interpreter Pipeline Error:', error);
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
