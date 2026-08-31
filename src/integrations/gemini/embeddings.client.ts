/**
 * Gemini Embeddings API Client
 * 
 * Wraps calls to Gemini embeddings model to generate 768-dimensional dense vector embeddings
 * for image captions and blog post text with SEMANTIC_SIMILARITY task type.
 */

import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { GEMINI_MODELS } from './gemini.config.js';
import { env } from '../../config/env.js';

const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

export interface EmbeddingResult {
    embedding: number[];
    tokensUsed: number;
}

function estimateTokensFromText(text: string): number {
    return Math.ceil(text.length / 4);
}

export async function generateEmbedding(text: string): Promise<EmbeddingResult> {
    const response = await ai.models.embedContent({
        model: GEMINI_MODELS.embedding,
        contents: text,
        config: { outputDimensionality: 768 },
    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding) {
        throw new Error('Gemini returned no embedding');
    }

    const tokensUsed = estimateTokensFromText(text);

    return { embedding, tokensUsed };
}