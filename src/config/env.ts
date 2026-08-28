/**
 * Environment Configuration
 * 
 * Loads and validates application environment variables using Zod schema.
 * Ensures required API keys, database connection strings, and server settings exist before runtime.
 */

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
    POSTGRES_USER: z.string().optional(),
    POSTGRES_PASSWORD: z.string().optional(),
    POSTGRES_DB: z.string().optional(),
    DATABASE_URL: z.string().url("DATABASE_URL must be a valid PostgreSQL connection string"),
    GEMINI_API_KEY: z.string().min(1, "GEMINI_API_KEY is required"),
    PORT: z.coerce.number().default(5000),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error("Invalid environment variables:", _env.error.format());
    process.exit(1);
}

export const env = _env.data;
