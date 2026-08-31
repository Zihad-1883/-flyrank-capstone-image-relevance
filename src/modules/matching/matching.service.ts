/**
 * Matching Service
 * 
 * Orchestrates pgvector similarity queries across post embeddings and image embeddings,
 * retrieves candidate matches, and feeds candidates into the MismatchGuard safety decision engine.
 */

import { findPostById } from '../posts/posts.repository.js';
import { findCandidateImagesByVector, saveSuggestion } from './matching.repository.js';
import { evaluateMismatchGuard } from './mismatch-guard.js';
import { SuggestionCandidateResponse, SuggestionResponseEnvelope } from './matching.types.js';

export async function suggestImagesForPost(
    postId: number,
    limit: number = 5
): Promise<SuggestionResponseEnvelope> {
    const post = await findPostById(postId);
    if (!post) {
        throw new Error(`Post with ID ${postId} not found`);
    }

    if (!post.embedding) {
        throw new Error(`Post ${postId} does not have a vector embedding`);
    }

    // Convert vector if returned as string/array from pg
    let embeddingArray: number[] = post.embedding;
    if (typeof post.embedding === 'string') {
        embeddingArray = JSON.parse(post.embedding);
    }

    const candidates = await findCandidateImagesByVector(embeddingArray, limit);

    const suggestions: SuggestionCandidateResponse[] = [];

    for (const candidate of candidates) {
        const guardResult = evaluateMismatchGuard({
            postTitle: post.title,
            postBody: post.body,
            candidate,
        });

        const suggestionId = await saveSuggestion(
            post.id,
            candidate.id,
            candidate.similarity_score,
            guardResult.status,
            guardResult.rejection_reason
        );

        suggestions.push({
            suggestion_id: suggestionId,
            post_id: post.id,
            image_id: candidate.id,
            filename: candidate.filename,
            subject: candidate.subject,
            category: candidate.category,
            attributes: candidate.attributes,
            caption: candidate.caption,
            confidence: candidate.confidence,
            similarity_score: candidate.similarity_score,
            status: guardResult.status,
            rejection_reason: guardResult.rejection_reason ?? null,
        });
    }

    const matchedCount = suggestions.filter((s) => s.status === 'MATCHED').length;
    const hasConfidentMatch = matchedCount > 0;
    const message = hasConfidentMatch
        ? `Found ${matchedCount} matching image candidate(s)`
        : 'No confident match found. Candidates rejected due to low similarity or subject/category mismatch.';

    return {
        post_id: post.id,
        has_confident_match: hasConfidentMatch,
        message,
        suggestions,
    };
}
