import React, { useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");


  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await api.post("/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);
      localStorage.setItem("username", res.data.username);

      window.location.href = "/";
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data?.message || err.message || "Login failed. Please check credentials."
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
            Login to Kite
          </h2>
          <p style={{ margin: 0, color: "#777", fontSize: "0.85rem" }}>
            MERN Trading Terminal with Groq AI
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

        <form onSubmit={handleLogin}>
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
              placeholder="Enter your password"
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
              background: "#ff5722",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              fontSize: "1rem",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "0.85rem", color: "#666" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#4184f3", textDecoration: "none", fontWeight: 600 }}>
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;