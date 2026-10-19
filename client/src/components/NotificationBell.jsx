import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  markAllRead,
} from "../features/notifications/notificationsSlice";

export default function NotificationBell() {
  const dispatch = useDispatch();
  const { items, unreadCount } = useSelector((s) => s.notifications);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());
    const timer = setInterval(() => dispatch(fetchNotifications()), 15000);
    return () => clearInterval(timer);
  }, [dispatch]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) dispatch(markAllRead());
  };

  const label = (n) =>
    n.type === "like" ? "liked your post" : n.type === "comment" ? "commented on your post" : "sent you a message";

  return (
    <div className="position-relative">
      <button className="btn btn-sm btn-outline-secondary position-relative" onClick={toggle}>
        🔔
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="card position-absolute end-0 mt-2 shadow"
          style={{ width: 300, maxHeight: 360, overflowY: "auto", zIndex: 1000 }}
        >
          <div className="card-header py-2 fw-bold">Notifications</div>
          {items.length === 0 && <div className="p-3 text-muted">No notifications yet.</div>}
          {items.map((n) => (
            <Link
              key={n._id}
              to={`/profile/${n.sender?.username}`}
              onClick={() => setOpen(false)}
              className="d-block px-3 py-2 border-bottom text-decoration-none text-body"
            >
              <strong>{n.sender?.name}</strong> {label(n)}
              {n.post?.text && (
                <div className="text-muted small text-truncate">"{n.post.text}"</div>
              )}
              <div className="text-muted" style={{ fontSize: 11 }}>
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}