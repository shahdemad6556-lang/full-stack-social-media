import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API from "../api/axios";
import PostCard from "../components/PostCard";

export default function Search() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!q) return;
    const run = async () => {
      const u = await API.get(`/users/search?q=${encodeURIComponent(q)}`);
      const p = await API.get(`/posts?q=${encodeURIComponent(q)}`);
      setUsers(u.data);
      setPosts(p.data.posts);
    };
    run();
  }, [q]);

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <h5>Results for "{q}"</h5>
      <h6 className="mt-3">People</h6>
      {users.length === 0 && <p className="text-muted">No users found.</p>}
      {users.map((u) => (
        <Link key={u._id} to={`/profile/${u.username}`} className="d-block card card-body mb-2 text-decoration-none">
          <strong>{u.name}</strong> <span className="text-muted">@{u.username}</span>
        </Link>
      ))}
      <h6 className="mt-4">Posts</h6>
      {posts.length === 0 && <p className="text-muted">No posts found.</p>}
      {posts.map((p) => (
        <PostCard key={p._id} post={p} />
      ))}
    </div>
  );
}