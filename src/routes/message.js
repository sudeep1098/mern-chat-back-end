import express from "express";
import {
  getSentMessages,
  getReceivedMessages,
  markAsRead,
  sendMessage,
} from "../controllers/messageController.js";
import { Verify } from "../middleware/verify.js";

const router = express.Router();

router.get("/sent/:receiverId", Verify, getSentMessages);
router.get("/received/:receiverId", Verify, getReceivedMessages);
router.post("/send", Verify, sendMessage);
router.patch("/:messageId/markAsRead", Verify, markAsRead);

export default router;
