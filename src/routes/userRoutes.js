import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserByToken,
} from "../controllers/userController.js";
import { Verify } from "../middleware/verify.js";

const router = express.Router();

router.get("/currentUser", Verify, getUserByToken);
router.route("/").get(getUsers).post(createUser);
router.route("/:id").get(getUserById).put(updateUser).delete(deleteUser);

export default router;
