import { useEffect, useState } from "react";

function fakeFetchUser(id, signal) {
  const delay = id % 2 === 1 ? 2000 : 300;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => resolve({ id, name: `User ${id}` }), delay);
    signal?.addEventListener("abort", () => {
      clearTimeout(timer);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

function Display({ title, userId, user }) {
  const mismatch = user && user.id !== userId;
  return (
    <div style={{ marginBottom: 12 }}>
      <b>{title}</b>
      <div>Selected id: {userId}</div>
      <div style={{ color: mismatch ? "crimson" : "inherit" }}>
        {user ? `Showing: ${user.name}${mismatch ? " ⚠️ WRONG USER" : ""}` : "⏳ Loading..."}
      </div>
    </div>
  );
}

// ❌ No protection: the slow response for id 1 arrives last and overwrites id 2
function Buggy({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fakeFetchUser(userId).then(setUser);
  }, [userId]);

  return <Display title="❌ No protection" userId={userId} user={user} />;
}

// ✅ Ignore flag: the old effect's cleanup marks its response as stale
function WithIgnoreFlag({ userId }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    let ignore = false;
    fakeFetchUser(userId).then((u) => {
      if (!ignore) setResult(u);
    });
    return () => { ignore = true; };
  }, [userId]);

  const user = result?.id === userId ? result : null;     // derived "loading"
  return <Display title="✅ Ignore flag" userId={userId} user={user} />;
}

// ✅ AbortController: also cancels the request itself
function WithAbort({ userId }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fakeFetchUser(userId, controller.signal)
      .then(setResult)
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });
    return () => controller.abort();
  }, [userId]);

  const user = result?.id === userId ? result : null;
  return <Display title="✅ AbortController" userId={userId} user={user} />;
}

export default function Q33_RaceCondition() {
  const [userId, setUserId] = useState(2);

  return (
    <div>
      <p>
        Click <b>1</b> (slow), then quickly click <b>2</b> (fast). Wait 2 seconds and watch the red one.
      </p>
      {[1, 2, 3, 4, 5].map((id) => (
        <button
          key={id}
          onClick={() => setUserId(id)}
          style={{ marginRight: 6, fontWeight: id === userId ? "bold" : "normal" }}
        >
          {id}
        </button>
      ))}
      <hr />
      <Buggy userId={userId} />
      <WithIgnoreFlag userId={userId} />
      <WithAbort userId={userId} />
    </div>
  );
}