import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from 'date-fns';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate, useLocation } from "react-router-dom";

// IMPORT STYLES
import './App.css'; 

// IMPORT COMPONENTS
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";

const API_URL = "https://my-blog-api-muov.onrender.com/posts";

// === HELPER: RANDOM GRADIENT FOR PLACEHOLDERS ===
const getRandomGradient = (id) => {
  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
    "linear-gradient(120deg, #f093fb 0%, #f5576c 100%)",
  ];
  const index = id ? id.charCodeAt(id.length - 1) % gradients.length : 0;
  return gradients[index];
};

// === NAVBAR COMPONENT ===
function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedName = localStorage.getItem("username");
    setIsLoggedIn(!!token);
    if (storedName) setUsername(storedName);
  }, [location]); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsLoggedIn(false);
    navigate("/");
    window.location.reload(); 
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="logo">📝 My Blog</Link>
        <div className="nav-links">
          {isLoggedIn ? (
            <>
              <Link to="/create"><button className="btn btn-success">+ Write Story</button></Link>
              <Link to={`/profile/${username}`} style={{display: "flex", alignItems:"center", textDecoration:"none", color:"#334155", gap:"10px", fontWeight: "600"}}>
                <img className="avatar" src={`https://ui-avatars.com/api/?name=${username}&background=random`} alt="Avatar" style={{width: "35px", height: "35px"}} />
                <span>{username}</span>
              </Link>
              <button onClick={handleLogout} className="btn btn-danger" style={{padding: "8px 15px", fontSize: "0.85rem"}}>Log out</button>
            </>
          ) : (
            <Link to="/login"><button className="btn btn-primary">🔑 Login</button></Link>
          )}
        </div>
      </div>
    </nav>
  );
}

// === FOOTER COMPONENT (NEW) ===
function Footer() {
  return (
    <footer className="footer">
      <p>© 2026 My Awesome Blog. Built with React & Passion.</p>
      <div style={{marginTop: "15px", display: "flex", justifyContent:"center", gap: "25px", fontWeight: "500"}}>
        <a href="#" style={{color: "#64748b", textDecoration: "none"}}>Twitter</a>
        <a href="#" style={{color: "#64748b", textDecoration: "none"}}>GitHub</a>
        <a href="#" style={{color: "#64748b", textDecoration: "none"}}>Contact</a>
      </div>
    </footer>
  );
}

