/**
 * Database Seed Script
 * 
 * Inserts demo images (~40 across 4+ categories) and blog posts (including red fox, wolf, tech, landscape articles)
 * into the database for testing and demonstration.
 */

import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { createImageWithJob } from '../modules/images/images.service.js';
import { pool } from './pool.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const seedImagesDir = path.join(__dirname, '..', '..', 'seed-data', 'images');

async function getAlreadySeededFilenames(): Promise<Set<string>> {
    const result = await pool.query('SELECT filename FROM images');
    return new Set(result.rows.map((r) => r.filename));
}

async function seedImages() {
    const files = readdirSync(seedImagesDir).filter((f) =>
        /\.(jpg|jpeg|png|webp)$/i.test(f)
    );

    const alreadySeeded = await getAlreadySeededFilenames();

    console.log(`Found ${files.length} image(s) in folder.`);

    let successCount = 0;
    let skippedCount = 0;
    let failCount = 0;

    for (const filename of files) {
        if (alreadySeeded.has(filename)) {
            console.log(`  ⏭️  Skipped (already seeded): ${filename}`);
            skippedCount++;
            continue;
        }

        const filePath = path.join(seedImagesDir, filename);
        try {
            const imageId = await createImageWithJob(filename, filePath);
            console.log(`  ✅ Registered: ${filename} (id: ${imageId})`);
            successCount++;
        } catch (err) {
            console.error(`  ❌ Failed to register ${filename}:`, (err as Error).message);
            failCount++;
        }
    }

    console.log(`\nDone. New: ${successCount}, Skipped: ${skippedCount}, Failed: ${failCount}`);
    await pool.end();
}

seedImages().catch((err) => {
    console.error('Seed script crashed:', err);
    process.exit(1);
});