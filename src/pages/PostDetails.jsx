import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import http from "../api/http";
import { AuthContext } from "../context/AuthContext";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { token, user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [editing, setEditing] = useState(false);

  // fetch post + comments
  useEffect(() => {
    const load = async () => {
      try {
        const p = await http.get(`/posts/${id}`);
        setPost(p.data);

        const c = await http.get(`/comments/${id}`);
        setComments(c.data);
      } catch (e) {
        setMsg("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  // Add comment
  const addComment = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!token) return setMsg("You must be logged in to comment.");

    try {
      const res = await http.post(
        "/comments",
        { text, postId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments([res.data, ...comments]);
      setText("");
    } catch {
      setMsg("Failed to add comment");
    }
  };

  // Update post
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await http.put(
        `/posts/${id}`,
        {
          title: post.title,
          content: post.content,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPost(res.data);
      setEditing(false);
    } catch {
      setMsg("Failed to update post");
    }
  };

  // Delete post
  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;

    try {
      await http.delete(`/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/");
    } catch {
      setMsg("Failed to delete post");
    }
  };

  if (loading) return <p>Loading…</p>;
  if (!post) return <p>Post not found</p>;

console.log("user:", user);
console.log("post.author:", post?.author);
  return (
    <div>
      {/* VIEW / EDIT MODE */}
      {editing ? (
        <form onSubmit={handleUpdate}>
          <input
            value={post.title}
            onChange={(e) =>
              setPost({ ...post, title: e.target.value })
            }
          />

          <br />

          <textarea
            value={post.content}
            onChange={(e) =>
              setPost({ ...post, content: e.target.value })
            }
          />

          <br />

          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </>
      )}

      <small>Author: {post?.author?.name || "Unknown"}</small>

      <hr />

      {/* Show edit/delete only if user is author */}
      {user && post.author?._id === user.id && !editing && (
        <div style={{ marginBottom: 15 }}>
          <button style={{ marginRight: 10 }} onClick={() => setEditing(true)}>
            Edit
          </button>

          <button onClick={handleDelete}>
            Delete
          </button>
        </div>
      )}

      <h3>Comments</h3>

      {msg && <p>{msg}</p>}

      {/* comment form */}
      <form onSubmit={addComment}>
        <textarea
          placeholder="Write a comment…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <br />

        <button type="submit">Post Comment</button>
      </form>

      {/* comments */}
      {comments.length === 0 && <p>No comments yet.</p>}

      {comments.map((c) => (
  <div key={c._id} className="comment" style={{ marginTop: 10 }}>
    <p>{c.text}</p>
    <small>{c?.userId?.name || "User"}</small>
  </div>
))}
    </div>
  );
}
