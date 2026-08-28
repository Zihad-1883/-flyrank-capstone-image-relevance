/**
 * PostgreSQL Connection Pool Setup
 * 
 * Configures database connection pooling using pg/pgvector, manages database connections,
 * and handles connection lifecycle events.
 */

import { Pool } from 'pg';
import dotenv from 'dotenv';
import { env } from '../config/env.js';

dotenv.config();

export const pool = new Pool({
    connectionString: env.DATABASE_URL,
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle Postgres client', err);
    process.exit(-1);
});