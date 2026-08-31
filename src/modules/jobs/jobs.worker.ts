/**
 * Background Job Worker Loop
 * 
 * Asynchronous background worker process that polls for pending image vision/embedding jobs,
 * executes Gemini vision classification with retries (exponential backoff), tracks cost,
 * updates DB records, and flags low-confidence images.
 */

import { pool } from '../../db/pool.js';
import { tagImageWithGemini } from '../../integrations/gemini/vision.client.js';
import { generateEmbedding } from '../../integrations/gemini/embeddings.client.js';
import { parseAndValidateTag } from '../images/images.schema.js';
import { estimateCost } from '../../integrations/gemini/gemini.config.js';
import { logCost } from '../costs/costs.repository.js';
import pgvector from 'pgvector/pg';

const MAX_RETRIES = 3;

export async function processNextJob(): Promise<boolean> {
    const jobResult = await pool.query(`
    SELECT j.id AS job_id, j.image_id, j.retries, i.file_path
    FROM image_jobs j
    JOIN images i ON i.id = j.image_id
    WHERE j.status = 'pending' AND j.job_type = 'vision_tagging'
    ORDER BY j.retries ASC, j.id ASC
    LIMIT 1
  `);

    if (jobResult.rows.length === 0) {
        return false;
    }

    const job = jobResult.rows[0];

    await pool.query(`UPDATE image_jobs SET status = 'processing' WHERE id = $1`, [job.job_id]);

    try {
        // Step 1: Vision tagging
        const visionResult = await tagImageWithGemini(job.file_path);

        const visionCost = estimateCost(visionResult.tokensUsed);
        await logCost('vision_tagging', job.image_id, visionResult.tokensUsed, visionCost);

        const tag = parseAndValidateTag(visionResult.text);

        if (!tag) {
            throw new Error('Invalid or unparseable AI response');
        }

        // Step 2: Generate embedding from the caption
        const embeddingResult = await generateEmbedding(tag.caption);

        const embeddingCost = estimateCost(embeddingResult.tokensUsed);
        await logCost('embedding', job.image_id, embeddingResult.tokensUsed, embeddingCost);

        // Step 3: Save everything together
        await pool.query(
            `UPDATE images 
       SET subject = $1, category = $2, attributes = $3, caption = $4, confidence = $5, 
           embedding = $6, status = 'processed'
       WHERE id = $7`,
            [
                tag.subject,
                tag.category,
                tag.attributes,
                tag.caption,
                tag.confidence,
                pgvector.toSql(embeddingResult.embedding),
                job.image_id,
            ]
        );

        await pool.query(`UPDATE image_jobs SET status = 'done' WHERE id = $1`, [job.job_id]);

        console.log(`Processed image ${job.image_id}: ${tag.subject}`);
    } catch (err) {
        const newRetries = (job.retries ?? 0) + 1;
        const errorMessage = (err as Error).message;

        if (newRetries >= MAX_RETRIES) {
            await pool.query(
                `UPDATE image_jobs SET status = 'failed', retries = $1, error_message = $2 WHERE id = $3`,
                [newRetries, errorMessage, job.job_id]
            );
            await pool.query(`UPDATE images SET status = 'flagged' WHERE id = $1`, [job.image_id]);
            console.log(`Flagged image ${job.image_id} after ${newRetries} failed attempts`);
        } else {
            await pool.query(
                `UPDATE image_jobs SET status = 'pending', retries = $1, error_message = $2 WHERE id = $3`,
                [newRetries, errorMessage, job.job_id]
            );
            console.log(`Retry ${newRetries}/${MAX_RETRIES} for image ${job.image_id}`);
            await delay(10000);
        }
    }

    return true;
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function processAllPendingJobs() {
    let processed = true;
    let count = 0;

    while (processed) {
        processed = await processNextJob();
        if (processed) {
            count++;
            await delay(4000);
        }
    }

    console.log(`Finished. Processed ${count} job(s). No more pending jobs.`);
}