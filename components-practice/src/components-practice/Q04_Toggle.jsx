import { useState } from "react";

function Toggle({ value, defaultValue = false, onChange, label = "Toggle" }) {
  // Controlled if the parent passed `value` (even false). Not if undefined.
  const isControlled = value !== undefined;

  // Internal state is only used in uncontrolled mode.
  const [internalValue, setInternalValue] = useState(defaultValue);

  const checked = isControlled ? value : internalValue;

  const handleClick = () => {
    const next = !checked;
    if (!isControlled) setInternalValue(next); // only update ourselves if uncontrolled
    onChange?.(next);                           // always notify the parent
  };

  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={handleClick}
      style={{
        padding: "6px 14px",
        borderRadius: 16,
        border: "1px solid #888",
        background: checked ? "#4caf50" : "#ddd",
        color: checked ? "#fff" : "#000",
        cursor: "pointer",
      }}
    >
      {label}: {checked ? "ON" : "OFF"}
    </button>
  );
}

export default function Q04_Toggle() {
  const [on, setOn] = useState(false);

  return (
    <div>
      <h3>1. Uncontrolled (owns its own state)</h3>
      <Toggle label="Notifications" />

      <h3>2. Uncontrolled with defaultValue and a listener</h3>
      <Toggle
        label="Dark mode"
        defaultValue={true}
        onChange={(v) => console.log("Dark mode is now", v)}
      />

      <h3>3. Controlled (parent owns the state)</h3>
      <Toggle label="Wi-Fi" value={on} onChange={setOn} />
      <p>Parent sees: <b>{on ? "ON" : "OFF"}</b></p>
      <button onClick={() => setOn(false)}>Force OFF from parent</button>

      <h3>4. Two toggles sharing one state</h3>
      <Toggle label="A" value={on} onChange={setOn} />{" "}
      <Toggle label="B" value={on} onChange={setOn} />

      <h3>5. Controlled but with no onChange (stuck)</h3>
      <Toggle label="Locked" value={false} />
    </div>
  );
}