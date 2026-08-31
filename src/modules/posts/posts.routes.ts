/**
 * Express Routes: /posts/*
 * 
 * Defines endpoints for creating, querying, and managing blog posts and requesting image suggestions.
 */

import { Router } from 'express';
import { createPostHandler, getPostsHandler, getPostHandler } from './posts.controller.js';
import { getSuggestionsHandler } from '../matching/matching.controller.js';

const router = Router();

router.post('/', createPostHandler);
router.get('/', getPostsHandler);
router.get('/:id/suggest', getSuggestionsHandler);
router.get('/:id', getPostHandler);

export default router;