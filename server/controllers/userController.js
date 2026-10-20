import User from "../models/User.js";
import Post from "../models/Post.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.params.username.toLowerCase(),
    });
    if (!user) return res.status(404).json({ message: "User not found" });
    const postsCount = await Post.countDocuments({ author: user._id });
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
      createdAt: user.createdAt,
      postsCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { name, bio, avatar } = req.body;
    if (name !== undefined && name.trim()) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    await user.save();
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      avatar: user.avatar,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json([]);
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const users = await User.find({
      $or: [{ name: regex }, { username: regex }],
    })
      .select("name username avatar bio")
      .limit(20);
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadAvatarImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });
    const user = await User.findById(req.user._id);
    user.avatar = `/uploads/${req.file.filename}`;
    await user.save();
    res.json({ avatar: user.avatar });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};