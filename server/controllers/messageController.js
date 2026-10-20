import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const getConversations = async (req, res) => {
  try {
    const convs = await Conversation.find({ participants: req.user._id })
      .sort({ updatedAt: -1 })
      .populate("participants", "name username avatar");
    res.json(
      convs.map((c) => ({
        _id: c._id,
        lastMessage: c.lastMessage,
        updatedAt: c.updatedAt,
        other: c.participants.find(
          (p) => p._id.toString() !== req.user._id.toString()
        ),
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const startConversation = async (req, res) => {
  try {
    const other = await User.findOne({
      username: (req.body.username || "").toLowerCase(),
    });
    if (!other) return res.status(404).json({ message: "User not found" });
    if (other._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot message yourself" });
    }
    let conv = await Conversation.findOne({
      participants: { $all: [req.user._id, other._id] },
    });
    if (!conv) {
      conv = await Conversation.create({ participants: [req.user._id, other._id] });
    }
    res.json({
      _id: conv._id,
      lastMessage: conv.lastMessage,
      other: { _id: other._id, name: other.name, username: other.username, avatar: other.avatar },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const conv = await Conversation.findById(req.params.id);
    if (!conv || !conv.participants.some((p) => p.toString() === req.user._id.toString())) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    await Message.updateMany(
      { conversation: conv._id, sender: { $ne: req.user._id }, readAt: null },
      { readAt: new Date() }
    );
    const messages = await Message.find({ conversation: conv._id }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }
    const conv = await Conversation.findById(req.params.id);
    if (!conv || !conv.participants.some((p) => p.toString() === req.user._id.toString())) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    const message = await Message.create({
      conversation: conv._id,
      sender: req.user._id,
      text,
    });
    conv.lastMessage = text.slice(0, 60);
    await conv.save();
    const recipient = conv.participants.find(
      (p) => p.toString() !== req.user._id.toString()
    );
    await Notification.create({
      recipient,
      sender: req.user._id,
      type: "message",
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};