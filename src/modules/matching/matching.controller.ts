/**
 * Matching Controller
 * 
 * Handles HTTP requests/responses for image matching and candidate suggestion evaluation endpoints.
 */

import { Request, Response } from 'express';
import { suggestImagesForPost } from './matching.service.js';

export async function getSuggestionsHandler(req: Request, res: Response) {
    try {
        const postId = Number(req.params.id);
        if (isNaN(postId)) {
            return res.status(400).json({ error: 'Invalid post ID' });
        }

        const limit = req.query.limit ? Number(req.query.limit) : 5;
        const suggestions = await suggestImagesForPost(postId, limit);

        res.json(suggestions);
    } catch (err) {
        const message = (err as Error).message;
        if (message.includes('not found')) {
            return res.status(404).json({ error: message });
        }
        res.status(500).json({ error: 'Failed to retrieve image suggestions', details: message });
    }
}
