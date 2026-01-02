import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import http from "../api/http";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [form, setForm] = useState({
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
      const res = await http.post("/auth/login", form);

      // backend returns:  { token: "..." }
      login(res.data.token, res.data.user);


      setMessage("Logged in successfully!");
      navigate("/"); // redirect to home
    } catch (err) {
      setMessage(
        err?.response?.data?.message || "Invalid email or password."
      );
    }
  };

  return (
    <div>
      <h2>Login</h2>

      {message && <p>{message}</p>}

      <form onSubmit={handleSubmit}>
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

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
