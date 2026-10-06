import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

// Version A: returns a getter. Reading it never causes a re-render.
// Use it only for work you can't cancel (third-party promises, legacy callbacks).
function useIsMounted() {
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;                  // must be set here: Strict Mode runs cleanup, then this again
    return () => { mounted.current = false; };
  }, []);

  return useCallback(() => mounted.current, []);
}

// Version B: returns a boolean, with no setState inside an effect.
// useSyncExternalStore reads "is this the client?" during render.
const subscribe = () => () => {};            // nothing to subscribe to
function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,                              // client snapshot
    () => false                              // server / hydration snapshot
  );
}

// A request that can be cancelled: clears its timer and rejects with AbortError.
function fakeRequest(signal) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => resolve("data"), 3000);
    signal?.addEventListener("abort", () => {
      clearTimeout(id);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}

// ✅ Preferred: cancel the work in cleanup. No mounted flag needed.
function CancellableLoader() {
  const mounted = useMounted();
  const [msg, setMsg] = useState("waiting 3s... (unmount me before it finishes)");

  useEffect(() => {
    const controller = new AbortController();

    fakeRequest(controller.signal)
      .then((data) => setMsg(`got ${data}`))
      .catch((err) => {
        if (err.name !== "AbortError") setMsg(`error: ${err.message}`);
      });

    return () => controller.abort();         // Strict Mode's first run is cancelled here
  }, []);

  return <p>✅ {msg} | useMounted = {String(mounted)}</p>;
}

// ⚠️ Fallback: work that can't be cancelled, so guard the update with isMounted()
function LegacyLoader() {
  const isMounted = useIsMounted();
  const [msg, setMsg] = useState("waiting 3s... (uncancellable)");

  useEffect(() => {
    // Imagine this promise comes from a library that has no abort support
    new Promise((resolve) => setTimeout(() => resolve("data"), 3000)).then((data) => {
      console.log("legacy request finished, still mounted?", isMounted());
      if (isMounted()) setMsg(`got ${data}`);
    });
  }, [isMounted]);

  return <p>⚠️ {msg}</p>;
}

export default function Q18_UseMounted() {
  const [show, setShow] = useState(true);
  return (
    <div>
      <button onClick={() => setShow((s) => !s)}>{show ? "Unmount" : "Mount"}</button>
      {show && (
        <>
          <CancellableLoader />
          <LegacyLoader />
        </>
      )}
    </div>
  );
}