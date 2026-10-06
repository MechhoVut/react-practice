import { lazy, Suspense, useState } from "react";

// Change only this line if the folder name changes
const modules = import.meta.glob("./components-practice/*.jsx");

const entries = Object.entries(modules).sort(([a], [b]) => a.localeCompare(b));
const components = Object.fromEntries(
  entries.map(([path, loader]) => [path, lazy(loader)])
);

const label = (path) => path.split("/").pop().replace(".jsx", "");

export default function App() {
  const [current, setCurrent] = useState(entries[0]?.[0]);
  const Question = current ? components[current] : null;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "sans-serif" }}>
      <nav style={{ width: 260, overflow: "auto", borderRight: "1px solid #ddd", padding: 8 }}>
        {entries.map(([path]) => (
          <button
            key={path}
            onClick={() => setCurrent(path)}
            style={{
              display: "block", width: "100%", textAlign: "left", padding: 6,
              fontWeight: path === current ? "bold" : "normal",
            }}
          >
            {label(path)}
          </button>
        ))}
      </nav>
      <main style={{ flex: 1, padding: 16, overflow: "auto" }}>
        <Suspense fallback="Loading...">
          {Question && <Question key={current} />}
        </Suspense>
      </main>
    </div>
  );
}