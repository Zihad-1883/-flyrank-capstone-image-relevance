/**
 * Suggestions Repository
 * 
 * Performs raw SQL queries for suggestions table (inserting candidates, updating review statuses, querying audit trails).
 */

import { pool } from '../../db/pool.js';
import { SuggestionWithDetails } from './suggestions.types.js';

export async function findAllSuggestions(
    statusFilter?: string,
    reviewedFilter?: boolean,
    limit: number = 50
): Promise<SuggestionWithDetails[]> {
    let query = `
    SELECT 
      s.id,
      s.post_id,
      s.image_id,
      s.similarity_score,
      s.status,
      s.rejection_reason,
      s.reviewed_by_human,
      s.human_decision,
      s.created_at,
      p.title AS post_title,
      i.filename AS image_filename,
      i.subject AS image_subject,
      i.category AS image_category,
      i.caption AS image_caption
    FROM suggestions s
    LEFT JOIN posts p ON p.id = s.post_id
    LEFT JOIN images i ON i.id = s.image_id
    WHERE 1=1
  `;

    const values: (string | boolean | number)[] = [];
    let paramIndex = 1;

    if (statusFilter) {
        query += ` AND s.status = $${paramIndex++}`;
        values.push(statusFilter);
    }

    if (reviewedFilter !== undefined) {
        query += ` AND s.reviewed_by_human = $${paramIndex++}`;
        values.push(reviewedFilter);
    }

    query += ` ORDER BY s.id DESC LIMIT $${paramIndex++}`;
    values.push(limit);

    const result = await pool.query(query, values);
    return result.rows;
}

export async function findSuggestionById(id: number): Promise<SuggestionWithDetails | null> {
    const result = await pool.query(
        `SELECT 
       s.id,
       s.post_id,
       s.image_id,
       s.similarity_score,
       s.status,
       s.rejection_reason,
       s.reviewed_by_human,
       s.human_decision,
       s.created_at,
       p.title AS post_title,
       i.filename AS image_filename,
       i.subject AS image_subject,
       i.category AS image_category,
       i.caption AS image_caption
     FROM suggestions s
     LEFT JOIN posts p ON p.id = s.post_id
     LEFT JOIN images i ON i.id = s.image_id
     WHERE s.id = $1`,
        [id]
    );

    return result.rows[0] ?? null;
}

export async function updateHumanReview(
    id: number,
    decision: 'APPROVED' | 'REJECTED'
): Promise<SuggestionWithDetails | null> {
    const result = await pool.query(
        `UPDATE suggestions 
     SET reviewed_by_human = true, human_decision = $1 
     WHERE id = $2 
     RETURNING *`,
        [decision, id]
    );

    if (result.rows.length === 0) {
        return null;
    }

    return findSuggestionById(id);
}
