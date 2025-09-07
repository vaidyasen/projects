import React, { useState, useEffect } from "react";
import { uploadAPI } from "../services/api";

const Distributions = () => {
  const [distributions, setDistributions] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDistributions();
  }, []);

  const fetchDistributions = async () => {
    try {
      setLoading(true);
      const response = await uploadAPI.getDistributions();
      setDistributions(response.data);
    } catch (error) {
      console.error("Error fetching distributions:", error);
      setError("Failed to fetch distributions");
    } finally {
      setLoading(false);
    }
  };

  const fetchBatchDetails = async (batchId) => {
    try {
      setDetailsLoading(true);
      const response = await uploadAPI.getDistributionByBatch(batchId);
      setSelectedBatch(response.data);
    } catch (error) {
      console.error("Error fetching batch details:", error);
      setError("Failed to fetch batch details");
    } finally {
      setDetailsLoading(false);
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

  const cardStyle = {
    backgroundColor: "white",
    padding: "1.5rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    marginBottom: "1.5rem",
  };

  const batchHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  };

  const batchIdStyle = {
    fontFamily: "monospace",
    backgroundColor: "#f3f4f6",
    padding: "0.25rem 0.5rem",
    borderRadius: "4px",
    fontSize: "0.875rem",
  };

  const statsStyle = {
    display: "flex",
    gap: "2rem",
    marginBottom: "1rem",
    fontSize: "0.875rem",
    color: "#6b7280",
  };

  const buttonStyle = {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "background-color 0.2s",
  };

  const distributionGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1rem",
    marginTop: "1rem",
  };

  const agentCardStyle = {
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    padding: "1rem",
    backgroundColor: "#f9fafb",
  };

  const agentHeaderStyle = {
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: "0.5rem",
  };

  const agentEmailStyle = {
    fontSize: "0.875rem",
    color: "#6b7280",
    marginBottom: "0.5rem",
  };

  const itemCountStyle = {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "#3b82f6",
  };

  const itemsListStyle = {
    marginTop: "1rem",
    maxHeight: "200px",
    overflowY: "auto",
    border: "1px solid #e5e7eb",
    borderRadius: "4px",
    backgroundColor: "white",
  };

  const itemStyle = {
    padding: "0.5rem",
    borderBottom: "1px solid #f3f4f6",
    fontSize: "0.875rem",
  };

  const alertStyle = {
    padding: "0.75rem",
    borderRadius: "4px",
    marginBottom: "1rem",
    backgroundColor: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
  };

  const backButtonStyle = {
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "4px",
    fontSize: "0.875rem",
    cursor: "pointer",
    marginBottom: "1rem",
    transition: "background-color 0.2s",
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          Loading distributions...
        </div>
      </div>
    );
  }

  if (selectedBatch) {
    return (
      <div style={containerStyle}>
        <button
          style={backButtonStyle}
          onClick={() => setSelectedBatch(null)}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#4b5563")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#6b7280")}
        >
          ← Back to All Distributions
        </button>

        <h1 style={titleStyle}>Distribution Details</h1>

        {error && <div style={alertStyle}>{error}</div>}

        {detailsLoading ? (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            Loading details...
          </div>
        ) : (
          <div style={cardStyle}>
            <div style={batchHeaderStyle}>
              <div>
                <h3 style={{ color: "#1f2937", marginBottom: "0.5rem" }}>
                  Batch:{" "}
                  <span style={batchIdStyle}>{selectedBatch.batchId}</span>
                </h3>
                <div style={statsStyle}>
                  <span>
                    <strong>Total Items:</strong> {selectedBatch.totalItems}
                  </span>
                  <span>
                    <strong>Agents:</strong>{" "}
                    {selectedBatch.distributions.length}
                  </span>
                </div>
              </div>
            </div>

            <div style={distributionGridStyle}>
              {selectedBatch.distributions.map((dist, index) => (
                <div key={index} style={agentCardStyle}>
                  <div style={agentHeaderStyle}>{dist.agent.name}</div>
                  <div style={agentEmailStyle}>{dist.agent.email}</div>
                  <div style={itemCountStyle}>{dist.count} items assigned</div>

                  <div style={itemsListStyle}>
                    {dist.items.map((item, itemIndex) => (
                      <div key={itemIndex} style={itemStyle}>
                        <div>
                          <strong>{item.firstName}</strong>
                        </div>
                        <div>📞 {item.phone}</div>
                        {item.notes && <div>📝 {item.notes}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Distribution History</h1>

      {error && <div style={alertStyle}>{error}</div>}

      {distributions.length === 0 ? (
        <div style={cardStyle}>
          <div
            style={{ textAlign: "center", color: "#6b7280", padding: "2rem" }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
            <h3 style={{ marginBottom: "0.5rem" }}>No distributions found</h3>
            <p>
              Upload your first CSV or Excel file to see distributions here.
            </p>
          </div>
        </div>
      ) : (
        distributions.map((batch, index) => (
          <div key={index} style={cardStyle}>
            <div style={batchHeaderStyle}>
              <div>
                <h3 style={{ color: "#1f2937", marginBottom: "0.5rem" }}>
                  Batch: <span style={batchIdStyle}>{batch.batchId}</span>
                </h3>
                <div style={statsStyle}>
                  <span>
                    <strong>Total Items:</strong> {batch.totalItems}
                  </span>
                  <span>
                    <strong>Agents:</strong> {batch.distributions.length}
                  </span>
                  <span>
                    <strong>Date:</strong>{" "}
                    {new Date(
                      parseInt(batch.batchId.split("-")[0])
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                style={buttonStyle}
                onClick={() => fetchBatchDetails(batch.batchId)}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#2563eb")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#3b82f6")}
              >
                View Details
              </button>
            </div>

            <div style={distributionGridStyle}>
              {batch.distributions.map((dist, distIndex) => (
                <div key={distIndex} style={agentCardStyle}>
                  <div style={agentHeaderStyle}>{dist.agent.name}</div>
                  <div style={agentEmailStyle}>{dist.agent.email}</div>
                  <div style={itemCountStyle}>{dist.count} items</div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Distributions;
