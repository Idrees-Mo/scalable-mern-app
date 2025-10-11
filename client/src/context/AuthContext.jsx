import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../utils/api.js";
import { useNotification } from "../context/NotificationContext.jsx";

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const notification = useNotification();

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.data);
      } catch (error) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post("/auth/login", { email, password });

      const { user, token } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      notification.success("Login successful!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      setError(message);
      notification.error(message);
      return { success: false, message };
    }
  };

  const register = async (username, email, password) => {
    try {
      setError(null);
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      });

      const { user, token } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      notification.success("Registration successful!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      setError(message);
      notification.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setError(null);
    notification.info("You have been logged out.");
  };

  // Update user function - this might be missing!
  const updateUser = (userData) => {
    setUser((prevUser) => ({ ...prevUser, ...userData }));
    // Also update localStorage
    const updatedUser = { ...user, ...userData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    setError,
    setUser: updateUser, // Make sure this is included!
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
