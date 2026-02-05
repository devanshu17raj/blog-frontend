import { useState } from "react";
import axios from "axios";


export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    try {
      await axios.post("https://my-blog-api-muov.onrender.com/posts", {
        title: title,
        content: content,
        author: author


      });

      alert("Success! Post created.");
      
      setTitle("");
      setContent("");
      setAuthor("");
      
      window.location.reload(); 

    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post.");
    }
  };

  return (
    <div style={{ border: "2px solid #007bff", padding: "20px", borderRadius: "10px", marginBottom: "30px", backgroundColor: "#f0f8ff" }}>
      <h2>✍️ Write a New Story</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        
        <input 
          type="text" 
          placeholder="Title (e.g., My Day)" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />
        
        {/* --- 2. REPLACED TEXTAREA WITH RICH TEXT EDITOR --- */}
        {/* We wrap it in a div to give it height and spacing */}
         <textarea 
          placeholder="Content (Type your story here...)" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows="4"
          style={{ padding: "10px", fontSize: "16px" }}
        />
        {/* -------------------------------------------------- */}

        <input 
          type="text" 
          placeholder="Author Name" 
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
          style={{ padding: "10px", fontSize: "16px" }}
        />

        <button type="submit" style={{ padding: "12px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", fontSize: "16px" }}>
          🚀 Publish Post
        </button>

      </form>
    </div>
  );
}