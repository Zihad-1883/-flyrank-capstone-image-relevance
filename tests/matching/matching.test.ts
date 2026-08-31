import { describe, it, expect } from 'vitest';
import { MIN_CONFIDENCE_THRESHOLD, MIN_SIMILARITY_THRESHOLD } from '../../src/modules/matching/mismatch-guard.js';

describe('Matching Service & Vector Search Configuration', () => {
    it('enforces confidence threshold of 0.60', () => {
        expect(MIN_CONFIDENCE_THRESHOLD).toBe(0.60);
    });

    it('enforces cosine similarity threshold of 0.65', () => {
        expect(MIN_SIMILARITY_THRESHOLD).toBe(0.65);
    });
});
