/**
 * Images Repository
 * 
 * Performs raw SQL queries for the images table (inserting images, updating tags/vectors,
 * querying image records, filtering by flags).
 */

import { pool } from "../../db/pool.js";

export async function insertImage(client: any, fileName: string, filePath: string) {
    const result = await client.query(
        `INSERT INTO images (filename, file_path, status)
        VALUES ($1, $2, 'pending')
        RETURNING *`,
        [fileName, filePath]
    );
    return result.rows[0].id;
}


export async function insertImageJob(client: any, imageId: number, jobType: string) {
    await client.query(
        `INSERT INTO image_jobs (image_id, job_type, status)
        VALUES ($1, $2, 'pending')`,
        [imageId, jobType]
    );
}

export async function findAllImages() {
    const result = await pool.query('SELECT * FROM images ORDER BY created_at DESC');
    return result.rows;
}

export async function findImageById(id: number) {
    const result = await pool.query('SELECT * FROM images WHERE id = $1', [id]);
    return result.rows[0] ?? null;
}
