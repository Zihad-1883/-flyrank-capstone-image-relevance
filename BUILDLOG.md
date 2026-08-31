# BUILDLOG — Architectural Evolution & AI Usage Log

## 📅 Project History & Iterations

### Day 1: Foundation & Ingestion Pipeline
- Designed PostgreSQL relational schema with `pgvector` extension support.
- Built database migration scripts (`src/db/migrate.sql`) and environment loader.
- Implemented `POST /images/upload` for file uploads, storing image rows and background processing jobs.

### Day 2: Gemini API Integration & Daily Quota Resolution
- Integrated `@google/genai` for vision tagging and text embeddings.
- **Quota Constraint Encountered**: Initial implementation targeted `gemini-3.6-flash` which hit a strict 20 request/day free-tier ceiling.
- **Resolution**: Switched model to `gemini-flash-lite-latest` and updated centralized config `src/integrations/gemini/gemini.config.ts`.
- Fixed hardcoded model parameter in `vision.client.ts`.
- Made seed script idempotent to prevent duplicate dataset insertions.

### Day 3: Background Worker Queue & Cost Tracking
- Extended `jobs.worker.ts` with polling loop, status transitions (`pending` $\rightarrow$ `processing` $\rightarrow$ `done` / `failed`), and failure retries.
- Added 10-second exponential delay backoff on retries to respect Gemini 15 RPM rate limits.
- Implemented `ai_cost_log` repository tracking tokens and calculated USD costs for every API call.
- Successfully processed full 51-image corpus (**51/51 completed `done`**).

### Day 4: Embeddings, pgvector Search, & Mismatch Guard
- Built `POST /posts` auto-generating 768-dimensional text embeddings on post creation.
- Built `GET /posts/:id/suggest` performing pgvector cosine similarity ranking (`1 - (embedding <=> post.embedding)`).
- Implemented `mismatch-guard.ts` evaluating 3 decision rules:
  1. Vision AI Confidence Check (`≥ 0.60`)
  2. Cosine Similarity Threshold Check (`≥ 0.65`)
  3. Subject/Category Contradiction Validation
- Built Human-in-the-Loop review API (`GET /suggestions`, `POST /suggestions/:id/approve`, `POST /suggestions/:id/reject`).

### Day 5: Evaluation Benchmark & Documentation
- Built `tests/eval/precision.eval.ts` benchmark runner computing Top-1 Precision metric (10/10 = **100.0%**).
- Wrote Vitest unit tests for schema validation, worker retry constants, and mismatch guard logic (**12/12 passing**).
- Created `capstone.yaml`, `README.md`, `EVIDENCE.md`, and `BUILDLOG.md`.

---

## 🛠️ Key Architectural Decisions

1. **pgvector for Similarity Search**: Storing 768-dimensional dense vectors directly in PostgreSQL allows atomic transactions alongside relational metadata.
2. **Asynchronous Processing Queue**: Image uploads instantly return `201 Created` with `status: pending`, deferring heavy Gemini AI calls to background workers.
3. **Mismatch Guard Layer**: Prevents semantic hallucinations or misclassifications (such as matching a wolf candidate to a red fox post) from reaching end users.
