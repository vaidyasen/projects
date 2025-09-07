import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
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

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
      toast.error("Session expired. Please log in again.");
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/me"),
};

// Resume API
export const resumeAPI = {
  getAll: () => api.get("/resume"),
  create: (data) => api.post("/resume", data),
  getById: (id) => api.get(`/resume/${id}`),
  update: (id, data) => api.put(`/resume/${id}`, data),
  delete: (id) => api.delete(`/resume/${id}`),
  downloadPDF: (id) => {
    return api.get(`/resume/${id}/download`, {
      responseType: "blob",
    });
  },
};

export default api;
