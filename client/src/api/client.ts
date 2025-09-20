import axios from "axios";

// Use Vite environment variable
const baseURL =
  import.meta.env.VITE_API_BASE_URL_V1 || "http://localhost:9191/api/v1/";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // Keep this
  headers: {
    "Content-Type": "application/json",

  },
});

// Add an interceptor to attach the token before each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // or sessionStorage, or Zustand/Redux state
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
