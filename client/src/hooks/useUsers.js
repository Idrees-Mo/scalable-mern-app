import { useState, useCallback } from "react";
import api from "../utils/api.js";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  // Get all users - wrapped in useCallback to prevent recreation on every render
  const getUsers = useCallback(async (page = 1, limit = 10, filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...filters,
      });

      const response = await api.get(`/users?${params}`);
      setUsers(response.data.data);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array - function doesn't change

  // Get single user
  const getUser = useCallback(async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to fetch user");
    }
  }, []);

  // Update user
  const updateUser = useCallback(async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      // Update local state
      setUsers((prev) =>
        prev.map((user) => (user._id === userId ? response.data.data : user))
      );
      return response.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to update user");
    }
  }, []);

  // Delete user
  const deleteUser = useCallback(async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      // Remove from local state
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (err) {
      throw new Error(err.response?.data?.message || "Failed to delete user");
    }
  }, []);

  // Update profile (current user)
  const updateProfile = useCallback(async (userData) => {
    try {
      const response = await api.put("/users/profile", userData);
      return response.data.data;
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Failed to update profile"
      );
    }
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    updateProfile,
    setError,
  };
};
