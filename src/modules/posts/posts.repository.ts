/**
 * Posts Repository
 * 
 * Performs raw SQL queries for the posts table (inserting, fetching, updating vector embeddings).
 */

import { pool } from '../../db/pool.js';
import pgvector from 'pgvector/pg';

export async function insertPost(title: string, body: string, embedding: number[]) {
    const result = await pool.query(
        `INSERT INTO posts (title, body, embedding) 
     VALUES ($1, $2, $3) 
     RETURNING id`,
        [title, body, pgvector.toSql(embedding)]
    );
    return result.rows[0].id;
}

export async function findAllPosts() {
    const result = await pool.query('SELECT id, title, body, created_at FROM posts ORDER BY created_at DESC');
    return result.rows;
}

export async function findPostById(id: number) {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    return result.rows[0] ?? null;
}