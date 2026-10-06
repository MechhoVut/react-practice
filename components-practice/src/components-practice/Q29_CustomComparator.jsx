import { Component, memo, useState } from "react";

const fmt = (ts) => new Date(ts).toLocaleTimeString();

// Class: return TRUE to re-render, FALSE to skip
class UserCardClass extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.name !== this.props.name || nextProps.age !== this.props.age;   // ignores lastSeen
  }
  render() {
    console.log("🏛️ class UserCard rendered");
    const { name, age, lastSeen } = this.props;
    return <p>Class: {name}, {age} (lastSeen shown: {fmt(lastSeen)})</p>;
  }
}

// memo comparator: return TRUE to SKIP the re-render. It's the OPPOSITE of shouldComponentUpdate
const UserCardMemo = memo(
  function UserCardMemo({ name, age, lastSeen }) {
    console.log("⚛️ memo UserCard rendered");
    return <p>Memo: {name}, {age} (lastSeen shown: {fmt(lastSeen)})</p>;
  },
  (prev, next) => prev.name === next.name && prev.age === next.age      // ignores lastSeen
);

export default function Q29_CustomComparator() {
  const [age, setAge] = useState(25);
  const [lastSeen, setLastSeen] = useState(() => Date.now());

  return (
    <div>
      <button onClick={() => setLastSeen(Date.now())}>Update lastSeen (ignored prop)</button>{" "}
      <button onClick={() => setAge((a) => a + 1)}>Change age (watched prop)</button>

      <p>Parent lastSeen: <b>{fmt(lastSeen)}</b></p>
      <UserCardClass name="Asha" age={age} lastSeen={lastSeen} />
      <UserCardMemo name="Asha" age={age} lastSeen={lastSeen} />
    </div>
  );
}