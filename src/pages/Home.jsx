import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import http from "../api/http";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await http.get("/posts");
        setPosts(res.data);
      } catch (err) {
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>All Posts</h2>

      {posts.length === 0 && <p>No posts yet.</p>}

      {posts.map((post) => (
       <div className="card">
  <h3>
    <Link to={`/post/${post._id}`}>{post.title}</Link>
  </h3>

  <p>{post.content.slice(0, 120)}...</p>

  <small>Author: {post?.author?.name || "Unknown"}</small>
</div>

      ))}
    </div>
  );
}
