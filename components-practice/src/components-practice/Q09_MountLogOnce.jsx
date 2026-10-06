import { useEffect, useState } from "react";

function MountLogger() {
  console.log("render");

  useEffect(() => {
    console.log("mounted");
    return () => console.log("cleanup (unmounted)");
  }, []);

  return <p>Open the Console</p>;
}

export default function Q09_MountLogOnce() {
  const [show, setShow] = useState(true);
  return (
    <div>
      <button onClick={() => setShow((s) => !s)}>{show ? "Unmount" : "Mount"}</button>
      {show && <MountLogger />}
    </div>
  );
}