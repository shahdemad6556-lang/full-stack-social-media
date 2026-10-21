import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, trim: true, maxlength: 500, default: "" },
    image: { type: String, default: "" },
    tags: [{ type: String, lowercase: true, trim: true }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);