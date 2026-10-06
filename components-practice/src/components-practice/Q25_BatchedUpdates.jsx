import { useState } from "react";

export default function Q25_BatchedUpdates() {
  const [count, setCount] = useState(0);
  console.log("render, count =", count);

  const addThreeBroken = () => {
    setCount(count + 1);   // setCount(0 + 1)
    setCount(count + 1);   // setCount(0 + 1)
    setCount(count + 1);   // setCount(0 + 1)
    console.log("right after the calls, count is still", count);
  };

  const addThreeFixed = () => {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  };

  const queueDemo = () => {
    setCount(count + 5);      // "replace with count + 5"
    setCount((c) => c * 2);   // "then double whatever it is"
  };

  return (
    <div>
      <h3>count = {count}</h3>
      <button onClick={addThreeBroken}>❌ +3 (broken, adds 1)</button>{" "}
      <button onClick={addThreeFixed}>✅ +3 (updater)</button>{" "}
      <button onClick={queueDemo}>Queue demo: (n + 5) × 2</button>{" "}
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}