# AI Image Understanding & Content Matching Engine

An enterprise-grade AI vision tagging, vector embedding, and intelligent image-to-post matching engine built with **Node.js (TypeScript)**, **Express**, **PostgreSQL with pgvector**, and **Google Gemini AI (`gemini-flash-lite-latest`)**.

---

## 🌟 Key Features

1. **AI Vision Tagging Pipeline**: Multi-modal image analysis yielding subject, category, attributes, caption, and confidence score.
2. **Dense Vector Embeddings**: 768-dimensional dense vector embeddings generated for both image captions and blog post texts.
3. **pgvector Similarity Search**: Fast cosine similarity retrieval (`<=>` distance metric) for matching candidate images to blog posts.
4. **Mismatch Guard Safety Core**: Production-grade safety engine enforcing 3 strict decision rules:
   - Vision AI Confidence Score Check (`≥ 0.60`)
   - Vector Cosine Similarity Threshold Check (`≥ 0.65`)
   - Category & Subject Contradiction Validation (prevents cross-species/category errors, e.g. wolf candidate on fox post)
5. **Human-in-the-Loop Review Workflow**: API endpoints (`POST /suggestions/:id/approve`, `POST /suggestions/:id/reject`, `GET /suggestions`) for human oversight and audit trails.
6. **Token & Cost Tracking**: Detailed cost logging for every Gemini API call recorded in `ai_cost_log`.

---

## 🏗️ System Architecture

```
                                +-------------------+
                                |   Client / API    |
                                +---------+---------+
                                          |
                                          v
+------------------+             +--------+--------+            +-------------------+
|  Upload Image    +------------>| Express Router  |<---------->|   Swagger Docs    |
+------------------+             +--------+--------+            +-------------------+
                                          |
                                          v
                                 +--------+--------+
                                 | PostgreSQL DB   |
                                 |  + pgvector     |
                                 +--------+--------+
                                          ^
                                          |
                                 +--------+--------+
                                 | Background      |
                                 | Worker Loop     |
                                 +--------+--------+
                                          |
                                          v
                                 +--------+--------+
                                 | Gemini AI       |
                                 | (Vision + Embed)|
                                 +-----------------+
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v20+)
- Docker & Docker Compose (for PostgreSQL + pgvector)

### 1. Installation & Environment Setup
```bash
# Clone the repository
git clone <repo-url>
cd image-matching-engine

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Set your GEMINI_API_KEY in .env
```

### 2. Start Database Container
```bash
docker-compose up -d
```

### 3. Run Database Migrations & Seed Corpus
```bash
# Execute SQL migrations
npm run migrate

# Seed 51-image test dataset into DB
npm run seed
```

### 4. Start Background Worker
```bash
npm run worker
```

### 5. Start API Server
```bash
npm run dev
# Server listening on http://localhost:5000
```

---

## 🧪 Evaluation & Testing

```bash
# Run unit test suite (Vitest)
npm test

# Run Top-1 Precision Metric Benchmark
npm run eval
```

---

## 📚 API Endpoint Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/images/upload` | Upload image & enqueue processing job |
| `GET` | `/images` | List ingested images and metadata |
| `GET` | `/images/:id` | Get detailed image record |
| `POST` | `/posts` | Create blog post & auto-generate vector embedding |
| `GET` | `/posts` | List blog posts |
| `GET` | `/posts/:id/suggest` | Retrieve pgvector matches filtered via MismatchGuard |
| `GET` | `/suggestions` | List candidate suggestions for audit review |
| `POST` | `/suggestions/:id/approve` | Human review: approve image match |
| `POST` | `/suggestions/:id/reject` | Human review: reject image match |

---

## ⚠️ Limitations & Future Work
- Free-tier rate limits (15 RPM) require worker backoff pauses during heavy batch jobs.
- Vector index performance: For production scale (> 1,000,000 images), an `IVFFlat` or `HNSW` pgvector index should be added.
