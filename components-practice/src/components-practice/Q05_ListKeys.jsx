import { useRef, useState } from "react";

const initialUsers = [
  { id: 101, name: "Asha" },
  { id: 102, name: "Bilal" },
  { id: 103, name: "Chen" },
  { id: 104, name: "Divya" },
];

// Each row holds LOCAL state (a like button) and an uncontrolled input.
// That local state is what exposes the index-key bug.
function UserRow({ user }) {
  const [liked, setLiked] = useState(false);

  return (
    <li style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
      <b style={{ width: 70 }}>{user.name}</b>
      <input placeholder={`note for ${user.name}`} style={{ width: 130 }} />
      <button onClick={() => setLiked((l) => !l)}>{liked ? "♥" : "♡"}</button>
    </li>
  );
}

function UserList({ users, useIndexKey }) {
  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {users.map((user, index) => (
        <UserRow
          key={useIndexKey ? index : user.id}   // <-- the whole lesson is this line
          user={user}
        />
      ))}
    </ul>
  );
}

export default function Q05_ListKeys() {
  const [users, setUsers] = useState(initialUsers);
  const nextId = useRef(200);

  const reverse = () => setUsers((u) => [...u].reverse());   // copy first, never mutate
  const addToTop = () =>
    setUsers((u) => {
      const id = nextId.current++;
      return [{ id, name: `User ${id}` }, ...u];
    });
  const deleteFirst = () => setUsers((u) => u.slice(1));
  const reset = () => setUsers(initialUsers);

  return (
    <div>
      <h3>Controls</h3>
      <button onClick={reverse}>Reverse</button>{" "}
      <button onClick={addToTop}>Add to top</button>{" "}
      <button onClick={deleteFirst}>Delete first</button>{" "}
      <button onClick={reset}>Reset</button>

      <p>
        <b>Try this:</b> type a note in the first row of each list and click the
        heart on it. Then press <b>Reverse</b>.
      </p>

      <div style={{ display: "flex", gap: 40 }}>
        <div>
          <h4 style={{ color: "green" }}>✅ key = user.id</h4>
          <UserList users={users} useIndexKey={false} />
        </div>
        <div>
          <h4 style={{ color: "crimson" }}>❌ key = index</h4>
          <UserList users={users} useIndexKey={true} />
        </div>
      </div>
    </div>
  );
}