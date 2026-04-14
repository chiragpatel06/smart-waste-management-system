import express from "express";
import {
  createMessage,
  getMessages,
  updateMessageStatus,
  replyToMessage,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/", createMessage);
router.get("/", getMessages);
router.put("/:id/status", updateMessageStatus);
router.put("/:id/reply", replyToMessage);

export default router;
