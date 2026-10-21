import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import API from "../api/axios";
import {
  toggleLike,
  optimisticLike,
  deletePost,
  updatePost,
  addComment,
} from "../features/posts/postsSlice";

const SERVER = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);

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

  const saveEdit = async () => {
    const result = await dispatch(updatePost({ id: post._id, text: editText }));
    if (updatePost.fulfilled.match(result)) setEditing(false);
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="d-flex justify-content-between">
          <div>
            <Link
              to={`/profile/${post.author?.username}`}
              className="text-decoration-none text-body"
            >
              <strong>{post.author?.name}</strong>
            </Link>{" "}
            <span className="text-muted">@{post.author?.username}</span>
          </div>
          {isOwner && (
            <div className="d-flex gap-1">
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setEditText(post.text);
                  setEditing(!editing);
                }}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => dispatch(deletePost(post._id))}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="mt-2">
            <textarea
              className="form-control mb-2"
              rows="3"
              maxLength={500}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <button className="btn btn-sm btn-primary me-2" onClick={saveEdit}>
              Save
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            {post.text && <p className="mt-2 mb-2">{post.text}</p>}
            {post.image && (
              <img
                src={`${SERVER}${post.image}`}
                alt="post"
                className="img-fluid rounded mb-2"
                style={{ maxHeight: 400 }}
              />
            )}
            {post.tags?.length > 0 && (
              <div className="mb-2">
                {post.tags.map((t) => (
                  <Link
                    key={t}
                    to={`/search?q=${encodeURIComponent("#" + t)}`}
                    className="me-2"
                  >
                    #{t}
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        <small className="text-muted d-block">
          {new Date(post.createdAt).toLocaleString()}
          {post.updatedAt !== post.createdAt && " (edited)"}
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