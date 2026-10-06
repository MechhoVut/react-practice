import { useState } from "react";

// 1. children: the Card provides the frame, the caller provides the body.
// 2. render props: renderHeader / renderFooter let the caller customize slots
//    and receive data from the Card (here: `open` and `toggle`).
function Card({ title, children, renderHeader, renderFooter }) {
  const [open, setOpen] = useState(true);
  const toggle = () => setOpen((o) => !o);

  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12, marginBottom: 16, maxWidth: 380 }}>
      <div>
        {renderHeader
          ? renderHeader({ open, toggle })          // caller controls the header
          : <h4 style={{ margin: 0 }}>{title}</h4>} {/* default header */}
      </div>

      {open && <div style={{ margin: "10px 0" }}>{children}</div>}

      {renderFooter && <div>{renderFooter({ open })}</div>}
    </div>
  );
}

// Another classic render prop: a component that tracks data and lets the caller draw it.
function MouseTracker({ children }) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  return (
    <div
      onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })}
      style={{ height: 80, border: "1px dashed #999", padding: 8 }}
    >
      {children(pos)}   {/* children as a function */}
    </div>
  );
}

export default function Q07_CardChildrenRenderProp() {
  return (
    <div>
      <h3>1. Only children</h3>
      <Card title="Profile">
        <p>Name: Asha</p>
        <p>Role: Developer</p>
      </Card>

      <h3>2. children + render props</h3>
      <Card
        renderHeader={({ open, toggle }) => (
          <button onClick={toggle}>{open ? "▼" : "▶"} Custom header</button>
        )}
        renderFooter={({ open }) => (
          <small>Card is {open ? "expanded" : "collapsed"}</small>
        )}
      >
        <p>Click the header to collapse me.</p>
      </Card>

      <h3>3. children as a function</h3>
      <MouseTracker>
        {({ x, y }) => <p>Mouse at {x}, {y}</p>}
      </MouseTracker>
    </div>
  );
}