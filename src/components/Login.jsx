import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); // Switch between Login/Signup
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const API_URL = "https://my-blog-api-muov.onrender.com";

    try {
      if (isRegistering) {
        // --- SIGN UP LOGIC ---
        await axios.post(`${API_URL}/register`, { username, password });
        alert("Account created! Now please log in.");
        setIsRegistering(false); // Switch to login screen
      } else {
        // --- LOGIN LOGIC ---
        // Login requires specific "Form Data" format, not JSON
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        const response = await axios.post(`${API_URL}/login`, formData);
        
        // SAVE THE TOKEN (The key to the website)
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("username", username);
        alert("Logged in successfully!");
        navigate("/"); // Go to Home Page
      }
    } catch (error) {
      console.error(error);
      alert("Error: either username or password incorrect");
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center", maxWidth: "400px", margin: "0 auto" }}>
      <h1>{isRegistering ? "Sign Up" : "Log In"}</h1>
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          style={{ padding: "10px" }}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={{ padding: "10px" }}
        />
        
        <button type="submit" style={{ padding: "10px", backgroundColor: "blue", color: "white" }}>
          {isRegistering ? "Register" : "Login"}
        </button>
      </form>

      <p onClick={() => setIsRegistering(!isRegistering)} style={{ color: "blue", cursor: "pointer", marginTop: "20px" }}>
        {isRegistering ? "Already have an account? Log In" : "New here? Sign Up"}
      </p>
    </div>
  );
}

export default Login;