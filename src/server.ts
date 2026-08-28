/**
 * HTTP Server Entry Point
 * 
 * Initializes database connection pool, validates configuration,
 * and starts the HTTP server listening on the configured PORT.
 */

import app from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./db/pool.js";

app.listen(env.PORT, async () => {
    try {
        await pool.query("SELECT NOW() as current_time, 1 as status");
        console.log(`Server is running on port ${env.PORT}`);
    } catch (error) {
        console.error("Failed to connect to database", error);
        process.exit(1);
    }
});