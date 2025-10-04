import axios from "axios";
import { getLocaleFromClient, defaultLocale } from "@/i18n";

// Create axios instance with base configuration
export const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://moatasem.pinpaiss.com/api/v1/",
  timeout: 30000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": getLocaleFromClient(),
  },
  withCredentials: true,
});

// Request interceptor for adding auth tokens, etc.
api.interceptors.request.use(
  (config) => {
    // Set current language for each request
    config.headers["Accept-Language"] = getLocaleFromClient();

    // Add authentication token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling common responses
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors here
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.error("Unauthorized access");
    } else if (error.response?.status === 500) {
      // Handle server errors
      console.error("Server error");
    }
    return Promise.reject(error);
  }
);

export default api;
