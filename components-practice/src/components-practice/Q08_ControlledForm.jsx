import { useState } from "react";

const initialValues = {
  name: "",
  email: "",
  role: "frontend",
  subscribe: false,
};

export default function Q08_ControlledForm() {
  const [values, setValues] = useState(initialValues);
  const [submitted, setSubmitted] = useState(null);

  // ONE handler for every field
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,   // computed property key
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();               // stop the page reload
    setSubmitted(values);
  };

  const handleReset = () => {
    setValues(initialValues);
    setSubmitted(null);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 10, maxWidth: 320 }}>
      <label>
        Name
        <input name="name" value={values.name} onChange={handleChange} required />
      </label>

      <label>
        Email
        <input name="email" type="email" value={values.email} onChange={handleChange} required />
      </label>

      <label>
        Role
        <select name="role" value={values.role} onChange={handleChange}>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="fullstack">Full stack</option>
        </select>
      </label>

      <label>
        <input
          name="subscribe"
          type="checkbox"
          checked={values.subscribe}      // checked, not value
          onChange={handleChange}
        />
        {" "}Subscribe to newsletter
      </label>

      <div>
        <button type="submit">Submit</button>{" "}
        <button type="button" onClick={handleReset}>Reset</button>
      </div>

      <h4>Live state</h4>
      <pre>{JSON.stringify(values, null, 2)}</pre>

      {submitted && (
        <>
          <h4>Submitted</h4>
          <pre>{JSON.stringify(submitted, null, 2)}</pre>
        </>
      )}
    </form>
  );
}