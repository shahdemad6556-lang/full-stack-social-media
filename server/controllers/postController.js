import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js";

const extractTags = (text) => [
  ...new Set(
    (text.match(/#[\p{L}\p{N}_]+/gu) || []).map((t) => t.slice(1).toLowerCase())
  ),
];

export const createPost = async (req, res) => {
  try {
    const text = (req.body.text || "").trim();
    const image = req.file ? `/uploads/${req.file.filename}` : "";
    if (!text && !image) {
      return res.status(400).json({ message: "Add some text or an image" });
    }
    const post = await Post.create({
      author: req.user._id,
      text,
      image,
      tags: extractTags(text),
    });
    await post.populate("author", "name username avatar");
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const filter = {};
    if (req.query.user) filter.author = req.query.user;
    if (req.query.q) {
      const raw = req.query.q.trim();
      const safe = raw.replace(/^#/, "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (raw.startsWith("#")) {
        filter.tags = safe.toLowerCase();
      } else {
        filter.$or = [
          { text: new RegExp(safe, "i") },
          { tags: safe.toLowerCase() },
        ];
      }
    }
    const posts = await Post.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "name username avatar");
    const total = await Post.countDocuments(filter);
    res.json({ posts, hasMore: page * limit < total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }
    if (typeof req.body.text === "string") {
      post.text = req.body.text;
      post.tags = extractTags(post.text);
    }
    await post.save();
    await post.populate("author", "name username avatar");
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }
    await Comment.deleteMany({ post: post._id });
    await Notification.deleteMany({ post: post._id });
    await post.deleteOne();
    res.json({ message: "Post deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const userId = req.user._id.toString();
    const liked = post.likes.some((id) => id.toString() === userId);
    if (liked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(req.user._id);
      if (post.author.toString() !== userId) {
        await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          type: "like",
          post: post._id,
        });
      }
    }
    await post.save();
    res.json({ _id: post._id, likes: post.likes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment text is required" });
    }
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const comment = await Comment.create({
      post: post._id,
      author: req.user._id,
      text,
    });
    post.commentsCount += 1;
    await post.save();
    if (post.author.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: "comment",
        post: post._id,
      });
    }
    await comment.populate("author", "name username avatar");
    res.status(201).json({ comment, commentsCount: post.commentsCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .sort({ createdAt: 1 })
      .populate("author", "name username avatar");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
