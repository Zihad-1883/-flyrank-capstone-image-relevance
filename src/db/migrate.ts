import { readdirSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { pool } from './pool.js';

console.log('DEBUG DATABASE_URL:', process.env.DATABASE_URL);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, 'migrations');

async function runMigrations() {
    const files = readdirSync(migrationsDir)
        .filter((f) => f.endsWith('.sql'))
        .sort();

    for (const file of files) {
        const filePath = path.join(migrationsDir, file);
        const sql = readFileSync(filePath, 'utf-8');
        console.log(`Running migration: ${file}`);
        await pool.query(sql);
    }

    console.log('All migrations completed.');
    await pool.end();
}

runMigrations().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});