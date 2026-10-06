import { useEffect, useState } from "react";

// Fake API: pass a mode to pick the outcome.
function fakeFetchUsers(mode) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (mode === "error") reject(new Error("Server exploded (500)"));
      else if (mode === "empty") resolve([]);
      else resolve([{ id: 1, name: "Asha" }, { id: 2, name: "Bilal" }, { id: 3, name: "Chen" }]);
    }, 1000);
  });
}

function UserList({ mode }) {
  // One state object: status, users and error can never contradict each other.
  // A fresh mount (new key from the parent) always starts at "loading".
  const [state, setState] = useState({ status: "loading", users: [], error: null });

  useEffect(() => {
    let ignore = false;

    fakeFetchUsers(mode)
      .then((users) => {
        if (!ignore) setState({ status: "success", users, error: null });
      })
      .catch((error) => {
        if (!ignore) setState({ status: "error", users: [], error });
      });

    return () => { ignore = true; };   // ignore responses after unmount / Strict Mode re-run
  }, [mode]);

  const { status, users, error } = state;

  if (status === "loading") return <p>⏳ Loading users...</p>;

  if (status === "error") {
    return (
      <div style={{ color: "crimson" }}>
        ❌ Something went wrong: {error.message}
      </div>
    );
  }

  if (users.length === 0) return <p>📭 No users found.</p>;

  return (
    <ul>
      {users.map((u) => <li key={u.id}>✅ {u.name}</li>)}
    </ul>
  );
}

export default function Q06_ConditionalRendering() {
  const [mode, setMode] = useState("success");
  const [reloadKey, setReloadKey] = useState(0);

  return (
    <div>
      <h3>Pick an outcome</h3>
      {["success", "empty", "error"].map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          style={{ fontWeight: m === mode ? "bold" : "normal", marginRight: 6 }}
        >
          {m}
        </button>
      ))}
      <button onClick={() => setReloadKey((k) => k + 1)}>Reload</button>

      <hr />
      {/* Changing the key remounts UserList, which resets it to "loading" */}
      <UserList key={`${mode}-${reloadKey}`} mode={mode} />
    </div>
  );
}