# CareCompass Environment Variables

This project has two connected apps: the backend service in `backend/app` and the frontend app in `frontend`.

## Backend environment variables

These variables are required or highly recommended for the backend server to run correctly.

- `DATABASE_URL`
  - Required
  - PostgreSQL connection string for Prisma.
  - Example: `postgresql://user:password@localhost:5432/healthcare`

- `GEMINI_API_KEY`
  - Required for AI generation and document translation features.
  - Used by `backend/app/src/lib/ai/gemini.ts`.

- `GEMINI_MODEL`
  - Optional, defaults to `gemini-pro`.
  - Used by the Gemini client to choose the generative model.

- `GEOAPIFY_API_KEY`
  - Required for provider lookup and local pharmacy/clinic search.
  - Used by `backend/app/src/lib/providers/geoapify.ts`.

- `CORS_ORIGIN`
  - Optional, comma-separated allowed origins for CORS.
  - Defaults to `http://localhost:3000`.

- `PORT`
  - Optional backend port.
  - Defaults to `4000`.

- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
  - Required only if authentication is enabled via Google login.
  - Used by `backend/app/src/auth.ts`.

- `DEEPGRAM_API_KEY`
  - Optional voice transcription integration.
  - Used by `backend/app/src/app/api/interpreter/process-audio/route.ts`.

- `ELEVENLABS_API_KEY`
  - Optional text-to-speech integration.
  - Used by `backend/app/src/app/api/interpreter/process-audio/route.ts`.

- `ELEVENLABS_LOCAL_VOICE_ID` and `ELEVENLABS_ENGLISH_VOICE_ID`
  - Optional voice selection for ElevenLabs TTS.
  - Defaults are handled in code when not set.

## Frontend environment variables

- `NEXT_PUBLIC_API_URL`
  - Optional
  - Base URL for the backend API used by the frontend client.
  - Defaults to `http://localhost:4000` when not provided.

## Notes

- Store secrets in a `.env` or `.env.local` file in each app directory.
- The backend `GEMINI_API_KEY`, `GEOAPIFY_API_KEY`, and `DATABASE_URL` are the most important values for Sprint 8/9 features.
- If you do not need voice or auth features yet, you can omit `DEEPGRAM_API_KEY`, `ELEVENLABS_API_KEY`, `GOOGLE_CLIENT_ID`, and `GOOGLE_CLIENT_SECRET`.



There are still unrelated project-level TypeScript issues in other backend/frontend routes due to missing dependencies like next/server, next-auth, and some legacy route files. Those are outside the Sprint 8/9 consent/vault implementation fix.