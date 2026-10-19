import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../api/axios";
import PostCard from "../components/PostCard";

export default function Profile() {
  const { username } = useParams();
  const { user: me } = useSelector((s) => s.auth);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "" });
  const [error, setError] = useState("");

  const isOwner = profile && me && profile._id === me._id;

  useEffect(() => {
    const load = async () => {
      try {
        setError("");
        const res = await API.get(`/users/${username}`);
        setProfile(res.data);
        setForm({ name: res.data.name, bio: res.data.bio || "" });
        const p = await API.get(`/posts?user=${res.data._id}`);
        setPosts(p.data.posts);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      }
    };
    load();
  }, [username]);

  const save = async (e) => {
    e.preventDefault();
    const res = await API.put("/users/profile", form);
    setProfile({ ...profile, name: res.data.name, bio: res.data.bio });
    setEditing(false);
  };

  if (error) return <div className="container"><div className="alert alert-danger">{error}</div></div>;
  if (!profile) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <div className="card mb-4">
        <div className="card-body">
          {!editing ? (
            <>
              <h4 className="mb-0">{profile.name}</h4>
              <div className="text-muted mb-2">@{profile.username}</div>
              <p>{profile.bio || "No bio yet."}</p>
              <small className="text-muted">{profile.postsCount} posts</small>
              {isOwner && (
                <div className="mt-3">
                  <button className="btn btn-sm btn-outline-primary" onClick={() => setEditing(true)}>
                    Edit profile
                  </button>
                </div>
              )}
            </>
          ) : (
            <form onSubmit={save}>
              <input
                className="form-control mb-2"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Name"
              />
              <textarea
                className="form-control mb-2"
                rows="3"
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                placeholder="Bio"
              />
              <button className="btn btn-primary btn-sm me-2">Save</button>
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
      <h5>Posts</h5>
      {posts.length === 0 && <p className="text-muted">No posts yet.</p>}
      {posts.map((p) => (
        <PostCard key={p._id} post={p} />
      ))}
    </div>
  );
}