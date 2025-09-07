import React, { useState, useEffect } from "react";
import { agentsAPI } from "../services/api";

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await agentsAPI.getAll();
      setAgents(response.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
      setError("Failed to fetch agents");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.mobile ||
      (!editingAgent && !formData.password)
    ) {
      setError("All fields are required");
      return;
    }

    try {
      if (editingAgent) {
        const updateData = { ...formData };
        delete updateData.password; // Don't update password
        await agentsAPI.update(editingAgent._id, updateData);
        setSuccess("Agent updated successfully");
      } else {
        await agentsAPI.create(formData);
        setSuccess("Agent created successfully");
      }

      setFormData({ name: "", email: "", mobile: "", password: "" });
      setShowForm(false);
      setEditingAgent(null);
      fetchAgents();
    } catch (error) {
      setError(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (agent) => {
    setEditingAgent(agent);
    setFormData({
      name: agent.name,
      email: agent.email,
      mobile: agent.mobile,
      password: "",
    });
    setShowForm(true);
  };

  const handleDelete = async (agentId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this agent? This will also delete all their assignments."
      )
    ) {
      try {
        await agentsAPI.delete(agentId);
        setSuccess("Agent deleted successfully");
        fetchAgents();
      } catch (error) {
        setError(error.response?.data?.message || "Delete failed");
      }
    }
  };

  const containerStyle = {
    padding: "2rem",
    maxWidth: "1200px",
    margin: "0 auto",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1f2937",
  };

  const buttonStyle = {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
  };

  const formStyle = {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "2rem",
  };

  const inputGroupStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1rem",
    marginBottom: "1rem",
  };

  const inputStyle = {
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "1rem",
  };

  const tableStyle = {
    width: "100%",
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  };

  const thStyle = {
    backgroundColor: "#f9fafb",
    padding: "1rem",
    textAlign: "left",
    fontWeight: "600",
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
  };

  const tdStyle = {
    padding: "1rem",
    borderBottom: "1px solid #e5e7eb",
  };

  const actionButtonStyle = {
    padding: "0.25rem 0.75rem",
    margin: "0 0.25rem",
    borderRadius: "4px",
    border: "none",
    fontSize: "0.875rem",
    cursor: "pointer",
  };

  const editButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: "#f59e0b",
    color: "white",
  };

  const deleteButtonStyle = {
    ...actionButtonStyle,
    backgroundColor: "#ef4444",
    color: "white",
  };

  const alertStyle = (type) => ({
    padding: "0.75rem",
    borderRadius: "4px",
    marginBottom: "1rem",
    backgroundColor: type === "error" ? "#fef2f2" : "#f0fdf4",
    color: type === "error" ? "#dc2626" : "#166534",
    border: `1px solid ${type === "error" ? "#fecaca" : "#bbf7d0"}`,
  });

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          Loading agents...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Agents Management</h1>
        <button
          style={buttonStyle}
          onClick={() => {
            setShowForm(!showForm);
            setEditingAgent(null);
            setFormData({ name: "", email: "", mobile: "", password: "" });
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
        >
          {showForm ? "Cancel" : "Add Agent"}
        </button>
      </div>

      {error && <div style={alertStyle("error")}>{error}</div>}
      {success && <div style={alertStyle("success")}>{success}</div>}

      {showForm && (
        <div style={formStyle}>
          <h3 style={{ marginBottom: "1rem", color: "#1f2937" }}>
            {editingAgent ? "Edit Agent" : "Add New Agent"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={inputGroupStyle}>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile (+1234567890)"
                value={formData.mobile}
                onChange={handleInputChange}
                style={inputStyle}
                required
              />
              {!editingAgent && (
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  style={inputStyle}
                  required
                />
              )}
            </div>
            <button
              type="submit"
              style={buttonStyle}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#2563eb")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
            >
              {editingAgent ? "Update Agent" : "Create Agent"}
            </button>
          </form>
        </div>
      )}

      <div style={tableStyle}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Mobile</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Created At</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {agents.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{ ...tdStyle, textAlign: "center", color: "#6b7280" }}
                >
                  No agents found. Create your first agent to get started.
                </td>
              </tr>
            ) : (
              agents.map((agent) => (
                <tr key={agent._id}>
                  <td style={tdStyle}>{agent.name}</td>
                  <td style={tdStyle}>{agent.email}</td>
                  <td style={tdStyle}>{agent.mobile}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        padding: "0.25rem 0.5rem",
                        borderRadius: "12px",
                        fontSize: "0.75rem",
                        fontWeight: "500",
                        backgroundColor: agent.isActive ? "#d1fae5" : "#fee2e2",
                        color: agent.isActive ? "#065f46" : "#991b1b",
                      }}
                    >
                      {agent.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {new Date(agent.createdAt).toLocaleDateString()}
                  </td>
                  <td style={tdStyle}>
                    <button
                      style={editButtonStyle}
                      onClick={() => handleEdit(agent)}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#d97706")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#f59e0b")
                      }
                    >
                      Edit
                    </button>
                    <button
                      style={deleteButtonStyle}
                      onClick={() => handleDelete(agent._id)}
                      onMouseOver={(e) =>
                        (e.target.style.backgroundColor = "#dc2626")
                      }
                      onMouseOut={(e) =>
                        (e.target.style.backgroundColor = "#ef4444")
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Agents;
