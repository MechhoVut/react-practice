import { useEffect, useState } from "react";

const KEY = "q16-welcomed";

function Welcome() {
  // Read the flag once (lazy init), so the decision is made on first render
  const [firstTime] = useState(() => {
    try { return sessionStorage.getItem(KEY) === null; } catch { return false; }
  });

  // Then mark the session as welcomed
  useEffect(() => {
    try { sessionStorage.setItem(KEY, "1"); } catch { /* ignore */ }
  }, []);

  return firstTime
    ? <div style={{ background: "#e8f5e9", padding: 8 }}>👋 Welcome back!</div>
    : <p>(No message: already welcomed this session)</p>;
}

export default function Q16_WelcomeBack() {
  const [mountId, setMountId] = useState(0);
  return (
    <div>
      <button onClick={() => setMountId((n) => n + 1)}>Remount component</button>{" "}
      <button
        onClick={() => {
          sessionStorage.removeItem(KEY);
          setMountId((n) => n + 1);
        }}
      >
        Simulate new session
      </button>
      <hr />
      <Welcome key={mountId} />
    </div>
  );
}