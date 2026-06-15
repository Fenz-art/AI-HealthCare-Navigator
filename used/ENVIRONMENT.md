# CareCompass — Environment Variables

Two apps. Two `.env` files. This document is the canonical reference.

---

## Priority tiers

| Tier | Variables | When needed |
|---|---|---|
| **H0 Hackathon MVP** | `DATABASE_URL` `GEMINI_API_KEY` `GEOAPIFY_API_KEY` `GOOGLE_CLIENT_ID` `GOOGLE_CLIENT_SECRET` `AUTH_SECRET` `NEXT_PUBLIC_API_URL` | Day 1 |
| **V1** | `DEEPGRAM_API_KEY` `ELEVENLABS_API_KEY` `AWS_*` `S3_BUCKET_NAME` | Voice + Health Vault |
| **Production** | `POSTHOG_API_KEY` `SENTRY_DSN` | Monitoring + Analytics |

---

## Backend — `backend/app/.env`

### DATABASE

```
DATABASE_URL=
```
- **Required**
- Target: Aurora PostgreSQL
- Local dev shortcut: `DATABASE_URL="file:./dev.db"` + set `provider = "sqlite"` in `prisma/schema.prisma`
- Production example: `postgresql://user:password@your-aurora-cluster.rds.amazonaws.com:5432/carecompass`

### AI

```
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```
- **Required** (`GEMINI_API_KEY`)
- Used by: Severity Engine · Medication Extraction · Translation · Document Processing · Agent
- Get key: https://aistudio.google.com/app/apikey

### LOCATION & PROVIDERS

```
GEOAPIFY_API_KEY=
```
- **Required**
- Used by: Provider Discovery · Reverse Geocoding · Nearby Pharmacies / Clinics / Hospitals
- Get key: https://myprojects.geoapify.com (free tier: 3 000 req/day)

### AUTH

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
AUTH_SECRET=
```
- **Required** for login
- `AUTH_SECRET` — generate with: `openssl rand -base64 32`
- Google credentials — create at: https://console.cloud.google.com
  - APIs & Services → Credentials → Create OAuth 2.0 Client ID
  - Authorised redirect URI: `http://localhost:3000/api/auth/callback/google`

### INTERPRETER

```
DEEPGRAM_API_KEY=
ELEVENLABS_API_KEY=
ELEVENLABS_LOCAL_VOICE_ID=
ELEVENLABS_ENGLISH_VOICE_ID=
```
- Required for V1 voice features — skip for H0 Hackathon
- Deepgram: https://console.deepgram.com
- ElevenLabs: https://elevenlabs.io

### FILE STORAGE

```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
S3_BUCKET_NAME=carecompass-vault
```
- Required for V1 Health Vault (documents, prescriptions, reports)
- Create bucket at: https://s3.console.aws.amazon.com

### OBSERVABILITY

```
POSTHOG_API_KEY=
SENTRY_DSN=
```
- Optional but strongly recommended for production
- PostHog: https://app.posthog.com
- Sentry: https://sentry.io

### SERVER

```
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```
- All have working defaults

---

## Frontend — `frontend/.env.local`

### API

```
NEXT_PUBLIC_API_URL=http://localhost:4000
```
- Points the frontend client at the Express backend
- Defaults to `http://localhost:4000` if not set

### AUTH

```
AUTH_SECRET=
NEXTAUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```
- `AUTH_SECRET` must match `AUTH_SECRET` in `backend/app/.env` — same value
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` must match `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` in backend

### MAPS

```
NEXT_PUBLIC_MAP_STYLE=
```
- Optional — custom MapLibre dark style URL
- Default CartoDB DarkMatter is used when not set

### ANALYTICS

```
NEXT_PUBLIC_POSTHOG_KEY=
```
- Optional

### FEATURE FLAGS

```
NEXT_PUBLIC_ENABLE_VOICE=true
NEXT_PUBLIC_ENABLE_INTERPRETER=true
NEXT_PUBLIC_ENABLE_AGENT=true
```

---

## Local dev bootstrap sequence

```bash
# 1. Get your keys (takes ~5 min)
#    GEMINI_API_KEY  → https://aistudio.google.com/app/apikey
#    GEOAPIFY_API_KEY → https://myprojects.geoapify.com
#    GOOGLE_CLIENT_ID/SECRET → https://console.cloud.google.com

# 2. Fill in backend/.env
#    Paste your keys, then generate AUTH_SECRET:
openssl rand -base64 32

# 3. Fill in frontend/.env.local
#    Paste the same AUTH_SECRET value

# 4. Bootstrap the database
cd backend/app
npm install
npm run prisma:db:push    # creates tables
npm run prisma:generate   # generates Prisma client
npm run prisma:seed       # seeds medication + country data

# 5. Start both apps
npm run dev               # backend on :4000

cd ../../frontend
npm install
npm run dev               # frontend on :3000
```

---

## Deployment targets

| Layer | Target |
|---|---|
| Frontend | Vercel |
| Backend | Vercel / Railway / AWS ECS |
| Database | Aurora PostgreSQL |
| Storage | AWS S3 |
| Auth | Google OAuth via Auth.js |
| Maps | Geoapify + MapLibre |
| AI | Gemini 2.5 Flash |
| Voice | Deepgram + ElevenLabs |
| Monitoring | PostHog + Sentry |
| Analytics | Vercel Analytics + Speed Insights |
