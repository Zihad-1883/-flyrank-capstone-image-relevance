/**
 * Mismatch Guard Safety Core
 * 
 * Production AI safety layer implementing 3 critical decision checks:
 * 1. Vision AI confidence score check (rejects uncertain classifications)
 * 2. Vector Cosine Similarity threshold check (rejects weak matches)
 * 3. Category & Subject validation (rejects category/subject mismatches, e.g. wolf on fox post)
 * 
 * Returns explicit status (MATCHED / REJECTED) with human-readable rejection reasons.
 */

import { MismatchGuardInput, MismatchGuardResult } from './matching.types.js';

export const MIN_CONFIDENCE_THRESHOLD = 0.6;
export const MIN_SIMILARITY_THRESHOLD = 0.65;

export function evaluateMismatchGuard(input: MismatchGuardInput): MismatchGuardResult {
    const { postTitle, postBody, candidate } = input;
    const postText = `${postTitle} ${postBody}`.toLowerCase();

    // Check 1: Vision AI Confidence Check
    if (candidate.confidence !== null && candidate.confidence < MIN_CONFIDENCE_THRESHOLD) {
        return {
            status: 'REJECTED',
            rejection_reason: `Low vision AI confidence (${candidate.confidence.toFixed(2)} < ${MIN_CONFIDENCE_THRESHOLD})`,
        };
    }

    // Check 2: Vector Cosine Similarity Threshold Check
    if (candidate.similarity_score < MIN_SIMILARITY_THRESHOLD) {
        return {
            status: 'REJECTED',
            rejection_reason: `Low vector similarity score (${candidate.similarity_score.toFixed(3)} < ${MIN_SIMILARITY_THRESHOLD})`,
        };
    }

    // Check 3: Subject / Category Contradiction Check
    if (candidate.subject) {
        const subject = candidate.subject.toLowerCase();

        // Fox vs Wolf mismatch
        if ((subject.includes('fox') || subject.includes('vixen')) && postText.includes('wolf') && !postText.includes('fox')) {
            return {
                status: 'REJECTED',
                rejection_reason: `Subject mismatch: Candidate is '${candidate.subject}' but post is about wolf`,
            };
        }
        if (subject.includes('wolf') && (postText.includes('fox') || postText.includes('vixen')) && !postText.includes('wolf')) {
            return {
                status: 'REJECTED',
                rejection_reason: `Subject mismatch: Candidate is '${candidate.subject}' but post is about fox`,
            };
        }

        // Bear mismatch
        if (subject.includes('bear') && !postText.includes('bear') && (postText.includes('fox') || postText.includes('wolf') || postText.includes('dog') || postText.includes('deer'))) {
            return {
                status: 'REJECTED',
                rejection_reason: `Subject mismatch: Candidate is '${candidate.subject}' but post does not mention bears`,
            };
        }

        // Deer / Elk / Fawn mismatch
        if ((subject.includes('deer') || subject.includes('elk') || subject.includes('fawn')) && !postText.includes('deer') && !postText.includes('elk') && !postText.includes('fawn') && (postText.includes('wolf') || postText.includes('fox') || postText.includes('dog'))) {
            return {
                status: 'REJECTED',
                rejection_reason: `Subject mismatch: Candidate is '${candidate.subject}' but post is not about deer/elk`,
            };
        }
    }

    return { status: 'MATCHED' };
}
