import express from "express";
import {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// All routes are protected
router.use(protect);

// User profile route (current user)
router.put("/profile", updateProfile);

// Admin routes (we'll add admin middleware later)
router.get("/", getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
