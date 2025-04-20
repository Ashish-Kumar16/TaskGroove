// src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("authToken");
  const reduxToken = useSelector((state) => state.auth?.token);
  const isAuthenticated = reduxToken || token;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  console.log("ProtectedRoute: Checking authentication", {
    isAuthenticated,
    reduxToken,
    localStorageToken: token,
    isLoading,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute: Not authenticated, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
