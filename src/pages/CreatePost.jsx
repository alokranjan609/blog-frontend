import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import http from "../api/http";
import { AuthContext } from "../context/AuthContext";

export default function CreatePost() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      return setMessage("You must be logged in to create posts.");
    }

    try {
      await http.post(
        "/posts",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate("/"); // go back to home
    } catch (err) {
      setMessage("Failed to create post");
    }
  };

  return (
 <div>
  <h2>Create Post</h2>

  {message && <p>{message}</p>}

  <form onSubmit={handleSubmit}>
    <input
      name="title"
      placeholder="Title"
      value={form.title}
      onChange={handleChange}
    />

    <textarea
      name="content"
      placeholder="Content"
      value={form.content}
      onChange={handleChange}
    />

    <button type="submit">Publish</button>
  </form>
</div>

  );
}
