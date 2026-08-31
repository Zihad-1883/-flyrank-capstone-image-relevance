/**
 * Images Controller
 * 
 * Handles HTTP requests/responses for image endpoints, extracts parameters,
 * delegates logic to ImagesService, and formats response payloads.
 */

import { Request, Response } from 'express';
import { createImageWithJob, getImageById, listImages } from './images.service.js';

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

export async function getImages(req: Request, res: Response) {
    const images = await listImages();
    res.json(images);
}

export async function getImage(req: Request, res: Response) {
    const image = await getImageById(Number(req.params.id));
    if (!image) {
        return res.status(404).json({ error: 'Image not found' });
    }
    res.json(image);
}