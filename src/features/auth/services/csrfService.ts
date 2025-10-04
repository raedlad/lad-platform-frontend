import axios from "axios";

/**
 * CSRF Cookie Service
 * Handles fetching CSRF tokens from the backend for Laravel Sanctum
 */
export const csrfService = {
  /**
   * Fetch CSRF cookie from the backend
   * This should be called before any authenticated requests
   */
  fetchCsrfCookie: async (): Promise<void> => {
    try {
      const csrfUrl = "https://admin.lad.sa/sanctum/csrf-cookie";

      console.log("🔄 First handshake: Fetching CSRF cookie from", csrfUrl);

      const response = await axios.get(csrfUrl, {
        withCredentials: true, // Important: Include cookies in the request
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log(
        "✅ First handshake completed: CSRF cookie fetched successfully"
      );
      console.log("📋 Response headers:", response.headers);
      console.log("🍪 Set-Cookie headers:", response.headers["set-cookie"]);

      // Small delay to make handshakes more visible in network tab
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error("❌ First handshake failed:", error);
      throw new Error("Failed to initialize CSRF protection");
    }
  },

  /**
   * Get CSRF token from meta tag or cookie
   * This is a fallback method if the backend provides the token in other ways
   */
  getCsrfToken: (): string | null => {
    if (typeof window === "undefined") return null;

    // Try to get from meta tag first
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      return metaTag.getAttribute("content");
    }

    // Try to get from cookie
    const cookies = document.cookie.split(";");
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split("=");
      if (name === "XSRF-TOKEN") {
        return decodeURIComponent(value);
      }
    }

    return null;
  },
};

export default csrfService;
