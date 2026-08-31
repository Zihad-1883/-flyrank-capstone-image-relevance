/**
 * Costs Repository
 * 
 * Performs raw SQL queries for the ai_cost_log table (inserting cost records, aggregating cost sums).
 */

import { pool } from '../../db/pool.js';

export async function logCost(operation: string, referenceId: number, tokensUsed: number, estimatedCost: number) {
    await pool.query(
        `INSERT INTO ai_cost_log (operation, reference_id, tokens_used, estimated_cost) 
     VALUES ($1, $2, $3, $4)`,
        [operation, referenceId, tokensUsed, estimatedCost]
    );
}