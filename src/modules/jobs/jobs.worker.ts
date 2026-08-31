/**
 * Background Job Worker Loop
 * 
 * Asynchronous background worker process that polls for pending image vision/embedding jobs,
 * executes Gemini vision classification with retries (exponential backoff), tracks cost,
 * updates DB records, and flags low-confidence images.
 */

import { pool } from "../../db/pool.js";
import { estimateCost } from "../../integrations/gemini/gemini.config.js";
import { tagImageWithGemini } from "../../integrations/gemini/vision.client.js";
import { logCost } from "../costs/costs.repository.js";
import { parseAndValidateTag } from "../images/images.schema.js";

const MAX_RETRIES = 3;

export async function processNextJob(): Promise<boolean> {
    const jobResult = await pool.query(`
    SELECT j.id AS job_id, j.image_id, j.retries, i.file_path
    FROM image_jobs j
    JOIN images i ON i.id = j.image_id
    WHERE j.status = 'pending' AND j.job_type = 'vision_tagging'
    LIMIT 1
  `);

    if (jobResult.rows.length === 0) {
        return false;
    }

    const job = jobResult.rows[0];

    await pool.query(`UPDATE image_jobs SET status = 'processing' WHERE id = $1`, [job.job_id]);

    try {
        const visionResult = await tagImageWithGemini(job.file_path);
        const tag = parseAndValidateTag(visionResult.text);

        const cost = estimateCost(visionResult.tokensUsed);
        await logCost('vision_tagging', job.image_id, visionResult.tokensUsed, cost);

        if (!tag) {
            throw new Error('Invalid or unparseable AI response');
        }
    } catch (err) {
        const newRetries = (job.retries ?? 0) + 1;
        const errorMessage = (err as Error).message;

        if (newRetries >= MAX_RETRIES) {
            await pool.query(
                `UPDATE image_jobs SET status = 'failed', retries = $1, error_message = $2 WHERE id = $3`,
                [newRetries, errorMessage, job.job_id]
            );

            await pool.query(`UPDATE images SET status = 'flagged' WHERE id = $1`, [job.image_id]);
            console.log(`🚩 Flagged image ${job.image_id} after ${newRetries} failed attempts`);
        }
        else {
            await pool.query(
                `UPDATE image_jobs SET status = 'pending', retries = $1, error_message = $2 WHERE id = $3`,
                [newRetries, errorMessage, job.job_id]
            );
            console.log(` Retry ${newRetries}/${MAX_RETRIES} for image ${job.image_id}`);
        }
    }
    return true
}

export async function processAllPendingJobs() {
    let processed = true;
    let count = 0;

    while (processed) {
        processed = await processNextJob();
        if (processed) count++;
    }

    console.log(`Finished. Processed ${count} job(s). No more pending jobs.`);
}