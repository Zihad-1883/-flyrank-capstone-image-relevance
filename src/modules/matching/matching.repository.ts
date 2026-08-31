/**
 * Matching Repository
 * 
 * Executes pgvector cosine similarity search queries across processed image vector embeddings
 * and saves candidate suggestions to the suggestions table.
 */

import { pool } from '../../db/pool.js';
import pgvector from 'pgvector/pg';
import { CandidateImage } from './matching.types.js';

export async function findCandidateImagesByVector(
    postEmbedding: number[],
    limit: number = 5
): Promise<CandidateImage[]> {
    const result = await pool.query(
        `SELECT 
       id,
       filename,
       subject,
       category,
       attributes,
       caption,
       confidence,
       1 - (embedding <=> $1) AS similarity_score
     FROM images
     WHERE status = 'processed' AND embedding IS NOT NULL
     ORDER BY embedding <=> $1 ASC
     LIMIT $2`,
        [pgvector.toSql(postEmbedding), limit]
    );

    return result.rows.map((row) => ({
        id: row.id,
        filename: row.filename,
        subject: row.subject,
        category: row.category,
        attributes: row.attributes,
        caption: row.caption,
        confidence: row.confidence !== null ? parseFloat(row.confidence) : null,
        similarity_score: parseFloat(row.similarity_score),
    }));
}

export async function saveSuggestion(
    postId: number,
    imageId: number,
    similarityScore: number,
    status: 'MATCHED' | 'REJECTED',
    rejectionReason?: string | null
): Promise<number> {
    const result = await pool.query(
        `INSERT INTO suggestions (post_id, image_id, similarity_score, status, rejection_reason)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
        [postId, imageId, similarityScore, status, rejectionReason ?? null]
    );
    return result.rows[0].id;
}
