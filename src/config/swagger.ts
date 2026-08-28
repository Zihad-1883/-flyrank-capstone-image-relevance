/**
 * Swagger / OpenAPI Configuration
 * 
 * Configures OpenAPI 3.0 specification definitions and Swagger UI endpoints
 * for interactive API documentation.
 */

import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env.js';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI Image Understanding & Content Matching Engine API',
      version: '1.0.0',
      description: `
API specification for the AI Image Understanding & Content Matching Engine backend.

### Key Capabilities:
- **Vision AI & Structured Tags**: Schema-validated image ingestion and classification.
- **Semantic Vector Matching**: pgvector similarity search matching concepts (e.g. *red fox* vs *Vulpes vulpes*).
- **The Mismatch Guard**: 3-check safety layer preventing bad matches (rejects *wolf* for *red fox* post).
- **Batch Jobs & Cost Control**: Off-request background job worker with per-call cost tracking.
- **Review API**: Human-in-the-Loop approval/rejection audit workflow.
      `,
      contact: {
        name: 'FlyRank Backend Engineering Team',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.PORT}`,
        description: 'Local Development Server',
      },
    ],
    tags: [
      { name: 'Health', description: 'System health & root endpoints' },
      { name: 'Images', description: 'Image library ingestion, structured vision tags & confidence' },
      { name: 'Posts', description: 'Blog post creation and content management' },
      { name: 'Matching', description: 'pgvector semantic search & Mismatch Guard safety decision engine' },
      { name: 'Suggestions', description: 'Human-in-the-Loop review & approval workflow' },
      { name: 'Jobs', description: 'Async background batch job processing & retry queue' },
      { name: 'Costs', description: 'Per-call AI API usage cost tracking & metering' },
    ],
    components: {
      schemas: {
        ImageTag: {
          type: 'object',
          properties: {
            subject: { type: 'string', example: 'red fox' },
            category: { type: 'string', example: 'animal' },
            attributes: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['orange fur', 'wild', 'forest']
            },
            caption: { type: 'string', example: 'A red fox standing in a forest' },
            confidence: { type: 'number', example: 0.94 },
          },
        },
        GuardResult: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['MATCHED', 'REJECTED'], example: 'REJECTED' },
            reason: { type: 'string', example: 'Category mismatch: expected fox, detected wolf' },
            similarityScore: { type: 'number', example: 0.82 },
            confidenceScore: { type: 'number', example: 0.95 },
          },
        },
      },
    },
  },
  apis: ['./src/app.ts', './src/modules/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
