/**
 * Images Controller
 * 
 * Handles HTTP requests/responses for image endpoints, extracts parameters,
 * delegates logic to ImagesService, and formats response payloads.
 */

import { Request, Response } from 'express';
import { createImageWithJob } from './images.service.js';

export async function uploadImage(req: Request, res: Response) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const imageId = await createImageWithJob(req.file.filename, req.file.path);
        res.status(201).json(
            {
                id: imageId,
                status: 'pending'
            });
    } catch (err) {
        res.status(500).json(
            {
                error: 'Failed to upload image',
                details: (err as Error).message
            });
    }
}