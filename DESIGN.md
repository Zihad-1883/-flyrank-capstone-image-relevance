# One-Page Design Document — AI Image Matching Engine

**Project**: AI Image Understanding & Content Matching Engine  
**Track**: FlyRank Backend Internship Capstone  
**Author**: Backend Engineering Intern  

---

## 1. Problem Statement
Content publishers manually search for relevant images to attach to blog posts, often choosing mismatched photos (e.g., displaying a wolf on a fox article). This project builds an automated AI image understanding and content matching service featuring a **Mismatch Guard** safety core to guarantee high-relevance recommendations and reject uncertain or mismatched candidates with human-readable explanations.

---

## 2. Data Model Schema
- **`images`**: Stores filename, file path, status (`pending`, `done`, `flagged`, `failed`), tags JSON (`subject`, `category`, `attributes`, `caption`, `confidence`), and 768-dimensional dense vector `embedding`.
- **`image_jobs`**: Queue table for background batch processing with status (`pending`, `processing`, `done`, `failed`), retries, and error logs.
- **`posts`**: Stores post title, body text, created timestamp, and 768-dimensional dense text `embedding`.
- **`suggestions`**: Audit trail of evaluated matches recording `post_id`, `image_id`, `similarity_score`, `status` (`MATCHED` / `REJECTED`), `rejection_reason`, and human review fields (`reviewed_by_human`, `human_decision`).
- **`ai_cost_log`**: Records prompt tokens, candidate tokens, total tokens, and calculated USD costs for every Gemini API call.

---

## 3. API Surface
- `POST /images/upload` — Ingest new image file & enqueue background processing job.
- `GET /images` & `GET /images/:id` — Query image library and AI vision metadata.
- `POST /posts` — Create a new blog post and auto-generate text vector embedding.
- `GET /posts` & `GET /posts/:id/suggest` — Retrieve ranked image recommendations passed through MismatchGuard.
- `GET /suggestions` — Query audit trail of evaluated matches for human review.
- `POST /suggestions/:id/approve` & `POST /suggestions/:id/reject` — Human-in-the-loop review actions.

---

## 4. Layer Architecture Sketch
```
[ HTTP Route Handlers / Express Controllers ]
                   │
                   ▼
  [ Business Logic Services & Mismatch Guard ]
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
[ Database Repositories ]  [ External Gemini AI Clients ]
        │                     │
        ▼                     ▼
[ PostgreSQL + pgvector ]  [ Gemini Flash & Embeddings API ]
```

---

## 5. Explicit Non-Goals
- **No full frontend UI framework**: The service exposes clean, RESTful API endpoints, Swagger UI documentation, and database tables without requiring a complex web frontend.
- **No real-time multi-model comparisons**: System targets Gemini Flash Lite & Gemini Embeddings free tier without running parallel benchmark model comparisons.
