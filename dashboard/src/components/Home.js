import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import Login from "./Login";
import Signup from "./Signup";

const Home = () => {
  const token = localStorage.getItem("token");
  return (
    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/signup"
        element={<Signup />}
      />

      <Route
  path="/*"
  element={
    token ? (
      <>
        <TopBar />
        <Dashboard />
      </>
    ) : (
      <Navigate to="/login" />
    )
  }
/>

    </Routes>
  );
};

export default Home;