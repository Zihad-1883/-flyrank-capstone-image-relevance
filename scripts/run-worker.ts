/**
 * Standalone Worker Execution Script
 * 
 * Command-line entry point to launch the background batch job worker process.
 */

import { processAllPendingJobs } from "../src/modules/jobs/jobs.worker.js";
import { pool } from "../src/db/pool.js";

processAllPendingJobs()
    .then(() => pool.end())
    .catch((err) => {
        console.error('Worker crashed:', err);
        process.exit(1);
    });