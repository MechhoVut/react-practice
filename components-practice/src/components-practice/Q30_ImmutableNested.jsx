import { memo, useState } from "react";

const createUser = () => ({
  name: "Asha",
  address: { city: "Kolkata", pin: "700001" },
});

// ⚠️ INTENTIONALLY WRONG: the bug this question asks you to demonstrate.
// Kept outside the component so lint doesn't flag the component body.
function unsafeMutateCity(user, city) {
  user.address.city = city;
}

// Memoized: only re-renders if the `address` REFERENCE changes
const AddressView = memo(function AddressView({ address }) {
  console.log("AddressView rendered");
  return <p>📍 AddressView shows: <b>{address.city}</b> ({address.pin})</p>;
});

export default function Q30_ImmutableNested() {
  const [user, setUser] = useState(createUser);
  const [, setTick] = useState(0);
  const [message, setMessage] = useState("Pick a button");

  // ❌ 1: mutate + same reference → React bails out, nothing re-renders
  const mutateOnly = () => {
    unsafeMutateCity(user, "Delhi");
    setUser(user);
    setMessage("❌ Same reference: React skipped the update. Click 'Force re-render' to reveal the hidden mutation.");
  };

  // ❌ 2: mutate + shallow copy → parent updates, but `address` is the SAME object
  const mutateAndCopy = () => {
    unsafeMutateCity(user, "Mumbai");
    setUser({ ...user });
    setMessage("❌ Shallow copy: the JSON updated, but the memoized child is stale.");
  };

  // ✅ 3: copy every level that changed
  const immutable = () => {
    setUser((u) => ({ ...u, address: { ...u.address, city: "Chennai" } }));
    setMessage("✅ New address object: parent and child both updated.");
  };

  const reset = () => {
    setUser(createUser());
    setMessage("Reset.");
  };

  return (
    <div>
      <button onClick={mutateOnly}>❌ Mutate + same ref</button>{" "}
      <button onClick={mutateAndCopy}>❌ Mutate + shallow copy</button>{" "}
      <button onClick={immutable}>✅ Immutable update</button>{" "}
      <button onClick={reset}>Reset</button>{" "}
      <button onClick={() => setTick((t) => t + 1)}>Force re-render</button>

      <p><i>{message}</i></p>

      <h4>Parent's state</h4>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      <h4>Memoized child</h4>
      <AddressView address={user.address} />
    </div>
  );
}