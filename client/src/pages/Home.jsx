import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Home() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="container" style={{ marginTop: 60 }}>
      <h2>Welcome, {user?.name} 👋</h2>
      <p>@{user?.username}</p>
      <button className="btn btn-outline-danger" onClick={() => dispatch(logout())}>
        Logout
      </button>
    </div>
  );
}