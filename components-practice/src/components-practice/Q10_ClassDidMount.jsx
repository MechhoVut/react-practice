import { Component, useState } from "react";

class MountLoggerClass extends Component {
  componentDidMount() {
    console.log("class: mounted");
  }
  componentWillUnmount() {
    console.log("class: unmounted");
  }
  render() {
    return <p>Class component: check the Console</p>;
  }
}

export default function Q10_ClassDidMount() {
  const [show, setShow] = useState(true);
  return (
    <div>
      <button onClick={() => setShow((s) => !s)}>{show ? "Unmount" : "Mount"}</button>
      {show && <MountLoggerClass />}
    </div>
  );
}