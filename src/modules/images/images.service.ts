/**
 * Images Service
 * 
 * Business logic for image ingestion, uploading, listing, filtering by category,
 * and managing image metadata records.
 */

import { pool } from "../../db/pool.js";
import { insertImage, insertImageJob } from "./images.repository.js";

export async function createImageWithJob(filename: string, filePath: string) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const imageId = await insertImage(client, filename, filePath);
        await insertImageJob(client, imageId, 'vision_tagging');

        await client.query('COMMIT');
        return imageId;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

