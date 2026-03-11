import { z } from "zod";
import { uploadBase64ToCloudinary } from "../utils/cloudinary.js";
import { sendError, sendSuccess } from "../utils/response.js";

const uploadSchema = z.object({
  fileName: z.string().min(1).max(255),
  dataUrl: z.string().min(1),
  folder: z.string().min(1).max(120).optional(),
  publicId: z.string().min(1).max(160).optional(),
});

export const uploadToCloudinaryHandler = async (req, res) => {
  try {
    const validated = uploadSchema.parse(req.body);
    const upload = await uploadBase64ToCloudinary({
      dataUrl: validated.dataUrl,
      folder: validated.folder || "learnytics",
      publicId: validated.publicId,
    });

    return sendSuccess(res, {
      url: upload.secure_url,
      publicId: upload.public_id,
      originalFilename: validated.fileName,
    }, "File uploaded successfully");
  } catch (error) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation failed", 400, error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })));
    }

    return sendError(res, error.message || "Failed to upload file", 500);
  }
};
