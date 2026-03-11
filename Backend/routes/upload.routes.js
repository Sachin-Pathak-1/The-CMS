import express from "express";
import verifyToken from "../middleware/auth.middleware.js";
import { uploadToCloudinaryHandler } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/cloudinary", verifyToken, uploadToCloudinaryHandler);

export default router;
