import React from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const navStyle = {
    backgroundColor: "#1f2937",
    color: "white",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  const titleStyle = {
    fontSize: "1.5rem",
    fontWeight: "bold",
    margin: 0,
  };

  const userInfoStyle = {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  };

  const buttonStyle = {
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "0.875rem",
    transition: "background-color 0.2s",
  };

  return (
    <nav style={navStyle}>
      <h1 style={titleStyle}>Agent Management System</h1>
      <div style={userInfoStyle}>
        <span>Welcome, {user?.email}</span>
        <button
          style={buttonStyle}
          onClick={handleLogout}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#dc2626")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#ef4444")}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
