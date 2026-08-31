/**
 * Express Routes: /posts/*
 * 
 * Defines endpoints for creating, querying, and managing blog posts.
 */

import { Router } from 'express';
import { createPostHandler, getPostsHandler, getPostHandler } from './posts.controller.js';

const router = Router();

router.post('/', createPostHandler);
router.get('/', getPostsHandler);
router.get('/:id', getPostHandler);

export default router;