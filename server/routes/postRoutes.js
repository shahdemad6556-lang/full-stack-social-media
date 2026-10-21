import express from "express";
import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getComments,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadPostImage } from "../middleware/upload.js";

const router = express.Router();

const handleUpload = (req, res, next) =>
  uploadPostImage(req, res, (err) =>
    err ? res.status(400).json({ message: err.message }) : next()
  );

router.route("/").get(protect, getPosts).post(protect, handleUpload, createPost);
router.route("/:id").put(protect, updatePost).delete(protect, deletePost);
router.put("/:id/like", protect, toggleLike);
router.route("/:id/comments").get(protect, getComments).post(protect, addComment);

export default router;