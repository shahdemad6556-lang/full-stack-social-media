import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "../api/axios";
import {
  toggleLike,
  optimisticLike,
  deletePost,
  addComment,
} from "../features/posts/postsSlice";

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const liked = post.likes.includes(user._id);
  const isOwner = post.author?._id === user._id;

  const handleLike = () => {
    dispatch(optimisticLike({ id: post._id, userId: user._id }));
    dispatch(toggleLike(post._id));
  };

  const loadComments = async () => {
    if (!showComments) {
      const res = await API.get(`/posts/${post._id}/comments`);
      setComments(res.data);
    }
    setShowComments(!showComments);
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    const result = await dispatch(addComment({ id: post._id, text }));
    if (addComment.fulfilled.match(result)) {
      setComments([...comments, result.payload.comment]);
      setText("");
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div>
            <strong>{post.author?.name}</strong>{" "}
            <span className="text-muted">@{post.author?.username}</span>
          </div>
          {isOwner && (
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => dispatch(deletePost(post._id))}
            >
              Delete
            </button>
          )}
        </div>
        <p className="mt-2 mb-2">{post.text}</p>
        <small className="text-muted">
          {new Date(post.createdAt).toLocaleString()}
        </small>
        <div className="mt-3 d-flex gap-2">
          <button
            className={`btn btn-sm ${liked ? "btn-primary" : "btn-outline-primary"}`}
            onClick={handleLike}
          >
            ♥ {post.likes.length}
          </button>
          <button className="btn btn-sm btn-outline-secondary" onClick={loadComments}>
            💬 {post.commentsCount}
          </button>
        </div>

        {showComments && (
          <div className="mt-3">
            {comments.map((c) => (
              <div key={c._id} className="border-top pt-2 mt-2">
                <strong>{c.author?.name}</strong>
                <div>{c.text}</div>
              </div>
            ))}
            <form onSubmit={submitComment} className="d-flex gap-2 mt-3">
              <input
                className="form-control form-control-sm"
                placeholder="Write a comment..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button className="btn btn-sm btn-primary">Send</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}