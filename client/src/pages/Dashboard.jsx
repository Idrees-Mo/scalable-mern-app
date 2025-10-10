import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import ProfileEditor from "../components/ProfileEditor.jsx";
import UserList from "../components/UserList.jsx";
import "./Dashboard.css";

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>MERN App Dashboard</h1>
          <div className="user-welcome">
            Welcome, <strong>{user?.username}</strong>!
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={`nav-tab ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          My Profile
        </button>
        <button
          className={`nav-tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          User Management
        </button>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-content">
          {activeTab === "profile" && <ProfileEditor />}
          {activeTab === "users" && <UserList />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
