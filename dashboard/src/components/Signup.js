import React, { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    if (e) e.preventDefault();
    if (!username || !email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.post("/signup", {
        username,
        email,
        password,
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("username", res.data.username);
        window.location.href = "/";
      } else {
        alert("Registration successful! Please login.");
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message || err.message || "Signup failed. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f9f9f9",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          padding: "36px",
          borderRadius: "8px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <img
            src="logo.png"
            alt="Kite Logo"
            style={{ width: "50px", marginBottom: "8px" }}
          />
          <h2 style={{ margin: "4px 0", color: "#333", fontSize: "1.5rem" }}>
            Open an Account
          </h2>
          <p style={{ margin: 0, color: "#777", fontSize: "0.85rem" }}>
            Get ₹1,00,000 demo trading margin instantly
          </p>
        </div>

        {errorMsg && (
          <div
            style={{
              padding: "10px",
              background: "#ffebee",
              color: "#c62828",
              fontSize: "0.85rem",
              borderRadius: "4px",
              marginBottom: "16px",
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "0.8rem", color: "#555", display: "block", marginBottom: "6px" }}>
              Username
            </label>
            <input
              type="text"
              placeholder="e.g. John Doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "0.95rem",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "0.8rem", color: "#555", display: "block", marginBottom: "6px" }}>
              Email address
            </label>
            <input
              type="email"
              placeholder="e.g. trader@zerodha.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "0.95rem",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ fontSize: "0.8rem", color: "#555", display: "block", marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "0.95rem",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#4184f3",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.85rem", color: "#666" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#4184f3", textDecoration: "none", fontWeight: 600 }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;