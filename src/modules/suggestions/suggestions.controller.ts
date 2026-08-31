/**
 * Suggestions Controller
 * 
 * Handles HTTP requests and responses for Human-in-the-Loop review API endpoints (approve / reject / inspect).
 */

import { Request, Response } from 'express';
import { listSuggestions, getSuggestionById, approveSuggestion, rejectSuggestion } from './suggestions.service.js';

export async function getSuggestionsHandler(req: Request, res: Response) {
    try {
        const statusFilter = req.query.status as string | undefined;
        let reviewedFilter: boolean | undefined = undefined;

        if (req.query.reviewed !== undefined) {
            reviewedFilter = req.query.reviewed === 'true';
        }

        const limit = req.query.limit ? Number(req.query.limit) : 50;

        const suggestions = await listSuggestions(statusFilter, reviewedFilter, limit);
        res.json(suggestions);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve suggestions', details: (err as Error).message });
    }
}

export async function approveSuggestionHandler(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid suggestion ID' });
        }

        const updated = await approveSuggestion(id);
        res.json(updated);
    } catch (err) {
        const message = (err as Error).message;
        if (message.includes('not found')) {
            return res.status(404).json({ error: message });
        }
        res.status(500).json({ error: 'Failed to approve suggestion', details: message });
    }
}

export async function rejectSuggestionHandler(req: Request, res: Response) {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid suggestion ID' });
        }

        const updated = await rejectSuggestion(id);
        res.json(updated);
    } catch (err) {
        const message = (err as Error).message;
        if (message.includes('not found')) {
            return res.status(404).json({ error: message });
        }
        res.status(500).json({ error: 'Failed to reject suggestion', details: message });
    }
}
