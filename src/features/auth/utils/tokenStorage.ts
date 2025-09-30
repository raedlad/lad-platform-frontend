interface TokenData {
  access_token: string;
  refresh_token: string;
  access_token_expires_at: string;
  refresh_token_expires_at: string;
  access_token_expires_in: number;
  refresh_token_expires_in: number;
  token_type: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  user_type: string;
  status: string;
  avatar_url?: string;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  account_overview: {
    profile_status: string;
    document_status: string;
    overall_status: string;
    rejection_reasons: string[];
    verification_status: {
      verification_required: boolean;
      email_verified: boolean;
      phone_verified: boolean;
      email_verification_enabled: boolean;
      phone_verification_enabled: boolean;
      pending_actions: string[];
    };
    verification_required: {
      email_verification: {
        has_token: boolean;
        token_type: string | null;
      };
      phone_verification: {
        has_token: boolean;
        token_type: string | null;
      };
    };
  };
}

export const tokenStorage = {
  // Store tokens and user data
  storeTokens: (tokens: TokenData, user: UserData) => {
    if (typeof window === "undefined") return;

    // Store tokens
    localStorage.setItem("access_token", tokens.access_token);
    localStorage.setItem("refresh_token", tokens.refresh_token);
    localStorage.setItem("token_expires_at", tokens.access_token_expires_at);
    localStorage.setItem(
      "refresh_token_expires_at",
      tokens.refresh_token_expires_at
    );

    // Store user data
    localStorage.setItem("user", JSON.stringify(user));
    // Store current role for quick access
    if (user?.user_type) {
      localStorage.setItem("current_role", user.user_type);
    }

    // Store verification status
    localStorage.setItem(
      "verification_required",
      JSON.stringify(
        user.account_overview.verification_status.verification_required
      )
    );
    localStorage.setItem(
      "email_verification_required",
      JSON.stringify(
        user.account_overview.verification_required.email_verification.has_token
      )
    );
    localStorage.setItem(
      "phone_verification_required",
      JSON.stringify(
        user.account_overview.verification_required.phone_verification.has_token
      )
    );
  },

  // Update only access token and its expiry (after a refresh)
  updateAccessToken: (accessToken: string, accessTokenExpiresAt: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("token_expires_at", accessTokenExpiresAt);
  },

  // Get access token
  getAccessToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refresh_token");
  },

  // Get access token expiration timestamp (ms since epoch)
  getAccessTokenExpirationTime: (): number | null => {
    if (typeof window === "undefined") return null;
    const expiresAt = localStorage.getItem("token_expires_at");
    if (!expiresAt) return null;
    return new Date(expiresAt).getTime();
  },

  // Milliseconds until access token expiry (negative if already expired)
  getTimeUntilAccessTokenExpiryMs: (): number | null => {
    const exp = tokenStorage.getAccessTokenExpirationTime();
    if (exp === null) return null;
    return exp - new Date().getTime();
  },

  // Check if access token is expired
  isAccessTokenExpired: (): boolean => {
    if (typeof window === "undefined") return true;

    const expiresAt = localStorage.getItem("token_expires_at");
    if (!expiresAt) return true;

    const expirationTime = new Date(expiresAt).getTime();
    const currentTime = new Date().getTime();

    // Consider token expired if it expires within the next 5 minutes
    return currentTime >= expirationTime - 5 * 60 * 1000;
  },

  // Check if refresh token is expired
  isRefreshTokenExpired: (): boolean => {
    if (typeof window === "undefined") return true;

    const expiresAt = localStorage.getItem("refresh_token_expires_at");
    if (!expiresAt) return true;

    const expirationTime = new Date(expiresAt).getTime();
    const currentTime = new Date().getTime();

    return currentTime >= expirationTime;
  },

  // Get user data
  getUser: (): UserData | null => {
    if (typeof window === "undefined") return null;

    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },

  // Set user data
  setUser: (user: UserData) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("user", JSON.stringify(user));
  },

  // Check if verification is required
  isVerificationRequired: (): boolean => {
    if (typeof window === "undefined") return false;

    const verificationRequired = localStorage.getItem("verification_required");
    return verificationRequired ? JSON.parse(verificationRequired) : false;
  },

  // Check if email verification is required
  isEmailVerificationRequired: (): boolean => {
    if (typeof window === "undefined") return false;

    const emailVerificationRequired = localStorage.getItem(
      "email_verification_required"
    );
    return emailVerificationRequired
      ? JSON.parse(emailVerificationRequired)
      : false;
  },

  // Check if phone verification is required
  isPhoneVerificationRequired: (): boolean => {
    if (typeof window === "undefined") return false;

    const phoneVerificationRequired = localStorage.getItem(
      "phone_verification_required"
    );
    return phoneVerificationRequired
      ? JSON.parse(phoneVerificationRequired)
      : false;
  },

  // Clear all stored data
  clearAll: () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_expires_at");
    localStorage.removeItem("refresh_token_expires_at");
    localStorage.removeItem("user");
    localStorage.removeItem("verification_required");
    localStorage.removeItem("email_verification_required");
    localStorage.removeItem("phone_verification_required");
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    if (typeof window === "undefined") return false;

    const token = localStorage.getItem("access_token");
    if (!token) return false;

    return !tokenStorage.isAccessTokenExpired();
  },

  // Update helpers for verification flags stored in localStorage
  setVerificationRequired: (required: boolean) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("verification_required", JSON.stringify(required));
  },
  setEmailVerificationTokenFlag: (hasToken: boolean) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      "email_verification_required",
      JSON.stringify(hasToken)
    );
  },
  setPhoneVerificationTokenFlag: (hasToken: boolean) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(
      "phone_verification_required",
      JSON.stringify(hasToken)
    );
  },

  // Persist and retrieve current role
  setCurrentRole: (role: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("current_role", role);
  },
  getCurrentRole: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("current_role");
  },
  clearCurrentRole: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("current_role");
  },

  // Persist and retrieve current step
  setCurrentStep: (step: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("current_step", step);
  },
  getCurrentStep: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("current_step");
  },
  clearCurrentStep: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("current_step");
  },
};
