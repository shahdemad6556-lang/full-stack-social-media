import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts, createPost } from "../features/posts/postsSlice";
import PostCard from "../components/PostCard";

export default function Home() {
  const dispatch = useDispatch();
  const { items, page, hasMore, loading, error } = useSelector(
    (state) => state.posts
  );
  const [text, setText] = useState("");

  useEffect(() => {
    dispatch(fetchPosts(1));
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await dispatch(createPost(text));
    setText("");
  };

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          className="form-control mb-2"
          rows="3"
          maxLength={500}
          placeholder="What's on your mind?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-primary">Post</button>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}
      {items.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
      {loading && <p>Loading...</p>}
      {!loading && items.length === 0 && !error && (
        <p className="text-muted">No posts yet. Be the first!</p>
      )}
      {hasMore && !loading && items.length > 0 && (
        <button
          className="btn btn-outline-secondary w-100 mb-4"
          onClick={() => dispatch(fetchPosts(page + 1))}
        >
          Load more
        </button>
      )}
    </div>
  );
}