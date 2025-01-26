import express from "express";
import {
  getMessages,
  markAsRead,
  sendMessage,
} from "../controllers/messageController.js";
import { Verify } from "../middleware/verify.js";

const router = express.Router();

router.post("/", Verify, getMessages);
router.post("/send", Verify, sendMessage);
router.patch("/:messageId/markAsRead", Verify, markAsRead);

export default router;
