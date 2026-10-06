// Q01: Build a Greeting component that takes name and age props
// and shows a default value if name is missing.

function Greeting({ name = "Guest", age }) {
  return <p>Hello, {name}!{age !== undefined && ` You are ${age} years old.`}</p>;
}

export default function Q01_Greeting() {
  return (
    <>
      <Greeting name="Asha" age={25} />
      <Greeting age={30} />
      <Greeting />
    </>
  );
}