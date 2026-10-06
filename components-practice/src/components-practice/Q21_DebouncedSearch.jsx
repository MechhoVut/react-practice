import { useEffect, useState } from "react";

// Returns `value`, but only after it has stopped changing for `delay` ms
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);          // every new keystroke cancels the previous timer
  }, [value, delay]);

  return debounced;
}

export default function Q21_DebouncedSearch() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query.trim(), 500);
  const [result, setResult] = useState({ q: "", users: [], error: null });

  useEffect(() => {
    if (!debounced) return;

    const controller = new AbortController();
    console.log("🔎 API call for:", debounced);

    fetch(`https://dummyjson.com/users/search?q=${encodeURIComponent(debounced)}`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => setResult({ q: debounced, users: data.users, error: null }))
      .catch((err) => {
        if (err.name !== "AbortError") setResult({ q: debounced, users: [], error: err.message });
      });

    return () => controller.abort();         // cancel the request if the query changes
  }, [debounced]);

  // Derived, not stored: no extra state to keep in sync
  const typing = query.trim() !== debounced;
  const loading = debounced !== "" && result.q !== debounced;
  const showResults = debounced !== "" && result.q === debounced;

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search users (try: john)"
        style={{ width: 260 }}
      />
      <p>{typing ? "⌨️ Waiting for you to stop typing..." : loading ? "⏳ Searching..." : ""}</p>

      {showResults && result.error && <p style={{ color: "crimson" }}>❌ {result.error}</p>}
      {showResults && !result.error && result.users.length === 0 && <p>No results.</p>}
      {showResults && result.users.length > 0 && (
        <ul>
          {result.users.map((u) => (
            <li key={u.id}>{u.firstName} {u.lastName} ({u.email})</li>
          ))}
        </ul>
      )}
    </div>
  );
}