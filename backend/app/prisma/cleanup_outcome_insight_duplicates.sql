-- Removes duplicates for OutcomeInsight so we can safely add
-- unique constraint on ("journeyId", "insightType").
-- Rule: keep newest "generatedAt" per (journeyId, insightType).

BEGIN;

-- Preview (optional): uncomment to see duplicates
-- SELECT "journeyId", "insightType", COUNT(*)
-- FROM "OutcomeInsight"
-- GROUP BY "journeyId", "insightType"
-- HAVING COUNT(*) > 1;

WITH ranked AS (
  SELECT
    id,
    ROW_NUMBER() OVER (
      PARTITION BY "journeyId", "insightType"
      ORDER BY "generatedAt" DESC, id DESC
    ) AS rn
  FROM "OutcomeInsight"
)
DELETE FROM "OutcomeInsight" o
USING ranked r
WHERE o.id = r.id
  AND r.rn > 1;

COMMIT;
