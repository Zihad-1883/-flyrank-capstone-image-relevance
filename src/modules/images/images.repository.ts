/**
 * Images Repository
 * 
 * Performs raw SQL queries for the images table (inserting images, updating tags/vectors,
 * querying image records, filtering by flags).
 */

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

