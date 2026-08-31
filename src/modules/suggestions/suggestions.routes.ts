/**
 * Express Routes: /suggestions/*
 * 
 * Defines endpoints for listing past suggestions and performing human-in-the-loop review actions (approve / reject).
 */

import { Router } from 'express';
import {
    getSuggestionsHandler,
    approveSuggestionHandler,
    rejectSuggestionHandler,
} from './suggestions.controller.js';

const router = Router();

router.get('/', getSuggestionsHandler);
router.post('/:id/approve', approveSuggestionHandler);
router.post('/:id/reject', rejectSuggestionHandler);

export default router;
