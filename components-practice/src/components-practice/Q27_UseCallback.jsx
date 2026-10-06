import { memo, useCallback, useState } from "react";

const ITEMS = [
  { id: 1, label: "Apple" },
  { id: 2, label: "Banana" },
  { id: 3, label: "Cherry" },
];

const Row = memo(function Row({ item, onSelect, tag }) {
  console.log(`${tag} Row rendered:`, item.label);
  return (
    <li>
      <button onClick={() => onSelect(item.id)}>{item.label}</button>
    </li>
  );
});

export default function Q27_UseCallback() {
  const [count, setCount] = useState(0);
  const [selected, setSelected] = useState(null);

  // ❌ New function on every render, so memo on Row is useless
  const handleBroken = (id) => setSelected(id);

  // ✅ Same function across renders. Uses the updater form, so it needs no dependencies
  const handleStable = useCallback((id) => setSelected(id), []);

  return (
    <div>
      <button onClick={() => setCount((c) => c + 1)}>Unrelated parent re-render ({count})</button>
      <p>Selected: {String(selected)}</p>
      <p>Clear the Console and click the button above.</p>

      <h4>❌ Inline handler</h4>
      <ul>{ITEMS.map((i) => <Row key={i.id} item={i} onSelect={handleBroken} tag="❌" />)}</ul>

      <h4>✅ useCallback handler</h4>
      <ul>{ITEMS.map((i) => <Row key={i.id} item={i} onSelect={handleStable} tag="✅" />)}</ul>
    </div>
  );
}