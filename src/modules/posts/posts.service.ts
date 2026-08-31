/**
 * Posts Service
 * 
 * Business logic for blog post creation, fetching, updating post embeddings,
 * and managing target categories/subjects.
 */

import { generateEmbedding } from '../../integrations/gemini/embeddings.client.js';
import { estimateCost } from '../../integrations/gemini/gemini.config.js';
import { logCost } from '../costs/costs.repository.js';
import { insertPost, findAllPosts, findPostById } from './posts.repository.js';

export async function createPost(title: string, body: string) {
    const textToEmbed = `${title}\n\n${body}`;

    const { embedding, tokensUsed } = await generateEmbedding(textToEmbed);

    const postId = await insertPost(title, body, embedding);

    const cost = estimateCost(tokensUsed);
    await logCost('embedding', postId, tokensUsed, cost);

    return postId;
}

export async function listPosts() {
    return findAllPosts();
}

export async function getPostById(id: number) {
    return findPostById(id);
}