import { useMemo, useState } from "react";

const ALL = Array.from({ length: 20000 }, (_, i) => ({
  id: i,
  name: `user-${(i * 7919) % 20000}`,
}));

function burn(ms) {
  // Artificial slowness so the difference is visible. Real work would be heavier data or logic.
  const end = performance.now() + ms;
  while (performance.now() < end) { /* busy wait */ }
}

function filterAndSort(query, asc) {
  console.log("⚙️ computing filter + sort");
  burn(40);
  const q = query.toLowerCase();
  const result = ALL.filter((u) => u.name.includes(q));        // filter returns a NEW array
  result.sort((a, b) => a.name.localeCompare(b.name));          // so sorting it is safe
  return asc ? result : result.reverse();
}

function Results({ title, rows }) {
  return (
    <div>
      <h4>{title}</h4>
      <p>{rows.length} matches (first 5 shown)</p>
      <ul>{rows.slice(0, 5).map((u) => <li key={u.id}>{u.name}</li>)}</ul>
    </div>
  );
}

function WithoutMemo({ query, asc }) {
  const rows = filterAndSort(query, asc);                       // recomputed on EVERY render
  return <Results title="❌ Without useMemo" rows={rows} />;
}

function WithMemo({ query, asc }) {
  const rows = useMemo(() => filterAndSort(query, asc), [query, asc]);
  return <Results title="✅ With useMemo" rows={rows} />;
}

export default function Q28_UseMemo() {
  const [query, setQuery] = useState("user-1");
  const [asc, setAsc] = useState(true);
  const [tick, setTick] = useState(0);

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />{" "}
      <button onClick={() => setAsc((a) => !a)}>{asc ? "A → Z" : "Z → A"}</button>{" "}
      <button onClick={() => setTick((t) => t + 1)}>Unrelated re-render ({tick})</button>
      <p>Click "Unrelated re-render" and watch the Console and the lag.</p>

      <WithoutMemo query={query} asc={asc} />
      <WithMemo query={query} asc={asc} />
    </div>
  );
}