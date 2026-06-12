import { generateText } from '@/lib/ai/utils';

const languageMap: Record<string, string> = {
  US: 'English',
  IN: 'Hindi',
  JP: 'Japanese',
  GB: 'English',
  DE: 'German',
  FR: 'French',
  BR: 'Portuguese',
  IT: 'Italian',
  ES: 'Spanish',
  MX: 'Spanish',
  AU: 'English',
  TH: 'Thai',
  VN: 'Vietnamese',
  KR: 'Korean',
  SE: 'Swedish',
  AE: 'Arabic',
  ZA: 'English',
  NG: 'English',
  TR: 'Turkish',
  EG: 'Arabic'
};

export function getTargetLanguage(countryCode: string): string {
  return languageMap[countryCode.toUpperCase()] || 'English';
}

export async function translateInterpreterContext(
  context: string,
  countryCode: string
): Promise<string> {
  const targetLanguage = getTargetLanguage(countryCode);

  if (targetLanguage === 'English') {
    return context;
  }

  const prompt = `
You are a precise medical translator. Translate the following patient information document into ${targetLanguage}.

Rules:
- Keep the structure (Patient Location, Symptoms, Allergies, etc.)
- Use medically appropriate terminology in the target language.
- Do not add any new information. Do not diagnose.
- Output ONLY the translated text.

Document to translate:
${context}
  `.trim();

  try {
    return (await generateText(prompt)).trim();
  } catch (error) {
    console.error('Translation error:', error);
    return context;
  }
}
