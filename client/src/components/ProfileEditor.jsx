import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useUsers } from "../hooks/useUsers.js";

const ProfileEditor = () => {
  const { user, setUser } = useAuth();
  const { updateProfile } = useUsers();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const updatedUser = await updateProfile(formData);

      // Update the auth context with the new user data
      // This is the key fix - we need to call setUser from useAuth
      if (setUser) {
        setUser(updatedUser);
      }

      // Also update localStorage to keep data consistent
      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const updatedUserData = { ...currentUser, ...updatedUser };
      localStorage.setItem("user", JSON.stringify(updatedUserData));

      setMessage("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setMessage(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
    });
    setIsEditing(false);
    setMessage("");
  };

  if (!isEditing) {
    return (
      <div className="profile-view">
        <div className="profile-header">
          <h3>Profile Information</h3>
          <button onClick={() => setIsEditing(true)} className="btn-primary">
            Edit Profile
          </button>
        </div>

        {message && (
          <div
            className={`message ${
              message.includes("success") ? "success-message" : "error-message"
            }`}
          >
            {message}
          </div>
        )}

        <div className="profile-info">
          <p>
            <strong>Username:</strong> {user?.username}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          <p>
            <strong>Member since:</strong>{" "}
            {new Date(user?.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-edit">
      <h3>Edit Profile</h3>

      {message && (
        <div
          className={`message ${
            message.includes("success") ? "success-message" : "error-message"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Updating..." : "Update Profile"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="btn-secondary"
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;