// === PAGE 1: HOME ===
function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState(""); 
  
  useEffect(() => { fetchPosts(); }, [search]); 

  const fetchPosts = async () => {
    const url = search ? `${API_URL}?q=${search}` : API_URL;
    const response = await axios.get(url);
    setPosts(response.data);
  };

  return (
    <div className="container">
      {/* HERO SECTION (UPDATED VISUALS) */}
      <div className="hero">
        <h1>
            Stories & Ideas <br />
            <span style={{color: "#4f46e5"}}>That Matter.</span>
        </h1>
        <p>A beautiful space for creators to share insights, code, and life lessons.</p>
      </div>

      {/* SEARCH BAR */}
      <div className="search-wrapper">
        <input 
          className="search-input"
          type="text" 
          placeholder="Search for something interesting..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid-container">
        {posts.length === 0 && (
            <div style={{gridColumn: "1 / -1", textAlign: "center", padding: "60px", color: "#94a3b8"}}>
                <div style={{fontSize: "3rem", marginBottom: "15px", opacity: "0.5"}}>🏜️</div>
                <h3>No stories found here.</h3>
            </div>
        )}
        
        {posts.map((post) => (
          <div key={post._id} className="card">
            
            {/* 1. IMAGE LINKS TO POST */}
            <Link to={`/post/${post._id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                <div className="card-image-box">
                    {post.image_url ? (
                        <img src={post.image_url} alt="Cover" />
                    ) : (
                        <div style={{height: "100%", width: "100%", background: getRandomGradient(post._id), display:"flex", alignItems:"center", justifyContent:"center", fontSize:"3rem", color: "white"}}>
                            📄
                        </div>
                    )}
                </div>
            </Link>

            <div className="card-content">
                {/* 2. TITLE LINKS TO POST */}
                <Link to={`/post/${post._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <h2 className="card-title">{post.title}</h2>
                </Link>

                {/* 3. METADATA */}
                <div className="card-meta">
                    <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
                        <img className="avatar" src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} alt="Author" style={{width:"28px", height:"28px"}}/>
                        <Link 
                            to={`/profile/${post.author}`} 
                            style={{ fontWeight: "600", color: "#475569", textDecoration: "none" }}
                        >
                            {post.author}
                        </Link>
                    </div>
                    <span>{post.created_at ? format(new Date(post.created_at), 'MMM d') : "Today"}</span>
                </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

// === PAGE 2: CREATE POST ===
function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    if (!token || !storedName) {
        alert("You must be logged in to write a story!");
        navigate("/login");
    } else {
        setAuthor(storedName);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(API_URL, { title, content, author, image_url: imageUrl });
    navigate("/"); 
  };

  return (
    <div className="container">
      <div style={{maxWidth: "700px", margin: "0 auto", width: "100%"}}>
        <h2 style={{marginBottom: "25px", textAlign:"center", fontSize: "2rem"}}>✍️ Write a New Story</h2>
        
        <form onSubmit={handleSubmit}>
            <label>Title</label>
            <input placeholder="Enter a catchy title..." value={title} onChange={(e) => setTitle(e.target.value)} required />
            
            <label>Story Content</label>
            <textarea 
                placeholder="Start writing your story here..." 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                required
                rows="12"
            />

            <label>Author (Locked)</label>
            <input value={author} readOnly style={{ backgroundColor: "#f1f5f9", cursor: "not-allowed", color: "#64748b" }} />

            <label>Cover Image URL (Optional)</label>
            <input placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            
            <button type="submit" className="btn btn-primary" style={{width: "100%", marginTop: "15px", padding: "15px"}}>
            Publish Post
            </button>
        </form>
      </div>
    </div>
  );
}

// === PAGE 3: POST DETAIL ===
function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [newComment, setNewComment] = useState(""); 
  const [isAuthor, setIsAuthor] = useState(false);
  const navigate = useNavigate();

  const fetchSinglePost = async () => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      setPost(response.data);
      const currentUser = localStorage.getItem("username");
      if (currentUser && response.data.author === currentUser) {
        setIsAuthor(true);
      }
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchSinglePost(); }, [id]);

  const handleDelete = async () => {
    if(!window.confirm("Are you sure? This cannot be undone.")) return;
    await axios.delete(`${API_URL}/${id}`);
    navigate("/");
  };

  const handleAddComment = async () => {
    if (!newComment) return; 
    await axios.post(`${API_URL}/${id}/comments`, { text: newComment });
    setNewComment(""); 
    fetchSinglePost(); 
  };

  const handleLike = async () => {
    await axios.post(`${API_URL}/${id}/like`);
    fetchSinglePost(); 
  };

  if (!post) return <div className="container" style={{textAlign:"center", paddingTop: "50px"}}>Loading story...</div>;

  return (
    <div className="container">
      <div className="card" style={{padding: "50px", maxWidth: "800px", margin: "0 auto"}}>
         <h1 style={{ fontSize: "2.8rem", marginTop: 0, lineHeight: "1.2", marginBottom: "15px" }}>{post.title}</h1>
         
         <div style={{display: "flex", alignItems: "center", gap: "15px", marginBottom: "30px", color: "#64748b", fontSize: "0.95rem"}}>
             <div style={{display:"flex", alignItems:"center", gap:"8px"}}>
                <img className="avatar" src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} alt="Author" style={{width:"30px", height:"30px"}} />
                <span style={{fontWeight: "600", color: "#334155"}}>{post.author}</span>
             </div>
             <span>•</span>
             <span>{post.created_at ? format(new Date(post.created_at), 'MMMM d, yyyy') : "Just now"}</span>
         </div>

         {post.image_url && (
            <div style={{borderRadius: "16px", overflow: "hidden", marginBottom: "35px", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)"}}>
                <img src={post.image_url} alt="Cover" style={{ width: "100%", display: "block" }} />
            </div>
         )}
         
         <div style={{ fontSize: "1.25rem", lineHeight: "1.8", whiteSpace: "pre-wrap", color: "#334155" }}>
            {post.content}
         </div>

         <div style={{marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <button onClick={handleLike} className="btn btn-outline">
                ❤️ {post.likes || 0} Likes
            </button>

            {isAuthor && (
                <div style={{ display: "flex", gap: "10px" }}>
                    <Link to={`/edit/${id}`}><button className="btn" style={{backgroundColor: "#fbbf24", color: "white"}}>✏️ Edit</button></Link>
                    <button onClick={handleDelete} className="btn btn-danger">🗑️ Delete</button>
                </div>
            )}
         </div>
      </div>

      <div style={{maxWidth: "800px", margin: "40px auto"}}>
        <h3 style={{marginBottom: "20px", fontSize: "1.5rem"}}>💬 Comments</h3>
        
        <div className="card" style={{padding: "30px"}}>
             <div style={{marginBottom: "30px"}}>
                 {post.comments?.map((c, i) => (
                     <div key={i} style={{background: "#f8fafc", padding: "15px 20px", borderRadius: "12px", marginBottom: "12px", border: "1px solid #e2e8f0"}}>
                         <div style={{fontWeight: "600", fontSize: "0.9rem", color: "#475569", marginBottom: "4px"}}>User says:</div>
                         {c.text || c}
                     </div>
                 ))}
                 {(!post.comments || post.comments.length === 0) && <p style={{color: "#94a3b8", fontStyle: "italic"}}>No comments yet. Be the first!</p>}
             </div>

             <div style={{display: "flex", gap: "15px"}}>
                 <input 
                    value={newComment} 
                    onChange={(e) => setNewComment(e.target.value)} 
                    placeholder="Write a thoughtful comment..." 
                    style={{marginBottom: 0, flex: 1}} 
                 />
                 <button onClick={handleAddComment} className="btn btn-primary" style={{whiteSpace: "nowrap"}}>Post Comment</button>
             </div>
        </div>
      </div>
    </div>
  );
}

// === PAGE 4: EDIT POST ===
function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const response = await axios.get(`${API_URL}/${id}`);
      const data = response.data;
      setTitle(data.title);
      setContent(data.content);
      setAuthor(data.author);
      setImageUrl(data.image_url || "");
    };
    fetchPost();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.put(`${API_URL}/${id}`, { title, content, author, image_url: imageUrl });
    navigate(`/post/${id}`);
  };

  return (
    <div className="container">
      <div style={{maxWidth: "700px", margin: "0 auto", width: "100%"}}>
        <h1 style={{textAlign: "center", marginBottom: "30px"}}>📝 Edit Your Story</h1>
        <form onSubmit={handleUpdate}>
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
            
            <label>Content</label>
            <textarea 
                value={content} 
                onChange={(e) => setContent(e.target.value)} 
                rows="15"
            />
            
            <label>Image URL</label>
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            
            <button type="submit" className="btn" style={{backgroundColor: "#fbbf24", width: "100%", color: "white", padding: "15px", marginTop: "10px"}}>Update Post</button>
        </form>
      </div>
    </div>
  );
}

// === MAIN APP ROUTER ===
function App() {
  return (
    <Router>
      <div style={{display: "flex", flexDirection: "column", minHeight: "100vh"}}>
        <Navbar /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetail />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:username" element={<UserProfile />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;