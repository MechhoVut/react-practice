import { memo, useState } from "react";

function PlainChild({ name }) {
  console.log("🔴 PlainChild rendered");
  return <p>Plain: {name}</p>;
}

const MemoChild = memo(function MemoChild({ name }) {
  console.log("🟢 MemoChild rendered");
  return <p>Memo: {name}</p>;
});

// memo is defeated: a NEW object is passed every render
const MemoInlineObject = memo(function MemoInlineObject({ style, label }) {
  console.log("🟠 MemoInlineObject rendered");
  return <p style={style}>{label}</p>;
});

// memo works: the object is created once, outside the component
const STABLE_STYLE = { color: "teal" };

export default function Q26_ReactMemo() {
  const [count, setCount] = useState(0);
  console.log("--- Parent rendered, count =", count);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Parent count: {count}</button>
      <p>Clear the Console, click the button, and compare.</p>

      <PlainChild name="Asha" />
      <MemoChild name="Asha" />
      <MemoInlineObject style={{ color: "teal" }} label="Memo + inline object (still re-renders)" />
      <MemoInlineObject style={STABLE_STYLE} label="Memo + stable object (skipped)" />
    </div>
  );
}