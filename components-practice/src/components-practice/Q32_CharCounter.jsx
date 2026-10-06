import { useState } from "react";

const MAX = 100;
const count = (s) => Array.from(s).length;          // counts code points, so an emoji = 1

function Meter({ length }) {
  const pct = Math.min(100, (length / MAX) * 100);
  const color = length > MAX ? "crimson" : length >= MAX * 0.8 ? "orange" : "seagreen";

  return (
    <>
      <div style={{ height: 6, background: "#eee", borderRadius: 3, width: 300 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3 }} />
      </div>
      <p style={{ color, margin: "4px 0" }}>
        {length} / {MAX} {length > MAX ? `(${length - MAX} over)` : `(${MAX - length} left)`}
      </p>
    </>
  );
}

export default function Q32_CharCounter() {
  const [hard, setHard] = useState("");
  const [soft, setSoft] = useState("");

  // Hard limit: typing and pasting are truncated
  const handleHard = (e) => setHard(Array.from(e.target.value).slice(0, MAX).join(""));

  return (
    <div>
      <h4>1. Hard limit (cannot exceed)</h4>
      <textarea rows={3} cols={40} value={hard} onChange={handleHard} />
      <Meter length={count(hard)} />

      <h4>2. Soft limit (can type over, submit is blocked)</h4>
      <textarea rows={3} cols={40} value={soft} onChange={(e) => setSoft(e.target.value)} />
      <Meter length={count(soft)} />
      <button disabled={count(soft) > MAX || count(soft) === 0}>Post</button>
    </div>
  );
}