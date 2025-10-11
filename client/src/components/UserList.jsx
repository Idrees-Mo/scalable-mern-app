import React, { useState, useEffect, useCallback } from "react";
import api from "../utils/api.js";
import { useNotification } from "../context/NotificationContext.jsx";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const { success, error: notifyError } = useNotification();

  // Memoized fetch function
  const fetchUsers = useCallback(async (page = 1, limit = 10, filters = {}) => {
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
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch users when page or search term changes
  useEffect(() => {
    fetchUsers(currentPage, 10, { search: searchTerm });
  }, [currentPage, searchTerm, fetchUsers]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setDeleteLoading(userId);
    try {
      await api.delete(`/users/${userId}`);

      setUsers((prev) => prev.filter((user) => user._id !== userId));

      if (users.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchUsers(currentPage, 10, { search: searchTerm });
      }

      success("User deleted successfully!");
    } catch (err) {
      const message = err.response?.data?.message || "Failed to delete user";
      notifyError(message);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (loading && users.length === 0) {
    return <div className="loading">Loading users...</div>;
  }

  return (
    <div className="user-list">
      <div className="user-list-header">
        <h2>User Management</h2>
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>{user.role}</span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user._id)}
                    disabled={deleteLoading === user._id}
                    className="btn-danger"
                  >
                    {deleteLoading === user._id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && !loading && (
          <div className="no-users">No users found</div>
        )}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>

          <span className="pagination-info">
            Page {currentPage} of {pagination.pages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === pagination.pages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserList;
