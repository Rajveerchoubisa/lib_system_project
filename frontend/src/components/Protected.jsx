// src/components/Protected.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const Protected = () => {
  // Example: check auth from localStorage or context
  const token = localStorage.getItem("token");

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the requested route
  return <Outlet />;
};

export default Protected;
