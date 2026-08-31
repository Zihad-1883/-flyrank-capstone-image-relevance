/**
 * Posts Zod Validation Schemas
 * 
 * Zod schemas for validating post creation payloads and query parameters.
 */

import { z } from 'zod';

export const CreatePostSchema = z.object({
    title: z.string().min(1),
    body: z.string().min(1),
});

export type CreatePostInput = z.infer<typeof CreatePostSchema>;