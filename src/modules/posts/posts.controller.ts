/**
 * Posts Controller
 * 
 * Handles HTTP requests and responses for blog post endpoints, delegating work to PostsService.
 */

import { Request, Response } from 'express';
import { CreatePostSchema } from './posts.schema.js';
import { createPost, listPosts, getPostById } from './posts.service.js';

export async function createPostHandler(req: Request, res: Response) {
    const result = CreatePostSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ error: 'Invalid post data', details: result.error.flatten() });
    }

    try {
        const postId = await createPost(result.data.title, result.data.body);
        res.status(201).json({ id: postId });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create post', details: (err as Error).message });
    }
}

export async function getPostsHandler(req: Request, res: Response) {
    const posts = await listPosts();
    res.json(posts);
}

export async function getPostHandler(req: Request, res: Response) {
    const post = await getPostById(Number(req.params.id));
    if (!post) {
        return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
}