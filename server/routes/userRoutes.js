import express from "express";
import {
  getProfile,
  updateProfile,
  searchUsers,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/search", protect, searchUsers);
router.put("/profile", protect, updateProfile);
router.get("/:username", protect, getProfile);

export default router;