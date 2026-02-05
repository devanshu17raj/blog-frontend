import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";

const API_URL = "http://127.0.0.1:8000/posts";

function UserProfile() {
  const { username } = useParams(); // URL will be /profile/Dev
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const response = await axios.get(API_URL);
        const allPosts = response.data;
        
        // FILTER: Keep only posts where author matches the URL username
        const filtered = allPosts.filter(post => post.author === username);
        setUserPosts(filtered);
      } catch (error) {
        console.error("Error fetching posts", error);
      }
    };
    fetchUserPosts();
  }, [username]);

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <Link to="/" style={{ color: "grey", textDecoration: "none" }}>← Back Home</Link>

      <div style={{ textAlign: "center", margin: "30px 0", borderBottom: "1px solid #ddd", paddingBottom: "30px" }}>
        {/* Dynamic Avatar */}
        <img 
            src={`https://ui-avatars.com/api/?name=${username}&background=random&size=128`} 
            alt="Avatar" 
            style={{ borderRadius: "50%", marginBottom: "15px" }}
        />
        <h1>{username}'s Profile</h1>
        <p style={{ color: "grey" }}>Has written <b>{userPosts.length}</b> stories</p>
      </div>

      <div style={{ display: "grid", gap: "15px" }}>
        {userPosts.length === 0 ? (
            <p style={{ textAlign: "center" }}>No stories found.</p>
        ) : (
            userPosts.map((post) => (
            <div key={post._id} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", backgroundColor: "#f9f9f9" }}>
                <Link to={`/post/${post._id}`} style={{ textDecoration: "none", color: "black" }}>
                <h2 style={{ margin: "0 0 10px 0", color: "#007bff" }}>{post.title}</h2>
                </Link>
                <p style={{ fontSize: "0.9rem", color: "#555" }}>
                    {post.created_at ? format(new Date(post.created_at), 'MMM d, yyyy') : "Just now"}
                </p>
            </div>
            ))
        )}
      </div>
    </div>
  );
}

export default UserProfile;