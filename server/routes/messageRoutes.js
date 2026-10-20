import express from "express";
import {
  getConversations,
  startConversation,
  getMessages,
  sendMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/conversations").get(protect, getConversations).post(protect, startConversation);
router.route("/conversations/:id/messages").get(protect, getMessages).post(protect, sendMessage);

export default router;