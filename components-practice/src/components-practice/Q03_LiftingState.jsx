import { useState } from "react";

// CHILD: has no state of its own. It only displays props and calls callbacks.
function CounterButtons({ count, onIncrement, onDecrement, onReset }) {
  console.log("Child rendered");
  return (
    <div>
      <button onClick={onDecrement}>-</button>
      <span style={{ margin: "0 12px" }}>{count}</span>
      <button onClick={onIncrement}>+</button>
      <button onClick={onReset} style={{ marginLeft: 12 }}>Reset</button>
    </div>
  );
}

// CHILD 2: sends a value (not just a signal) back up to the parent.
function NameInput({ name, onNameChange }) {
  return (
    <input
      value={name}
      onChange={(e) => onNameChange(e.target.value)}
      placeholder="Type your name"
    />
  );
}

// PARENT: owns the state and decides how it changes.
export default function Q03_LiftingState() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");

  const handleIncrement = () => setCount((c) => c + 1);
  const handleDecrement = () => setCount((c) => c - 1);
  const handleReset = () => setCount(0);

  return (
    <div>
      <h2>Parent</h2>
      <p>
        Hello, {name || "stranger"}! Count is <b>{count}</b>.
      </p>

      <NameInput name={name} onNameChange={setName} />

      <h3>Child controls</h3>
      <CounterButtons
        count={count}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
        onReset={handleReset}
      />

      {/* Second child sharing the SAME state: this is why we lift it up */}
      <h3>Another child showing the same count</h3>
      <p>Count mirrored here: {count}</p>
    </div>
  );
}