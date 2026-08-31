/**
 * Express Routes: /images/*
 * 
 * Defines endpoints for uploading images, querying image library,
 * viewing structured tags, and fetching flagged low-confidence images.
 */

import { Router } from "express";
import { upload } from "../../shared/middleware/upload.middleware.js";
import { uploadImage } from "./images.controller.js";


const imageRouter = Router();

imageRouter.post("/upload", upload.single("image"), uploadImage);

export default imageRouter;