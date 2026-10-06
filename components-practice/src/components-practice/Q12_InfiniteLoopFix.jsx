import { useEffect, useState } from "react";

const API = "https://jsonplaceholder.typicode.com/users";

// ✅ FIX 2 (part a): constants live OUTSIDE the component, so the reference never changes
const OPTIONS = { limit: 3 };

// Shared display. `responses` counts completed requests so you can verify there's no loop.
function Result({ title, state }) {
  return (
    <div>
      <p>
        <b>{title}</b>: {state.users.length} users, {state.responses} response(s) received
      </p>
      {state.error && <p style={{ color: "crimson" }}>❌ {state.error}</p>}
    </div>
  );
}

function useFetchState() {
  return useState({ users: [], responses: 0, error: null });
}

// ✅ FIX 1: was `useEffect(() => {...})` with no array. Now it runs on mount only.
function FixedNoDeps() {
  const [state, setState] = useFetchState();

  useEffect(() => {
    const controller = new AbortController();

    fetch(API, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((users) => setState((s) => ({ users, responses: s.responses + 1, error: null })))
      .catch((e) => {
        if (e.name !== "AbortError") setState((s) => ({ ...s, error: e.message }));
      });

    return () => controller.abort();
  }, [setState]);   // setState is stable, so this still runs only once

  return <Result title="Fixed (no deps)" state={state} />;
}

// ✅ FIX 2 (part b): depend on the primitive `OPTIONS.limit`, not on a fresh object
function FixedObjectDep() {
  const [state, setState] = useFetchState();
  const limit = OPTIONS.limit;

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API}?_limit=${limit}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((users) => setState((s) => ({ users, responses: s.responses + 1, error: null })))
      .catch((e) => {
        if (e.name !== "AbortError") setState((s) => ({ ...s, error: e.message }));
      });

    return () => controller.abort();
  }, [limit, setState]);

  return <Result title="Fixed (object dep)" state={state} />;
}

// ✅ Reference solution: refetches ONLY when `limit` changes
function Fixed() {
  const [limit, setLimit] = useState(3);
  const [state, setState] = useFetchState();

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API}?_limit=${limit}`, { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((users) => setState((s) => ({ users, responses: s.responses + 1, error: null })))
      .catch((e) => {
        if (e.name !== "AbortError") setState((s) => ({ ...s, error: e.message }));
      });

    return () => controller.abort();
  }, [limit, setState]);

  return (
    <div>
      <label>
        Limit:{" "}
        <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
          {[1, 3, 5, 10].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </label>
      <Result title="Fixed (limit prop)" state={state} />
    </div>
  );
}

export default function Q12_InfiniteLoopFix() {
  const [variant, setVariant] = useState("fixed");

  return (
    <div>
      {["fixed", "no-deps", "object-dep"].map((v) => (
        <button
          key={v}
          onClick={() => setVariant(v)}
          style={{ marginRight: 6, fontWeight: v === variant ? "bold" : "normal" }}
        >
          {v}
        </button>
      ))}
      <hr />
      {variant === "fixed" && <Fixed />}
      {variant === "no-deps" && <FixedNoDeps />}
      {variant === "object-dep" && <FixedObjectDep />}
    </div>
  );
}