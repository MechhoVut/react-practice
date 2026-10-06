import { useEffect, useLayoutEffect, useRef, useState } from "react";

// 1. Measuring
function MeasuredBox() {
  const ref = useRef(null);
  const [text, setText] = useState("Type more text to make this box grow taller.");
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const rect = ref.current.getBoundingClientRect();
    setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
  }, [text]);

  return (
    <div>
      <div ref={ref} style={{ width: 240, padding: 8, border: "1px solid #888" }}>{text}</div>
      <p>Measured: {size.width} × {size.height}px</p>
      <input value={text} onChange={(e) => setText(e.target.value)} style={{ width: 240 }} />
    </div>
  );
}

// 2. Order of execution
function OrderDemo() {
  console.log("1. render");
  useLayoutEffect(() => { console.log("2. useLayoutEffect (before paint)"); }, []);
  useEffect(() => { console.log("3. useEffect (after paint)"); }, []);
  return <p>Check the Console for the order</p>;
}

// 3. Flicker demo: position a tooltip above its own measured height
function makeTooltip(useIsoEffect) {
  return function Tooltip({ children }) {
    const ref = useRef(null);
    const [top, setTop] = useState(0);
    useIsoEffect(() => {
      setTop(-ref.current.offsetHeight - 6);
    }, [children]);
    return (
      <div ref={ref} style={{ position: "absolute", top, left: 0, background: "#333", color: "#fff", padding: "4px 8px" }}>
        {children}
      </div>
    );
  };
}
const LayoutTooltip = makeTooltip(useLayoutEffect);
const EffectTooltip = makeTooltip(useEffect);

export default function Q14_LayoutEffect() {
  const [tick, setTick] = useState(0);
  return (
    <div>
      <h3>1. Measure</h3>
      <MeasuredBox />
      <h3>2. Order</h3>
      <OrderDemo />
      <h3>3. Flicker test (throttle CPU 6× in DevTools &gt; Performance, then click)</h3>
      <button onClick={() => setTick((t) => t + 1)}>Re-position</button>
      <div style={{ position: "relative", height: 70, marginTop: 50 }}>
        <span>useLayoutEffect: </span><LayoutTooltip>tip {tick}</LayoutTooltip>
      </div>
      <div style={{ position: "relative", height: 70, marginTop: 20 }}>
        <span>useEffect: </span><EffectTooltip>tip {tick}</EffectTooltip>
      </div>
    </div>
  );
}