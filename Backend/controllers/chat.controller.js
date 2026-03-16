import { z } from "zod";
import { getChatMembers, getConversationMessages, sendMessage } from "../services/chat.service.js";
import { sendError, sendSuccess } from "../utils/response.js";

const sendMessageSchema = z.object({
  receiverId: z.string().min(1),
  body: z.string().max(2000).optional(),
  mediaUrl: z.string().url().optional(),
  mediaType: z.string().optional(),
  fileName: z.string().optional(),
}).refine(data => data.body || data.mediaUrl, {
  message: "Either body or media file must be provided"
});

export const getMembersHandler = async (req, res) => {
  try {
    const members = await getChatMembers(req.user.id);
    return sendSuccess(res, members);
  } catch (error) {
    return sendError(res, "Failed to fetch chat members", 500);
  }
};

export const getConversationHandler = async (req, res) => {
  try {
    const messages = await getConversationMessages(req.user.id, req.params.memberId);
    return sendSuccess(res, messages);
  } catch (error) {
    return sendError(res, "Failed to fetch chat messages", 500);
  }
};

export const sendMessageHandler = async (req, res) => {
  try {
    const validated = sendMessageSchema.parse(req.body);
    const message = await sendMessage(req.user.id, validated.receiverId, {
      body: validated.body || "",
      mediaUrl: validated.mediaUrl || null,
      mediaType: validated.mediaType || null,
      fileName: validated.fileName || null,
    });
    return sendSuccess(res, message, "Message sent");
  } catch (error) {
    if (error.name === "ZodError") {
      return sendError(res, "Validation failed", 400, error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })));
    }

    return sendError(res, error.message || "Failed to send message", 500);
  }
};
