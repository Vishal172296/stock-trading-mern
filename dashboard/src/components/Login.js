import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = () => {

    axios.post("https://stock-trading-backend-s0su.onrender.com/login", {
      email,
      password,
    })
   .then((res) => {

  console.log("LOGIN RESPONSE:", res.data);

  localStorage.setItem("token", res.data.token);
  localStorage.setItem("userId", res.data.userId);
  localStorage.setItem("username", res.data.username);

  console.log("TOKEN SAVED:",
    localStorage.getItem("token")
  );

  alert("Login Successful");

  window.location.href = "/";
})
    .catch((err) => {
  console.log(err);
  console.log(err.response);
  alert("Login Failed");
});

  };

  return (
    <div>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e)=>setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>
        Login
      </button>

    </div>
  );
};

export default Login;