import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!credentials.email || !credentials.password) {
      setError("Please enter both email and password");
      setIsLoading(false);
      return;
    }

    const result = await login(credentials);

    if (!result.success) {
      setError(result.message);
    }

    setIsLoading(false);
  };

  const containerStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    padding: "1rem",
  };

  const formContainerStyle = {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "2rem",
    color: "#1f2937",
  };

  const formStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  };

  const inputGroupStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  };

  const labelStyle = {
    fontSize: "0.875rem",
    fontWeight: "500",
    color: "#374151",
  };

  const inputStyle = {
    padding: "0.75rem",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    fontSize: "1rem",
    transition: "border-color 0.2s",
  };

  const buttonStyle = {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "0.75rem",
    borderRadius: "4px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginTop: "1rem",
  };

  const errorStyle = {
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    padding: "0.75rem",
    borderRadius: "4px",
    border: "1px solid #fecaca",
    fontSize: "0.875rem",
    marginBottom: "1rem",
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h1 style={titleStyle}>Admin Login</h1>
        {error && <div style={errorStyle}>{error}</div>}
        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="email" style={labelStyle}>
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your email"
              disabled={isLoading}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>
          <div style={inputGroupStyle}>
            <label htmlFor="password" style={labelStyle}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              style={inputStyle}
              placeholder="Enter your password"
              disabled={isLoading}
              onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
              onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
            />
          </div>
          <button
            type="submit"
            style={buttonStyle}
            disabled={isLoading}
            onMouseOver={(e) =>
              !isLoading && (e.target.style.backgroundColor = "#2563eb")
            }
            onMouseOut={(e) =>
              !isLoading && (e.target.style.backgroundColor = "#3b82f6")
            }
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
