import axios from "axios";
import Cookies from "js-cookie";

// Use Vite environment variable
const baseURL =
  import.meta.env.VITE_API_BASE_URL_V1 || "http://localhost:9191/api/v1/";

const api = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add an interceptor to attach the token before each request
api.interceptors.request.use(
  (config) => {
    const authStorage = Cookies.get("auth-storage");
    let token = null;
    
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        token = parsed.state?.token;
      } catch (e) {
        console.error("Error parsing auth-storage from cookie", e);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
