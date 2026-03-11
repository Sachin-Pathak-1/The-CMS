import express from "express";
import verifyToken from "../middleware/auth.middleware.js";
import { getConversationHandler, getMembersHandler, sendMessageHandler } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/members", verifyToken, getMembersHandler);
router.get("/conversations/:memberId", verifyToken, getConversationHandler);
router.post("/messages", verifyToken, sendMessageHandler);

export default router;
