import { useEffect, useState } from "react";

const KEY = "q15-count";

function readCount() {
  console.log("📦 reading localStorage");
  try {
    const raw = localStorage.getItem(KEY);
    return raw === null ? 0 : JSON.parse(raw);
  } catch {
    return 0;                          // private mode, corrupted JSON, etc.
  }
}

// ✅ Lazy: pass the function itself. React calls it once, on the first render.
function LazyCounter() {
  const [count, setCount] = useState(readCount);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(count)); } catch { /* ignore */ }
  }, [count]);

  return <button onClick={() => setCount((c) => c + 1)}>Lazy count: {count}</button>;
}

// ❌ Eager: readCount() is CALLED on every render, and its result is ignored after the first
function EagerCounter() {
  const [count] = useState(readCount());
  const [, forceRender] = useState(0);
  return (
    <button onClick={() => forceRender((n) => n + 1)}>
      Eager (initial {count}): click and watch the Console
    </button>
  );
}

export default function Q15_LazyInitialState() {
  return (
    <div>
      <p>Increment, then refresh the page: the value survives.</p>
      <LazyCounter />
      <br /><br />
      <EagerCounter />
    </div>
  );
}