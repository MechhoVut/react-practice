import { useEffect, useRef, useState } from "react";

// ❌ Stuck at 1
function Buggy() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);          // `count` is ALWAYS 0 here: captured from the first render
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <p>❌ Buggy: {count}</p>;
}

// ✅ Fix 1: functional updater (best). No dependency on count at all
function FixedUpdater() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCount((c) => c + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <p>✅ Updater: {count}</p>;
}

// ✅ Fix 2: add count to deps. Works, but tears down and recreates the interval every tick
function FixedDeps() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCount(count + 1), 1000);
    return () => clearInterval(id);
  }, [count]);

  return <p>✅ Deps: {count}</p>;
}

// ✅ Fix 3: a ref, for when the callback needs to READ the latest value
function FixedRef() {
  const [count, setCount] = useState(0);
  const latest = useRef(count);

  useEffect(() => {
    latest.current = count;
  });

  useEffect(() => {
    const id = setInterval(() => {
      console.log("latest count:", latest.current);
      setCount((c) => c + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return <p>✅ Ref: {count} (see Console)</p>;
}

export default function Q24_StaleClosure() {
  return (
    <div>
      <Buggy />
      <FixedUpdater />
      <FixedDeps />
      <FixedRef />
    </div>
  );
}