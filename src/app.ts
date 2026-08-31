/**
 * Express Application Setup
 * 
 * Configures Express application middleware, CORS, body parsers,
 * error handling middleware, and mounts all module API routes.
 */

import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import imageRouter from './modules/images/images.routes.js';
import postsRouter from './modules/posts/posts.routes.js';
import suggestionsRouter from './modules/suggestions/suggestions.routes.js';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
    res.json({
        message: 'AI Image Understanding & Content Matching Engine API',
        docs: '/docs',
        healthCheck: '/health'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/images', imageRouter);
app.use('/posts', postsRouter);
app.use('/suggestions', suggestionsRouter);

export default app;