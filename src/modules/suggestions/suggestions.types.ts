/**
 * Suggestions TypeScript Types & Interfaces
 * 
 * TypeScript types for suggestion objects, human review statuses (PENDING, APPROVED, REJECTED),
 * and review audit trail entries.
 */

export interface Suggestion {
    id: number;
    post_id: number;
    image_id: number | null;
    similarity_score: number | null;
    status: 'MATCHED' | 'REJECTED';
    rejection_reason: string | null;
    reviewed_by_human: boolean;
    human_decision: 'APPROVED' | 'REJECTED' | null;
    created_at: string;
}

export interface SuggestionWithDetails extends Suggestion {
    post_title?: string;
    image_filename?: string;
    image_subject?: string;
    image_category?: string;
    image_caption?: string;
}
