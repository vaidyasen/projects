import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "/api"
    : "http://localhost:5001/api");

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  getProfile: () => api.get("/auth/me"),
};

export const agentsAPI = {
  getAll: () => api.get("/agents"),
  create: (agentData) => api.post("/agents", agentData),
  getById: (id) => api.get(`/agents/${id}`),
  update: (id, agentData) => api.put(`/agents/${id}`, agentData),
  delete: (id) => api.delete(`/agents/${id}`),
  getAssignments: (id) => api.get(`/agents/${id}/assignments`),
};

export const uploadAPI = {
  uploadFile: (formData) => {
    return api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getDistributions: () => api.get("/upload/distributions"),
  getDistributionByBatch: (batchId) =>
    api.get(`/upload/distributions/${batchId}`),
};

export default api;
