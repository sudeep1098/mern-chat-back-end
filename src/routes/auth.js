import express from "express";
import { Login, Logout, Register } from "../controllers/auth.js";
import Validate from "../middleware/validate.js";
import { check } from "express-validator";
import { Verify } from "../middleware/verify.js";

const router = express.Router();

router.post(
    "/register",
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    check("name")
        .not()
        .isEmpty()
        .withMessage("Your name is required")
        .trim()
        .escape(),
    check("password")
        .notEmpty()
        .isLength({ min: 8 })
        .withMessage("Must be at least 8 chars long"),
    Validate,
    Register
);

router.post(
    "/login",
    check("email")
        .isEmail()
        .withMessage("Enter a valid email address")
        .normalizeEmail(),
    check("password").not().isEmpty(),
    Validate,
    Login
);

router.get("/user", Verify, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "User is authenticated!",
  });
});

router.get('/logout', Verify, Logout);

export default router;