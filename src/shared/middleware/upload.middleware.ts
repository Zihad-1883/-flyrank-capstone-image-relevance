// src/shared/middleware/upload.middleware.ts
/**
 * Upload Middleware
 * 
 * Configures Multer for file uploads, handling storage and filename generation.
 */

import multer from 'multer';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});

export const upload = multer({ storage });