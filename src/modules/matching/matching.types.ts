/**
 * Matching TypeScript Types & Interfaces
 * 
 * Types for vector similarity search results, candidate image rankings,
 * MismatchGuard evaluation results, and rejection explanation objects.
 */

export interface CandidateImage {
    id: number;
    filename: string;
    subject: string | null;
    category: string | null;
    attributes: string[] | null;
    caption: string | null;
    confidence: number | null;
    similarity_score: number;
}

export interface MismatchGuardInput {
    postTitle: string;
    postBody: string;
    candidate: CandidateImage;
}

export interface MismatchGuardResult {
    status: 'MATCHED' | 'REJECTED';
    rejection_reason?: string;
}

export interface SuggestionCandidateResponse {
    suggestion_id?: number;
    post_id: number;
    image_id: number;
    filename: string;
    subject: string | null;
    category: string | null;
    attributes: string[] | null;
    caption: string | null;
    confidence: number | null;
    similarity_score: number;
    status: 'MATCHED' | 'REJECTED';
    rejection_reason?: string | null;
}
