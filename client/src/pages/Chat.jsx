import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import API from "../api/axios";

export default function Chat() {
  const { user: me } = useSelector((s) => s.auth);
  const [params] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  const loadConversations = async () => {
    const res = await API.get("/messages/conversations");
    setConversations(res.data);
    return res.data;
  };

  useEffect(() => {
    const init = async () => {
      try {
        const list = await loadConversations();
        const target = params.get("user");
        if (target) {
          const res = await API.post("/messages/conversations", { username: target });
          setActive(res.data);
          await loadConversations();
        } else if (list.length) {
          setActive(list[0]);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load chat");
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!active) return;
    const load = async () => {
      const res = await API.get(`/messages/conversations/${active._id}/messages`);
      setMessages(res.data);
    };
    load();
    const timer = setInterval(load, 5000);
    return () => clearInterval(timer);
  }, [active]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || !active) return;
    const res = await API.post(`/messages/conversations/${active._id}/messages`, { text });
    setMessages([...messages, res.data]);
    setText("");
    loadConversations();
  };

  return (
    <div className="container" style={{ maxWidth: 860 }}>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3">
        <div className="col-4">
          <div className="list-group">
            {conversations.length === 0 && (
              <div className="text-muted small">No conversations yet. Open a profile and press Message.</div>
            )}
            {conversations.map((c) => (
              <button
                key={c._id}
                className={`list-group-item list-group-item-action ${active?._id === c._id ? "active" : ""}`}
                onClick={() => setActive(c)}
              >
                <strong>{c.other?.name}</strong>
                <div className="small text-truncate">{c.lastMessage}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="col-8">
          {!active ? (
            <p className="text-muted">Select a conversation.</p>
          ) : (
            <div className="card" style={{ height: 460 }}>
              <div className="card-header fw-bold">{active.other?.name}</div>
              <div className="card-body overflow-auto d-flex flex-column gap-2">
                {messages.map((m) => {
                  const mine = m.sender === me._id;
                  return (
                    <div
                      key={m._id}
                      className={`px-3 py-2 rounded-3 ${mine ? "bg-primary text-white align-self-end" : "bg-secondary-subtle align-self-start"}`}
                      style={{ maxWidth: "75%" }}
                    >
                      {m.text}
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              <form onSubmit={send} className="card-footer d-flex gap-2">
                <input
                  className="form-control"
                  placeholder="Type a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <button className="btn btn-primary">Send</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}