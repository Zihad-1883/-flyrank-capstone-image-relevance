/**
 * Suggestions Service
 * 
 * Business logic for Human-in-the-Loop review process (approving, rejecting, listing candidate suggestions).
 */

import { findAllSuggestions, findSuggestionById, updateHumanReview } from './suggestions.repository.js';
import { SuggestionWithDetails } from './suggestions.types.js';

export async function listSuggestions(
    statusFilter?: string,
    reviewedFilter?: boolean,
    limit: number = 50
): Promise<SuggestionWithDetails[]> {
    return findAllSuggestions(statusFilter, reviewedFilter, limit);
}

export async function getSuggestionById(id: number): Promise<SuggestionWithDetails | null> {
    return findSuggestionById(id);
}

export async function approveSuggestion(id: number): Promise<SuggestionWithDetails> {
    const suggestion = await findSuggestionById(id);
    if (!suggestion) {
        throw new Error(`Suggestion with ID ${id} not found`);
    }

    const updated = await updateHumanReview(id, 'APPROVED');
    if (!updated) {
        throw new Error(`Failed to approve suggestion ${id}`);
    }

    return updated;
}

export async function rejectSuggestion(id: number): Promise<SuggestionWithDetails> {
    const suggestion = await findSuggestionById(id);
    if (!suggestion) {
        throw new Error(`Suggestion with ID ${id} not found`);
    }

    const updated = await updateHumanReview(id, 'REJECTED');
    if (!updated) {
        throw new Error(`Failed to reject suggestion ${id}`);
    }

    return updated;
}
