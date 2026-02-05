import { useEffect, useState } from "react";
import axios from "axios";

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track which post we are editing
  const [editFormData, setEditFormData] = useState({ title: "", content: "", author: "" });

  // 1. Fetch posts on load
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get("https://my-blog-api-muov.onrender.com/posts");
      setPosts(response.data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // 2. Handle Delete
  const handleDelete = async (id) => {
    await axios.delete(`http://127.0.0.1:8000/posts/${id}`);
    fetchPosts(); // Reload list
  };

  // 3. Handle Edit Click (Turn on "Edit Mode")
  const handleEditClick = (post) => {
    setEditingId(post._id);
    setEditFormData({ title: post.title, content: post.content, author: post.author });
  };

  // 4. Handle Save (Send changes to Python)
  const handleSave = async (id) => {
    await axios.put(`http://127.0.0.1:8000/posts/${id}`, editFormData);
    setEditingId(null); // Turn off "Edit Mode"
    fetchPosts(); // Reload list
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Recent Posts</h2>
      
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {posts.map((post) => (
          <div key={post._id} style={{ 
            border: "1px solid #ddd", 
            borderRadius: "8px", 
            padding: "20px", 
            marginBottom: "20px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            position: "relative",
            backgroundColor: editingId === post._id ? "#fffbf0" : "white" // Highlight being edited
          }}>

            {/* IF we are editing this post, show Input Boxes */}
            {editingId === post._id ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input 
                  type="text" 
                  value={editFormData.title} 
                  onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                />
                <textarea 
                  value={editFormData.content} 
                  onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                />
                <input 
                  type="text" 
                  value={editFormData.author} 
                  onChange={(e) => setEditFormData({...editFormData, author: e.target.value})}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => handleSave(post._id)} style={{ backgroundColor: "green", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}>Save</button>
                  <button onClick={() => setEditingId(null)} style={{ backgroundColor: "gray", color: "white", padding: "5px 10px", border: "none", cursor: "pointer" }}>Cancel</button>
                </div>
              </div>
            ) : (
              // ELSE show the normal text
              <>
                <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "5px" }}>
                  <button onClick={() => handleEditClick(post)} style={{ backgroundColor: "#ffc107", border: "none", padding: "5px", cursor: "pointer", borderRadius: "3px" }}>✏️ Edit</button>
                  <button onClick={() => handleDelete(post._id)} style={{ backgroundColor: "#ff4444", color: "white", border: "none", padding: "5px", cursor: "pointer", borderRadius: "3px" }}>🗑️ Delete</button>
                </div>

                <h2 style={{ margin: "0 0 10px 0", color: "#333" }}>{post.title}</h2>
                <p style={{ color: "#555", lineHeight: "1.6" }}>{post.content}</p>
                <p style={{ fontSize: "0.9em", color: "#888", marginTop: "15px" }}>
                  Written by: <strong>{post.author}</strong>
                </p>
              </>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}