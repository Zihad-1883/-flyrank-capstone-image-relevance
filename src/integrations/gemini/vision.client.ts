/**
 * Gemini Vision API Client
 * 
 * Wraps calls to Gemini Flash vision API to extract structured image metadata (subject, category, attributes, caption, confidence)
 * with Zod schema validation and retry logic.
 */

import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import dotenv from 'dotenv';
import { GEMINI_MODELS } from './gemini.config.js';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const TAGGING_PROMPT = `Look at this image and respond ONLY with JSON in this exact shape, no other text, no markdown formatting:
{
  "subject": string,
  "category": string,
  "attributes": string[],
  "caption": string,
  "confidence": number (0 to 1)
}`;

export interface VisionResult {
    text: string;
    tokensUsed: number;
}

export async function tagImageWithGemini(imagePath: string): Promise<VisionResult> {
    const imageBytes = fs.readFileSync(imagePath);
    const base64Image = imageBytes.toString('base64');

    const response = await ai.models.generateContent({
        model: GEMINI_MODELS.vision,
        contents: [
            {
                role: 'user',
                parts: [
                    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
                    { text: TAGGING_PROMPT },
                ],
            },
        ],
    });

    if (!response.text) {
        throw new Error('Gemini returned an empty response');
    }

    const tokensUsed = response.usageMetadata?.totalTokenCount ?? 0;

    return { text: response.text, tokensUsed };
}