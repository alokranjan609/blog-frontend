import { useState } from "react";
import http from "../api/http";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await http.post("/auth/signup", form);
      setMessage("Signup successful! You can now login.");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      setMessage(
        err?.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  return (
    <div>
      <h2>Signup</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />

        <br />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <br />

        <input
          name="password"
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={handleChange}
        />

        <br />

        <button type="submit">Create account</button>
      </form>
    </div>
  );
}
