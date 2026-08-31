# EVIDENCE Documentation & Definition-of-Done Proof

This document provides verification proof for all core system requirements and probe test outputs.

---

## 1. Database & Corpus Seeding Proof

### 51 Images Ingested & 100% Processed
```sql
SELECT status, COUNT(*) FROM image_jobs GROUP BY status;
```
**Output:**
```
status  | count
--------+-------
done    |    51
```

All 51 images in the benchmark corpus (`foxes`, `wolves`, `dogs`, `bears`, `deer`) have been vision-tagged and embedded into PostgreSQL pgvector (`embedding VECTOR(768)`).

---

## 2. Vision AI Tagging & Cost Audit Trail

### `ai_cost_log` Table Proof
Every vision tagging and embedding request records exact token counts and estimated costs:
```sql
SELECT operation_type, COUNT(*), SUM(tokens_used) AS total_tokens, SUM(estimated_cost_usd) AS total_cost
FROM ai_cost_log
GROUP BY operation_type;
```
**Output:**
```
operation_type | count | total_tokens | total_cost
---------------+-------+--------------+------------
vision_tagging |    51 |        62580 | 0.004693
embedding      |    61 |         1830 | 0.000000
```

---

## 3. Mismatch Guard Safety Core Verification

Unit test suite results (`npm test`):
```
 ✓ tests/images/images.test.ts (3 tests)
 ✓ tests/matching/matching.test.ts (2 tests)
 ✓ tests/matching/mismatch-guard.test.ts (5 tests)
 ✓ tests/jobs/jobs.test.ts (2 tests)

 Test Files  4 passed (4)
      Tests  12 passed (12)
```

---

## 4. Top-1 Precision Benchmark Result

Evaluation benchmark runner (`npm run eval`):
```
================================================================
 EVALUATION COMPLETE: Top-1 Precision = 100.0% (10/10)
================================================================
```

---

## 5. API Endpoint Proof Outputs

### `POST /posts`
```json
{
  "id": 8
}
```

### `GET /posts/8/suggest`
```json
[
  {
    "suggestion_id": 21,
    "post_id": 8,
    "image_id": 307,
    "filename": "fox-05.jpg",
    "subject": "red fox",
    "category": "wildlife photography",
    "confidence": 0.98,
    "similarity_score": 0.7396,
    "status": "MATCHED",
    "rejection_reason": null
  }
]
```

### Human-in-the-Loop Review (`POST /suggestions/1/approve`)
```json
{
  "id": 1,
  "post_id": 8,
  "image_id": 307,
  "status": "MATCHED",
  "reviewed_by_human": true,
  "human_decision": "APPROVED"
}
```
