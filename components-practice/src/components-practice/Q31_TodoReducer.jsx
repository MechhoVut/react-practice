import { useReducer, useState } from "react";

// Pure function: (state, action) → new state. No side effects, no random ids
function todosReducer(todos, action) {
  switch (action.type) {
    case "added":
      return [...todos, { id: action.id, text: action.text, done: false }];
    case "toggled":
      return todos.map((t) => (t.id === action.id ? { ...t, done: !t.done } : t));
    case "edited":
      return todos.map((t) => (t.id === action.id ? { ...t, text: action.text } : t));
    case "deleted":
      return todos.filter((t) => t.id !== action.id);
    case "cleared_done":
      return todos.filter((t) => !t.done);
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

const initialTodos = [
  { id: "1", text: "Learn useReducer", done: false },
  { id: "2", text: "Build a todo app", done: false },
];

function TodoItem({ todo, dispatch }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  const save = () => {
    const text = draft.trim();
    if (text) dispatch({ type: "edited", id: todo.id, text });
    else dispatch({ type: "deleted", id: todo.id });      // empty text removes the todo
    setEditing(false);
  };

  const cancel = () => {
    setDraft(todo.text);
    setEditing(false);
  };

  return (
    <li style={{ margin: "6px 0" }}>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => dispatch({ type: "toggled", id: todo.id })}
      />{" "}
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") cancel();
          }}
          onBlur={save}
        />
      ) : (
        <span
          onDoubleClick={() => setEditing(true)}
          style={{ textDecoration: todo.done ? "line-through" : "none" }}
        >
          {todo.text}
        </span>
      )}{" "}
      {!editing && <button onClick={() => setEditing(true)}>Edit</button>}{" "}
      <button onClick={() => dispatch({ type: "deleted", id: todo.id })}>Delete</button>
    </li>
  );
}

export default function Q31_TodoReducer() {
  const [todos, dispatch] = useReducer(todosReducer, initialTodos);
  const [text, setText] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    dispatch({ type: "added", id: crypto.randomUUID(), text: value });   // id made in the handler
    setText("");
  };

  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div style={{ maxWidth: 420 }}>
      <form onSubmit={handleAdd}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a todo" />{" "}
        <button type="submit">Add</button>
      </form>

      {todos.length === 0 ? <p>🎉 Nothing to do.</p> : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {todos.map((t) => <TodoItem key={t.id} todo={t} dispatch={dispatch} />)}
        </ul>
      )}

      <p>{remaining} remaining</p>
      <button onClick={() => dispatch({ type: "cleared_done" })}>Clear completed</button>
      <p><small>Double-click a todo to edit. Enter saves, Esc cancels.</small></p>
    </div>
  );
}