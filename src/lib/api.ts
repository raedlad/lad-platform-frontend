import axios from "axios";
import { getLocaleFromClient, defaultLocale } from "@/i18n";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";

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
    // Handle authentication errors (401 Unauthorized or 403 Forbidden)
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== "undefined") {
        // Clear all auth-related data using tokenStorage utility
        tokenStorage.clearAll();
        
        // Redirect to login page
        window.location.href = "/login";
      }
    } else if (error.response?.status === 500) {
      // Handle server errors
      console.error("Server error");
    }
    return Promise.reject(error);
  }
);

export default api;
