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

const router = express.Router();

router.route("/").get(protect, getPosts).post(protect, createPost);
router.route("/:id").put(protect, updatePost).delete(protect, deletePost);
router.put("/:id/like", protect, toggleLike);
router.route("/:id/comments").get(protect, getComments).post(protect, addComment);

export default router;