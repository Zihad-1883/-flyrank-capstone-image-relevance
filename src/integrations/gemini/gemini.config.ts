/**
 * Gemini Configuration
 * Gemini API models and pricing per 1k tokens for cost tracking, and default parameters.
 */

export const GEMINI_MODELS = {
    vision: 'gemini-flash-lite-latest', // switched from gemini-flash-latest — much higher free-tier RPD
    embedding: 'gemini-embedding-001',
} as const;

const COST_PER_MILLION_TOKENS = 0.30;

export function estimateCost(tokensUsed: number): number {
    return (tokensUsed / 1_000_000) * COST_PER_MILLION_TOKENS;
}