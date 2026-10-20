import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../api/axios";
import PostCard from "../components/PostCard";

const SERVER = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function Profile() {
  const { username } = useParams();
  const { user: me } = useSelector((s) => s.auth);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "" });
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");

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

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadError("");
    const data = new FormData();
    data.append("avatar", file);
    try {
      const res = await API.post("/users/avatar", data);
      setProfile({ ...profile, avatar: res.data.avatar });
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload failed");
    }
  };

  if (error)
    return (
      <div className="container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  if (!profile) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center gap-3 mb-3">
            {profile.avatar ? (
              <img
                src={`${SERVER}${profile.avatar}`}
                alt="avatar"
                style={{ width: 80, height: 80, objectFit: "cover", borderRadius: "50%" }}
              />
            ) : (
              <div
                className="bg-secondary text-white d-flex align-items-center justify-content-center"
                style={{ width: 80, height: 80, borderRadius: "50%", fontSize: 32 }}
              >
                {profile.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <h4 className="mb-0">{profile.name}</h4>
              <div className="text-muted">@{profile.username}</div>
            </div>
          </div>

          {!editing ? (
            <>
              <p>{profile.bio || "No bio yet."}</p>
              <small className="text-muted">{profile.postsCount} posts</small>
                            {!isOwner && (
                <div className="mt-3">
                  <Link to={`/chat?user=${profile.username}`} className="btn btn-sm btn-primary">
                    Message
                  </Link>
                </div>
              )}
              {isOwner && (
                <div className="mt-3">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => setEditing(true)}
                  >
                    Edit profile
                  </button>
                  <label className="btn btn-sm btn-outline-secondary mb-0">
                    Change photo
                    <input type="file" accept="image/*" hidden onChange={handleAvatar} />
                  </label>
                  {uploadError && <div className="text-danger small mt-2">{uploadError}</div>}
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
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setEditing(false)}
              >
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