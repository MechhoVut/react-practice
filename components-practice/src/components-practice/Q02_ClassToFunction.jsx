import { Component, useState } from "react";

class CounterClass extends Component {
  state = { count: 0 };

  increment = () => this.setState((prev) => ({ count: prev.count + 1 }));
  decrement = () => this.setState((prev) => ({ count: prev.count - 1 }));
  reset = () => this.setState({ count: 0 });

  render() {
    return (
      <div>
        <h3>Class: {this.state.count}</h3>
        <button onClick={this.increment}>+</button>
        <button onClick={this.decrement}>-</button>
        <button onClick={this.reset}>Reset</button>
      </div>
    );
  }
}

function CounterFunction() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h3>Function: {count}</h3>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
      <button onClick={() => setCount((c) => c - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

export default function Q02_ClassToFunction() {
  return (
    <>
      <CounterClass />
      <CounterFunction />
    </>
  );
}