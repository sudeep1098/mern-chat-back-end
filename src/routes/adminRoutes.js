import express from "express";
import { Login, Register } from "../controllers/auth.js";
import Validate from "../middleware/validate.js";
import { check } from "express-validator";
import { Verify, VerifyRole } from "../middleware/verify.js";

const router = express.Router();

router.get("/dashboard", Verify, VerifyRole, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to the your Dashboard!",
  });
});

export default router;
