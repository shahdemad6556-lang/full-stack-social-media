import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { toggleTheme } from "../features/theme/themeSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
  const { mode } = useSelector((s) => s.theme);
  const [q, setQ] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <nav className="navbar bg-body-tertiary border-bottom mb-3">
      <div className="container" style={{ maxWidth: 720 }}>
        <Link to="/" className="navbar-brand fw-bold">
          Social
        </Link>
        <form className="d-flex flex-grow-1 mx-3" onSubmit={handleSearch}>
          <input
            className="form-control form-control-sm"
            placeholder="Search people or posts..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </form>
        <div className="d-flex gap-2 align-items-center">
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={() => dispatch(toggleTheme())}
          >
            {mode === "light" ? "🌙" : "☀️"}
          </button>
          <Link to={`/profile/${user?.username}`} className="btn btn-sm btn-outline-primary">
            Profile
          </Link>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => dispatch(logout())}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}