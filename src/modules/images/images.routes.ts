/**
 * Express Routes: /images/*
 * 
 * Defines endpoints for uploading images, querying image library,
 * viewing structured tags, and fetching flagged low-confidence images.
 */

import { Router } from "express";
import { upload } from "../../shared/middleware/upload.middleware.js";
import { getImages, getImage, uploadImage } from "./images.controller.js";


const imageRouter = Router();

imageRouter.post("/upload", upload.single("image"), uploadImage);
imageRouter.get("/", getImages);
imageRouter.get("/:id", getImage);

export default imageRouter;