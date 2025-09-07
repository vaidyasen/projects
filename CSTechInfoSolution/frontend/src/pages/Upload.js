import React, { useState } from "react";
import { uploadAPI } from "../services/api";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setError("");
    setResult(null);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      const errorMsg = "Please select a file to upload!";
      setError(errorMsg);
      alert(errorMsg); // Browser alert for immediate attention

      // Clear file input to make it obvious no file is selected
      const fileInput = document.getElementById("file-input");
      if (fileInput) fileInput.value = "";

      return;
    }

    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (
      !allowedTypes.includes(file.type) &&
      !file.name.match(/\.(csv|xlsx|xls)$/i)
    ) {
      const errorMsg = "Please select a valid CSV, XLSX, or XLS file";
      setError(errorMsg);
      alert(errorMsg); // Browser alert for immediate attention
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setError("");

      const response = await uploadAPI.uploadFile(formData);
      setResult(response.data);
      setFile(null);

      // Reset file input
      const fileInput = document.getElementById("file-input");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const containerStyle = {
    padding: "2rem",
    maxWidth: "800px",
    margin: "0 auto",
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: "2rem",
  };

  const cardStyle = {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "2rem",
  };

  const uploadAreaStyle = {
    border: "2px dashed #d1d5db",
    borderRadius: "8px",
    padding: "3rem",
    textAlign: "center",
    backgroundColor: "#f9fafb",
    marginBottom: "1rem",
    transition: "border-color 0.2s",
  };

  const fileInputStyle = {
    margin: "1rem 0",
    padding: "0.5rem",
    border: "1px solid #d1d5db",
    borderRadius: "4px",
    width: "100%",
  };

  const getButtonStyle = () => ({
    backgroundColor: !file ? "#9ca3af" : "#3b82f6",
    color: "white",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    width: "100%",
  });

  const alertStyle = (type) => ({
    padding: "1rem",
    borderRadius: "4px",
    marginBottom: "1rem",
    backgroundColor: type === "error" ? "#fef2f2" : "#f0fdf4",
    color: type === "error" ? "#dc2626" : "#166534",
    border: `2px solid ${type === "error" ? "#f87171" : "#bbf7d0"}`,
    fontSize: "0.95rem",
    fontWeight: "500",
    textAlign: "center",
  });

  const resultStyle = {
    backgroundColor: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "8px",
    padding: "1.5rem",
  };

  const distributionGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginTop: "1rem",
  };

  const distributionCardStyle = {
    backgroundColor: "white",
    padding: "1rem",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Upload & Distribute Lists</h1>

      <div style={cardStyle}>
        <h3 style={{ marginBottom: "1rem", color: "#1f2937" }}>
          Upload CSV or Excel File
        </h3>
        <p
          style={{
            color: "#6b7280",
            marginBottom: "1.5rem",
            fontSize: "0.875rem",
          }}
        >
          Upload a CSV, XLSX, or XLS file with columns: FirstName, Phone, Notes
          (optional)
        </p>

        {error && <div style={alertStyle("error")}>⚠️ {error}</div>}

        <form onSubmit={handleUpload}>
          <div style={uploadAreaStyle}>
            <div
              style={{
                fontSize: "3rem",
                color: "#9ca3af",
                marginBottom: "1rem",
              }}
            >
              📄
            </div>
            <p style={{ color: "#6b7280", marginBottom: "1rem" }}>
              Drag and drop your file here, or click to select
            </p>
            <input
              id="file-input"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              style={fileInputStyle}
              disabled={uploading}
            />
            {file && (
              <p
                style={{
                  color: "#3b82f6",
                  fontSize: "0.875rem",
                  marginTop: "0.5rem",
                }}
              >
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <button
            type="submit"
            style={getButtonStyle()}
            disabled={uploading}
            onMouseOver={(e) =>
              !uploading && file && (e.target.style.backgroundColor = "#2563eb")
            }
            onMouseOut={(e) =>
              !uploading &&
              (e.target.style.backgroundColor = !file ? "#9ca3af" : "#3b82f6")
            }
          >
            {uploading ? "Uploading..." : "Upload and Distribute"}
          </button>
        </form>
      </div>

      {result && (
        <div style={resultStyle}>
          <h3 style={{ color: "#166534", marginBottom: "1rem" }}>
            ✅ Upload Successful!
          </h3>
          <p style={{ color: "#166534", marginBottom: "1rem" }}>
            <strong>Batch ID:</strong> {result.batchId}
          </p>
          <p style={{ color: "#166534", marginBottom: "1rem" }}>
            <strong>Total Items:</strong> {result.totalItems} items distributed
            among {result.distributions.length} agents
          </p>

          <h4 style={{ color: "#166534", marginBottom: "0.5rem" }}>
            Distribution Summary:
          </h4>
          <div style={distributionGridStyle}>
            {result.distributions.map((dist, index) => (
              <div key={index} style={distributionCardStyle}>
                <div style={{ fontWeight: "600", color: "#1f2937" }}>
                  {dist.agent.name}
                </div>
                <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  {dist.agent.email}
                </div>
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#3b82f6",
                    marginTop: "0.5rem",
                  }}
                >
                  {dist.count} items
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: "1rem",
              fontSize: "0.875rem",
              color: "#166534",
            }}
          >
            You can view detailed distributions in the "View Distributions"
            section.
          </div>
        </div>
      )}

      <div style={cardStyle}>
        <h3 style={{ color: "#1f2937", marginBottom: "1rem" }}>
          File Format Requirements
        </h3>
        <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
          <p style={{ marginBottom: "0.5rem" }}>
            <strong>Required columns:</strong>
          </p>
          <ul style={{ marginLeft: "1.5rem", marginBottom: "1rem" }}>
            <li>
              <strong>FirstName</strong> - Text field for the person's first
              name
            </li>
            <li>
              <strong>Phone</strong> - Phone number (any format)
            </li>
            <li>
              <strong>Notes</strong> - Optional text field for additional notes
            </li>
          </ul>
          <p style={{ marginBottom: "0.5rem" }}>
            <strong>Supported file types:</strong> CSV (.csv), Excel (.xlsx,
            .xls)
          </p>
          <p style={{ marginBottom: "0.5rem" }}>
            <strong>Maximum file size:</strong> 5MB
          </p>
          <p>
            <strong>Distribution:</strong> Items will be distributed equally
            among the first 5 active agents. If there are remainder items, they
            will be distributed sequentially.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upload;
