import React, { useState, useEffect } from "react";
import { agentsAPI } from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalAssignments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await agentsAPI.getAll();
      const agents = response.data;

      setStats({
        totalAgents: agents.length,
        activeAgents: agents.filter((agent) => agent.isActive).length,
        totalAssignments: 0, // This would be calculated from assignments
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "2rem",
  };

  const statsGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
    marginBottom: "2rem",
  };

  const statCardStyle = {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
  };

  const statNumberStyle = {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#3b82f6",
    display: "block",
  };

  const statLabelStyle = {
    fontSize: "1rem",
    color: "#6b7280",
    marginTop: "0.5rem",
  };

  const navigationStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1.5rem",
  };

  const navCardStyle = {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    border: "1px solid #e5e7eb",
    textDecoration: "none",
    color: "inherit",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
  };

  const navCardTitleStyle = {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "0.5rem",
  };

  const navCardDescStyle = {
    color: "#6b7280",
    fontSize: "0.875rem",
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Dashboard</h1>

      <div style={statsGridStyle}>
        <div style={statCardStyle}>
          <span style={statNumberStyle}>{stats.totalAgents}</span>
          <div style={statLabelStyle}>Total Agents</div>
        </div>
        <div style={statCardStyle}>
          <span style={statNumberStyle}>{stats.activeAgents}</span>
          <div style={statLabelStyle}>Active Agents</div>
        </div>
        <div style={statCardStyle}>
          <span style={statNumberStyle}>{stats.totalAssignments}</span>
          <div style={statLabelStyle}>Total Assignments</div>
        </div>
      </div>

      <div style={navigationStyle}>
        <div
          style={navCardStyle}
          onClick={() => (window.location.href = "/agents")}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          }}
        >
          <h3 style={navCardTitleStyle}>Manage Agents</h3>
          <p style={navCardDescStyle}>
            Add, edit, or remove agents from the system. View agent details and
            assignments.
          </p>
        </div>

        <div
          style={navCardStyle}
          onClick={() => (window.location.href = "/upload")}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          }}
        >
          <h3 style={navCardTitleStyle}>Upload & Distribute</h3>
          <p style={navCardDescStyle}>
            Upload CSV or Excel files and automatically distribute tasks among
            agents.
          </p>
        </div>

        <div
          style={navCardStyle}
          onClick={() => (window.location.href = "/distributions")}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
          }}
        >
          <h3 style={navCardTitleStyle}>View Distributions</h3>
          <p style={navCardDescStyle}>
            View all previous distributions and see how tasks were assigned to
            agents.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
