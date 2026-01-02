import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useContext } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreatePost from "./pages/CreatePost";
import PostDetails from "./pages/PostDetails";

import { AuthContext } from "./context/AuthContext";

function App() {
  const { token, logout } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          borderBottom: "1px solid #ddd"
        }}
      >
        <nav style={{ display: "flex", gap: 10 }}>
          <Link to="/">Home</Link>

          {token && <Link to="/create">Create</Link>}

          {!token && <Link to="/login">Login</Link>}
          {!token && <Link to="/signup">Signup</Link>}
        </nav>

        {token && (
          <button onClick={logout}>
            Logout
          </button>
        )}
      </header>

     <div className="container">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/post/:id" element={<PostDetails />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
