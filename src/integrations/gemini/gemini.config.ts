/**
 * Gemini Configuration
 * pricing per 1k tokens for cost tracking, and default parameters.
 */

const COST_PER_MILLION_TOKENS = 0.30;

export function estimateCost(tokensUsed: number): number {
    return (tokensUsed / 1_000_000) * COST_PER_MILLION_TOKENS;
}