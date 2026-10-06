import { useEffect, useState } from "react";

function UserFetcher({ url }) {
  const [state, setState] = useState({ status: "loading", users: [], error: null });

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);   // fetch doesn't reject on 404/500
        const users = await res.json();
        setState({ status: "success", users, error: null });
      } catch (err) {
        if (err.name === "AbortError") return;                // we cancelled it: not a real error
        setState({ status: "error", users: [], error: err.message });
      }
    }

    load();
    return () => controller.abort();
  }, [url]);

  if (state.status === "loading") return <p>⏳ Loading...</p>;
  if (state.status === "error") return <p style={{ color: "crimson" }}>❌ {state.error}</p>;

  return (
    <ul>
      {state.users.map((u) => (
        <li key={u.id}>{u.name} ({u.email})</li>
      ))}
    </ul>
  );
}

const URLS = {
  success: "https://jsonplaceholder.typicode.com/users",
  "404": "https://jsonplaceholder.typicode.com/users/9999",
  network: "https://does-not-exist.invalid/users",
};

export default function Q11_FetchOnMount() {
  const [which, setWhich] = useState("success");
  return (
    <div>
      {Object.keys(URLS).map((k) => (
        <button key={k} onClick={() => setWhich(k)} style={{ marginRight: 6 }}>{k}</button>
      ))}
      <hr />
      {/* key remounts the component, so it restarts at "loading" */}
      <UserFetcher key={which} url={URLS[which]} />
    </div>
  );
}