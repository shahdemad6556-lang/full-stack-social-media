import express from "express";
import {
  getProfile,
  updateProfile,
  searchUsers,
  uploadAvatarImage,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadAvatar } from "../middleware/upload.js";

const router = express.Router();

router.get("/search", protect, searchUsers);
router.put("/profile", protect, updateProfile);
router.post(
  "/avatar",
  protect,
  (req, res, next) =>
    uploadAvatar(req, res, (err) =>
      err ? res.status(400).json({ message: err.message }) : next()
    ),
  uploadAvatarImage
);
router.get("/:username", protect, getProfile);

export default router;