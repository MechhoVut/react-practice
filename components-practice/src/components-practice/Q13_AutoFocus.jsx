import { useEffect, useRef, useState } from "react";

function AutoFocusInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();        // the ref is attached by the time effects run
    // inputRef.current.select();    // optional: also select any existing text
  }, []);

  return <input ref={inputRef} defaultValue="Focused on mount" />;
}

export default function Q13_AutoFocus() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <button onClick={() => setShow((s) => !s)}>{show ? "Hide" : "Show"} form</button>
      <div style={{ marginTop: 12 }}>{show && <AutoFocusInput />}</div>
    </div>
  );
}