import { useEffect, useRef, useState } from "react";

// ✅ Preferred: the previous DIFFERENT value. No refs read during render.
function usePrevious(value) {
  const [state, setState] = useState({ current: value, previous: undefined });

  // Adjusting state during render is allowed when it's guarded by a condition
  if (!Object.is(state.current, value)) {
    setState({ current: value, previous: state.current });
  }

  return state.previous;
}

// ⚠️ Classic interview version: the value from the PREVIOUS RENDER.
// It reads ref.current during render, which React's lint rules discourage,
// so the suppression below is deliberate. Know it, but prefer usePrevious above.
function usePreviousRender(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;          // runs after render, so the next render sees this value
  });

  // eslint-disable-next-line react-hooks/refs
  return ref.current;             // still holds the OLD value during this render
}

export default function Q23_UsePrevious() {
  const [count, setCount] = useState(0);
  const [other, setOther] = useState(0);

  const prevChange = usePrevious(count);
  const prevRender = usePreviousRender(count);

  const trend =
    prevChange === undefined
      ? "–"
      : count > prevChange
      ? "⬆ increased"
      : count < prevChange
      ? "⬇ decreased"
      : "same";

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>count +1</button>{" "}
      <button onClick={() => setCount((c) => c - 1)}>count -1</button>{" "}
      <button onClick={() => setOther((o) => o + 1)}>Unrelated re-render ({other})</button>

      <p>current: <b>{count}</b></p>
      <p>usePrevious (previous <i>change</i>): <b>{String(prevChange)}</b> ({trend})</p>
      <p>usePreviousRender (previous <i>render</i>): <b>{String(prevRender)}</b></p>

      <p>
        <small>
          Click <b>count +1</b> a few times, then click <b>Unrelated re-render</b>.
          The render version jumps to the current value because <code>count</code> was
          the same on both renders. The change version keeps the last <i>different</i> value.
        </small>
      </p>
    </div>
  );
}