# Sprint 8.5 — Outcome Intelligence Agent hardening

## Step 0 — Discovery (done)
- Reviewed existing Outcome Intelligence code paths.

## Step 1 — Idempotency (highest priority)
- [x] Add Prisma uniqueness constraint: OutcomeInsight(journeyId, insightType)
- [x] Switch OutcomeInsight creation to upsert()

- [ ] Make MedicationOutcome idempotent (decide keying strategy or delete+recreate per medication)
- [ ] Make ProviderOutcome idempotent (ensure upsert + stable calculations; confirm no extra rows)


## Step 2 — Medication Normalization
- [ ] Implement normalizeMedicationName() (trim/lowercase/collapse whitespace)
- [ ] Apply normalization at write time for journeys and/or outcomes
- [ ] Ensure analytics use normalizedMedication

## Step 3 — Provider Sourcing Audit
- [ ] Trace how HealthcareJourney.providerId is populated
- [ ] Confirm null behavior and whether multiple providers per journey are supported
- [ ] Verify ProviderOutcome.providerId aggregation source
- [ ] Fix sourcing if providerId is missing/incorrect

## Step 4 — Summary Endpoint Validation
- [ ] Align GET /outcomes/user/:userId/summary response field names
- [ ] Ensure stable response shape with empty-data defaults
- [ ] Keep existing APIs compiling

## Step 5 — Verification
- [ ] Run backend typecheck/build
- [ ] Run Prisma migration
- [ ] Manually hit POST /journeys/:id/outcome twice and verify no duplicate rows
- [ ] Re-run summary endpoint and confirm stable output

