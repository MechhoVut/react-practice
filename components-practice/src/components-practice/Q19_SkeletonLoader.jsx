import { useEffect, useState } from "react";

// Simulated API. "malformed" and "empty-null" return unusable payloads.
function fakeApi(mode) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (mode === "ok") resolve([{ id: 1, name: "Asha" }, { id: 2, name: "Bilal" }, { id: 3, name: "Chen" }]);
      else if (mode === "malformed") resolve({ message: "maintenance mode" });   // not an array
      else resolve(null);
    }, 1500);
  });
}

const isValidUser = (u) => u && typeof u.id === "number" && typeof u.name === "string";
const isValidPayload = (d) => Array.isArray(d) && d.every(isValidUser);

function SkeletonList({ rows = 3 }) {
  return (
    <div aria-busy="true" aria-label="Loading users">
      <style>{`
        @keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: 200px 0; } }
        .sk { height: 18px; margin: 10px 0; border-radius: 4px; width: 220px;
              background: linear-gradient(90deg, #eee 25%, #ddd 50%, #eee 75%);
              background-size: 400px 100%; animation: shimmer 1.2s infinite linear; }
      `}</style>
      {Array.from({ length: rows }, (_, i) => <div key={i} className="sk" />)}
    </div>
  );
}

function Users({ mode }) {
  const [state, setState] = useState({ status: "loading", users: [] });

  useEffect(() => {
    let ignore = false;

    fakeApi(mode).then((data) => {
      if (ignore) return;                                      // stale or unmounted: no update
      if (!isValidPayload(data)) {                             // unusable: never store it as users
        setState({ status: "error", users: [] });
        return;
      }
      setState({ status: "success", users: data });
    });

    return () => { ignore = true; };
  }, [mode]);

  if (state.status === "loading") return <SkeletonList />;
  if (state.status === "error") return <p style={{ color: "crimson" }}>⚠️ Received unexpected data.</p>;
  return <ul>{state.users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;
}

export default function Q19_SkeletonLoader() {
  const [mode, setMode] = useState("ok");
  return (
    <div>
      {["ok", "malformed", "empty-null"].map((m) => (
        <button key={m} onClick={() => setMode(m)} style={{ marginRight: 6 }}>{m}</button>
      ))}
      <hr />
      <Users key={mode} mode={mode} />
    </div>
  );
}