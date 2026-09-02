import React, { useState } from "react";
import axios from "axios";

const Signup = () => {

  const [username,setUsername] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleSignup = () => {

    axios.post("http://localhost:3002/signup", {
      username,
      email,
      password,
    })
    .then(() => {
      alert("User Registered Successfully");
    })
    .catch((err) => {
      console.log(err);
    });

  };

  return (
    <div>

      <h1>Signup</h1>

      <input
        placeholder="Username"
        onChange={(e)=>setUsername(e.target.value)}
      />

      <br /><br />

      <input
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

      <button onClick={handleSignup}>
        Signup
      </button>

    </div>
  );
};

export default Signup;