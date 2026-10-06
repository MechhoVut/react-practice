import { Component, useState } from "react";

class UserProfile extends Component {
  state = { user: null, loading: true, error: null };
  controller = null;

  componentDidMount() {
    this.loadUser(this.props.userId);
  }

  componentDidUpdate(prevProps /*, prevState */) {
    // ALWAYS compare, otherwise setState here causes an infinite loop
    if (prevProps.userId !== this.props.userId) {
      this.loadUser(this.props.userId);
    }
  }

  componentWillUnmount() {
    this.controller?.abort();
  }

  async loadUser(id) {
    this.controller?.abort();                       // cancel any request still in flight
    this.controller = new AbortController();
    this.setState({ loading: true, error: null });

    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`, {
        signal: this.controller.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const user = await res.json();
      this.setState({ user, loading: false });
    } catch (err) {
      if (err.name === "AbortError") return;
      this.setState({ error: err.message, loading: false });
    }
  }

  render() {
    const { user, loading, error } = this.state;
    if (loading) return <p>⏳ Loading user {this.props.userId}...</p>;
    if (error) return <p style={{ color: "crimson" }}>❌ {error}</p>;
    return <p>👤 {user.name} ({user.email})</p>;
  }
}

export default function Q22_ComponentDidUpdate() {
  const [userId, setUserId] = useState(1);
  return (
    <div>
      <button onClick={() => setUserId((id) => Math.max(1, id - 1))}>Prev</button>{" "}
      <button onClick={() => setUserId((id) => Math.min(10, id + 1))}>Next</button>{" "}
      <button onClick={() => setUserId(999)}>Invalid id</button>
      <p>userId = {userId}</p>
      <UserProfile userId={userId} />
    </div>
  );
}