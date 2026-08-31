/**
 * Automated Tests: Mismatch Guard Safety Core
 * 
 * Verifies key capstone safety guarantees:
 * 1. Low vision AI confidence images (< 0.60) are REJECTED.
 * 2. Low vector similarity candidates (< 0.65) are REJECTED.
 * 3. Subject/category mismatches (e.g. Wolf on Fox post, Fox on Wolf post) are REJECTED with clear reasons.
 * 4. Valid fox image on fox post is MATCHED.
 */

import { describe, it, expect } from 'vitest';
import { evaluateMismatchGuard } from '../../src/modules/matching/mismatch-guard.js';

describe('Mismatch Guard Safety Engine', () => {
    it('1. Rejects candidate if vision AI confidence is below 0.60', () => {
        const result = evaluateMismatchGuard({
            postTitle: 'Red Fox in the Woods',
            postBody: 'A red fox creeping through autumn leaves.',
            candidate: {
                id: 101,
                filename: 'blurry.jpg',
                subject: 'red fox',
                category: 'wildlife',
                attributes: ['blurry'],
                caption: 'Unclear animal in fog',
                confidence: 0.45,
                similarity_score: 0.85,
            },
        });

        expect(result.status).toBe('REJECTED');
        expect(result.rejection_reason).toContain('Low vision AI confidence');
    });

    it('2. Rejects candidate if vector similarity score is below 0.65', () => {
        const result = evaluateMismatchGuard({
            postTitle: 'Red Fox in the Woods',
            postBody: 'A red fox creeping through autumn leaves.',
            candidate: {
                id: 102,
                filename: 'car.jpg',
                subject: 'red fox',
                category: 'wildlife',
                attributes: ['red'],
                caption: 'A red sports car parked outside',
                confidence: 0.95,
                similarity_score: 0.42,
            },
        });

        expect(result.status).toBe('REJECTED');
        expect(result.rejection_reason).toContain('Low vector similarity score');
    });

    it('3. Rejects wolf candidate on red fox post due to subject contradiction', () => {
        const result = evaluateMismatchGuard({
            postTitle: 'Red Fox in Autumn Woodlands',
            postBody: 'Red foxes are versatile predators with reddish coats and bushy tails.',
            candidate: {
                id: 103,
                filename: 'wolf-01.jpg',
                subject: 'grey wolf',
                category: 'wildlife photography',
                attributes: ['grey', 'forest'],
                caption: 'A grey wolf standing in snowy pine woods',
                confidence: 0.95,
                similarity_score: 0.72,
            },
        });

        expect(result.status).toBe('REJECTED');
        expect(result.rejection_reason).toContain('Subject mismatch');
        expect(result.rejection_reason).toContain('grey wolf');
    });

    it('4. Rejects fox candidate on grey wolf post due to subject contradiction', () => {
        const result = evaluateMismatchGuard({
            postTitle: 'The Silent Pack: Grey Wolf Behaviour in Winter',
            postBody: 'Grey wolves hunt in coordinated packs across tundra and forest regions.',
            candidate: {
                id: 104,
                filename: 'fox-01.jpg',
                subject: 'red fox',
                category: 'wildlife photography',
                attributes: ['red', 'orange'],
                caption: 'A red fox sitting in the woods',
                confidence: 0.98,
                similarity_score: 0.71,
            },
        });

        expect(result.status).toBe('REJECTED');
        expect(result.rejection_reason).toContain('Subject mismatch');
        expect(result.rejection_reason).toContain('red fox');
    });

    it('5. Approves matching red fox image on red fox post', () => {
        const result = evaluateMismatchGuard({
            postTitle: 'Red Fox in Autumn Woodlands',
            postBody: 'Red foxes are versatile predators with reddish coats and bushy tails.',
            candidate: {
                id: 105,
                filename: 'fox-02.jpg',
                subject: 'red fox',
                category: 'wildlife photography',
                attributes: ['red', 'forest'],
                caption: 'A red fox looking at camera in forest',
                confidence: 0.95,
                similarity_score: 0.78,
            },
        });

        expect(result.status).toBe('MATCHED');
        expect(result.rejection_reason).toBeUndefined();
    });
});
