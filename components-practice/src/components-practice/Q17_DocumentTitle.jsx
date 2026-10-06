import { useEffect, useState } from "react";

// Inline version
function ProductPage({ name }) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${name} | My Shop`;
    return () => { document.title = previous; };     // restore on unmount
  }, [name]);                                        // also updates when the prop changes

  return <h2>{name}</h2>;
}

// Reusable hook version
// function usePageTitle(title) { ...same effect with [title]... }

export default function Q17_DocumentTitle() {
  const [name, setName] = useState("Laptop");
  const [show, setShow] = useState(true);

  return (
    <div>
      {["Laptop", "Phone", "Headphones"].map((n) => (
        <button key={n} onClick={() => setName(n)} style={{ marginRight: 6 }}>{n}</button>
      ))}
      <button onClick={() => setShow((s) => !s)}>{show ? "Unmount page" : "Mount page"}</button>
      <p>Watch the browser tab title.</p>
      {show && <ProductPage name={name} />}
    </div>
  );
}