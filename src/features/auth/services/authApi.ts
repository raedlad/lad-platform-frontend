import {
  ApiResponse,
  AuthResponse,
  RegistrationRequest,
  RegistrationResponse,
  IndividualRegistrationApiData,
  PersonalInfo,
  DynamicRegistrationData,
  RegistrationApiData,
  VerifyPhoneRequest,
  VerifyPhoneResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendEmailVerificationRequest,
  ResendEmailVerificationResponse,
  ForgotPasswordResponse,
  TokenData,
  AuthUser,
  ApiError,
} from "../types/auth";

import { api } from "@/lib/api";
import { useAuthStore } from "@auth/store/authStore";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import { csrfService } from "./csrfService";

// --- Authentication API Service ---

export const authApi = {
  // Refresh access token using refresh token
  refreshTokens: async (): Promise<ApiResponse<{ tokens: TokenData }>> => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken || tokenStorage.isRefreshTokenExpired()) {
        throw new Error("Refresh token missing or expired");
      }
      const response = await api.post("/auth/refresh", {
        refresh_token: refreshToken,
      });

      const tokens =
        response.data?.response?.extra?.tokens ||
        response.data?.tokens ||
        response.data;

      if (!tokens?.access_token || !tokens?.access_token_expires_at) {
        throw new Error("Invalid refresh response");
      }

      // Update stored tokens
      const currentUser = tokenStorage.getUser();
      if (currentUser) {
        // If backend rotates refresh token, prefer full store, else update access only
        if (tokens.refresh_token && tokens.refresh_token_expires_at) {
          tokenStorage.storeTokens(tokens, currentUser as AuthUser);
        } else {
          tokenStorage.updateAccessToken(
            tokens.access_token,
            tokens.access_token_expires_at
          );
        }
      } else {
        tokenStorage.updateAccessToken(
          tokens.access_token,
          tokens.access_token_expires_at
        );
      }

      // Update store tokens if present
      useAuthStore.setState((state) => ({
        ...state,
        tokens: tokens,
      }));

      return {
        success: true,
        data: { tokens: tokens as TokenData },
        message: "Token refreshed",
      };
    } catch (error: unknown) {
      const err = error as ApiError;
      console.error("Token refresh error:", err.message);
      // On failure, clear auth state
      try {
        tokenStorage.clearAll();
        const store = useAuthStore.getState();
        if (store.logout) store.logout();
      } catch {}
      return {
        success: false,
        message:
          err.response?.data?.message || err.message || "Token refresh failed",
        errors: err.response?.data?.errors,
      };
    }
  },
  // Social login (e.g., Google)
  socialLogin: async (
    provider: "google",
    accessToken: string
  ): Promise<ApiResponse<AuthResponse>> => {
    console.log("API Call: socialLogin", provider);

    try {
      // Fetch CSRF cookie before social login
      // await csrfService.fetchCsrfCookie();

      // Adjust endpoint/body to match your backend
      const response = await api.post(`/auth/social/${provider}`, {
        access_token: accessToken,
      });

      const userData = (response.data as AuthResponse)?.response;
      const tokens = userData?.extra?.tokens;

      useAuthStore.setState((state) => ({
        ...state,
        user: userData,
        isAuthenticated: true,
        isVerified:
          userData?.account_overview?.verification_status
            ?.verification_required || false,
        emailVerificationRequired:
          userData?.account_overview?.verification_required?.email_verification
            ?.has_token || false,
        phoneVerificationRequired:
          userData?.account_overview?.verification_required?.phone_verification
            ?.has_token || false,
        tokens: tokens,
        isLoading: false,
        error: null,
      }));

      // Persist tokens and user
      if (tokens && userData) {
        tokenStorage.storeTokens(tokens, userData);
      }

      return {
        success: true,
        data: {
          message: "Social login successful",
          response: userData,
        },
      };
    } catch (error: unknown) {
      const err = error as ApiError;
      console.error("Social login error:", err.message);
      if (err.response?.data) {
        return {
          success: false,
          message: err.response.data.message || "Social login failed",
          errors: err.response.data.errors || {
            general: ["Social login failed"],
          },
        };
      }
      return {
        success: false,
        message: "Social login failed",
        errors: { general: ["Social login failed"] },
      };
    }
  },
  // Individual Registration
  register: async (
    data: any,
    role: string
  ): Promise<ApiResponse<RegistrationResponse>> => {
    try {
      // // Fetch CSRF cookie before registration
      // await csrfService.fetchCsrfCookie();

      // console.log("🔄 Second handshake: Starting registration request");
      let response;

      // Check if this is organization, freelance engineer, engineering office, contractor, or supplier registration (use FormData for file upload)
      if (
        role === "organization" ||
        role === "freelance_engineer" ||
        role === "engineering_office" ||
        role === "contractor" ||
        role === "supplier"
      ) {
        // Use FormData for file upload registration
        const formData = new FormData();
        formData.append("name", data.data.name || "");
        formData.append("email", data.data.email || "");
        formData.append("password", data.data.password || "");
        formData.append("password_confirmation", data.data.password || "");
        formData.append("user_type", role.toLowerCase());
        formData.append("phone", data.data.phone || "");

        // Add country_id and phone_code
        if (data.data.country_id) {
          formData.append("country_id", String(data.data.country_id));
        }
        if (data.data.phone_code) {
          formData.append("phone_code", data.data.phone_code);
        }

        // Add role-specific fields
        if (role === "organization") {
          formData.append("business_name", data.data.business_name || "");
          formData.append(
            "commercial_register_number",
            data.data.commercial_register_number || ""
          );
        } else if (role === "freelance_engineer") {
          formData.append(
            "engineers_association_number",
            data.data.engineers_association_number || ""
          );
        } else if (role === "engineering_office") {
          formData.append("business_name", data.data.business_name || "");
          formData.append(
            "commercial_register_number",
            data.data.commercial_register_number || ""
          );
          formData.append("license_number", data.data.license_number || "");
        } else if (role === "contractor") {
          formData.append("business_name", data.data.business_name || "");
          formData.append(
            "commercial_register_number",
            data.data.commercial_register_number || ""
          );
        } else if (role === "supplier") {
          formData.append("business_name", data.data.business_name || "");
          formData.append(
            "commercial_register_number",
            data.data.commercial_register_number || ""
          );
        }

        // Only append file if it exists
        if (data.data.commercial_register_file) {
          formData.append(
            "commercial_register_file",
            data.data.commercial_register_file
          );
        }

        response = await api.post("/auth/register-intents", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        // Transform the data to match backend expectations for other roles
        const transformedData: RegistrationApiData = {
          name: data.data.name || "",
          email: data.data.email || "",
          password: data.data.password || "",
          password_confirmation: data.data.password || "",
          user_type: role.toLowerCase(),
          phone: data.data.phone || "",
          phone_code: data.data.phone_code,
        };

        // Add country_id if available
        if (data.data.country_id) {
          transformedData.country_id = String(data.data.country_id);
        }

        // Add role-specific fields (only for roles that don't use FormData)
        if (role === "individual") {
          transformedData.national_id = data.data.national_id || "";
        } else if (role === "governmental") {
          transformedData.commercial_register_number =
            data.data.commercial_register_number || "";
        }

        response = await api.post("/auth/register-intents", transformedData);
      }

      console.log(
        "✅ Second handshake completed: Registration request successful"
      );

      // Extract verification data from the new response structure
      const verificationData = response.data?.response;

      return {
        success: true,
        data: {
          message:
            response.data?.message ||
            "Registration successful. Please verify your account.",
          response: verificationData,
        },
        message: response.data?.message || "Registration successful",
      };
    } catch (error: unknown) {
      const err = error as ApiError;
      console.error("Registration error:", err.message);

      // Handle axios error response
      if (err.response?.data) {
        const backendError = err.response.data;
        console.log("Backend error response:", backendError);

        return {
          success: false,
          message: backendError.message || "Registration failed",
          errors: backendError.errors || {
            general: [backendError.message || "Registration failed"],
          },
        };
      }

      // Handle network or other errors
      if (err.message) {
        return {
          success: false,
          message: err.message,
          errors: { general: [err.message] },
        };
      }

      return {
        success: false,
        message: "Registration failed",
        errors: { general: ["Registration failed"] },
      };
    }
  },

  // Send Phone OTP
  sendPhoneOtp: async (
    phoneNumber: string
  ): Promise<ApiResponse<{ message: string }>> => {
    console.log("API Call: sendPhoneOtp", phoneNumber);

    try {
      const response = await api.post("/auth/verification/send-phone", {
        phone: phoneNumber,
      });

      return {
        success: true,
        data: { message: "Phone OTP sent successfully" },
        message: "Phone OTP sent",
      };
    } catch (error: unknown) {
      const err = error as ApiError;
      console.error("Send phone OTP error:", err.message);
      if (err.response?.data) {
        return {
          success: false,
          message: err.response.data.message || "Failed to send phone OTP",
          errors: err.response.data.errors || {
            general: ["Failed to send phone OTP"],
          },
        };
      }
      return {
        success: false,
        message: "Failed to send phone OTP",
        errors: { general: ["Failed to send phone OTP"] },
      };
    }
  },

  // Resend Email Verification
  resendEmailVerification: async (
    data?: ResendEmailVerificationRequest
  ): Promise<ApiResponse<ResendEmailVerificationResponse>> => {
    console.log("API Call: resendEmailVerification", data);

    try {
      const response = await api.post(
        "/auth/verification/resend-email",
        data || {}
      );

      return {
        success: true,
        data: {
          message: "Email verification sent successfully",
          success: true,
        },
        message: "Email verification sent",
      };
    } catch (error: unknown) {
      const err = error as ApiError;
      console.error("Resend email verification error:", err.message);
      if (err.response?.data) {
        return {
          success: false,
          message:
            err.response.data.message || "Failed to resend email verification",
          errors: err.response.data.errors || {
            general: ["Failed to resend email verification"],
          },
        };
      }
      return {
        success: false,
        message: "Failed to resend email verification",
        errors: { general: ["Failed to resend email verification"] },
      };
    }
  },

  // Verify Registration Intent (New registration flow)
  verifyRegistrationIntent: async (
    otp: string,
    contactInfo: string,
    authMethod: "email" | "phone"
  ): Promise<ApiResponse<VerifyPhoneResponse>> => {
    console.log("API Call: verifyRegistrationIntent", {
      contactInfo,
      authMethod,
    });

    try {
      // Get intent_token, code_verifier, and registration data from store
      const storeState = useAuthStore.getState();
      const intentToken = storeState.verificationToken;
      const codeVerifier = storeState.codeVerifier;
      const registrationData = storeState.registrationData;
      const currentRole = storeState.currentRole;

      if (!intentToken) {
        throw new Error("Intent token not found");
      }

      if (!codeVerifier) {
        throw new Error("Code verifier not found");
      }

      // Check if we need to use FormData (for file uploads)
      const hasFile =
        registrationData?.commercial_register_file instanceof File;

      let requestPayload: any;
      let headers: any = {};

      if (hasFile) {
        // Use FormData for file uploads
        const formData = new FormData();

        // Add verification fields
        formData.append("code", otp);
        formData.append("code_verifier", codeVerifier);

        // Add both email and phone from registration data (same as initial registration)
        if (registrationData?.email) {
          formData.append("email", registrationData.email);
        }
        if (registrationData?.phone) {
          formData.append("phone", registrationData.phone);
        }

        // Add user_type
        if (currentRole) {
          formData.append("user_type", currentRole.toLowerCase());
        }

        // Include all registration data (includes all role-specific fields)
        if (registrationData) {
          Object.entries(registrationData).forEach(([key, value]) => {
            // Skip fields we've already added and skip undefined/null
            if (
              value !== undefined &&
              value !== null &&
              key !== "email" &&
              key !== "phone"
            ) {
              if (value instanceof File) {
                // Handle file upload (commercial_register_file)
                formData.append(key, value);
              } else if (
                typeof value === "string" ||
                typeof value === "number"
              ) {
                // Handle all other fields (name, password, national_id, business_name,
                // commercial_register_number, license_number, engineers_association_number, etc.)
                formData.append(key, String(value));
              }
            }
          });
        }

        requestPayload = formData;
        headers = { "Content-Type": "multipart/form-data" };
      } else {
        // Use JSON for non-file requests
        requestPayload = {
          code: otp,
          code_verifier: codeVerifier,
        };

        // Add both email and phone from registration data (same as initial registration)
        if (registrationData?.email) {
          requestPayload.email = registrationData.email;
        }
        if (registrationData?.phone) {
          requestPayload.phone = registrationData.phone;
        }

        // Add user_type
        if (currentRole) {
          requestPayload.user_type = currentRole.toLowerCase();
        }

        // Include registration data (includes all role-specific fields)
        if (registrationData) {
          Object.entries(registrationData).forEach(([key, value]) => {
            // Skip fields we've already added, skip files, and skip undefined/null
            if (
              value !== undefined &&
              value !== null &&
              !(value instanceof File) &&
              key !== "email" &&
              key !== "phone"
            ) {
              // Ensure country_id is a string
              if (key === "country_id") {
                requestPayload[key] = String(value);
              } else {
                requestPayload[key] = value;
              }
            }
          });
        }
      }

      const response = await api.post(
        `/auth/register-intents/${intentToken}/verify-with-finalize-account`,
        requestPayload,
        hasFile ? { headers } : undefined
      );

      // Check if response includes user data (after successful verification)
      const userData = response.data?.response;

      if (userData) {
        // Store user data and tokens
        const tokens = userData?.extra?.tokens;

        if (tokens && userData) {
          tokenStorage.storeTokens(tokens, userData);
        }

        // Update auth store with user data
        useAuthStore.setState((state) => ({
          ...state,
          user: userData,
          isAuthenticated: true,
          isVerified: true,
          phoneVerificationRequired: false,
          emailVerificationRequired: false,
          tokens: tokens,
        }));
      }

      return {
        success: true,
        data: {
          message: "Verification successful",
          isVerified: true,
          response: userData,
        },
        message: "Verification successful",
      };
    } catch (error: unknown) {
      const err = error as ApiError;
      console.error("Registration intent verification error:", err.message);
      if (err.response?.data) {
        return {
          success: false,
          message: err.response.data.message || "Verification failed",
          errors: err.response.data.errors || {
            general: ["Verification failed"],
          },
        };
      }
      return {
        success: false,
        message: "Verification failed",
        errors: { general: ["Verification failed"] },
      };
    }
  },

  // Resend Registration OTP (New registration flow)
  resendRegistrationOtp: async (): Promise<
    ApiResponse<{ message: string }>
  > => {
    console.log("API Call: resendRegistrationOtp");

    try {
      // Get intent_token from store
      const intentToken = useAuthStore.getState().verificationToken;
      if (!intentToken) {
        throw new Error("Intent token not found");
      }

      const response = await api.post(
        `/auth/register-intents/${intentToken}/send`
      );

      return {
        success: true,
        data: { message: "OTP resent successfully" },
        message: response.data?.message || "OTP resent successfully",
      };
    } catch (error: unknown) {
      const err = error as ApiError;
      console.error("Resend registration OTP error:", err.message);
      if (err.response?.data) {
        return {
          success: false,
          message: err.response.data.message || "Failed to resend OTP",
          errors: err.response.data.errors || {
            general: ["Failed to resend OTP"],
          },
        };
      }
      return {
        success: false,
        message: "Failed to resend OTP",
        errors: { general: ["Failed to resend OTP"] },
      };
    }
  },

  // Verify Phone
  verifyPhone: async (
    data: VerifyPhoneRequest
  ): Promise<ApiResponse<VerifyPhoneResponse>> => {
    console.log("API Call: verifyPhone", data);

    try {
      const requestPayload: any = {
        phone: data.phoneNumber,
        token: data.token,
      };

      // Include registration data if provided
      if (data.registrationData) {
        Object.assign(requestPayload, data.registrationData);
      }

      const response = await api.post(
        "/auth/verification/verify-phone",
        requestPayload
      );

      // Check if response includes user data (after successful verification)
      const userData = response.data?.response;

      if (userData) {
        // Store user data and tokens
        const tokens = userData?.extra?.tokens;

        if (tokens && userData) {
          tokenStorage.storeTokens(tokens, userData);
        }

        // Update auth store with user data
        useAuthStore.setState((state) => ({
          ...state,
          user: userData,
          isAuthenticated: true,
          isVerified: true,
          phoneVerificationRequired: false,
          tokens: tokens,
        }));
      }

      return {
        success: true,
        data: {
          message: "Phone verified successfully",
          isVerified: true,
          response: userData, // Include user data in response
        },
        message: "Phone verification successful",
      };
    } catch (error: unknown) {
      const err = error as ApiError;
      console.error("Phone verification error:", err.message);
      if (err.response?.data) {
        return {
          success: false,
          message: err.response.data.message || "Phone verification failed",
          errors: err.response.data.errors || {
            general: ["Phone verification failed"],
          },
        };
      }
      return {
        success: false,
        message: "Phone verification failed",
        errors: { general: ["Phone verification failed"] },
      };
    }
  },

  // Verify Email
  verifyEmail: async (
    data: VerifyEmailRequest
  ): Promise<ApiResponse<VerifyEmailResponse>> => {
    console.log("API Call: verifyEmail", data);

    try {
      const requestPayload: any = {
        email: data.email,
        token: data.token,
      };

      // Include registration data if provided
      if (data.registrationData) {
        Object.assign(requestPayload, data.registrationData);
      }

      const response = await api.post(
        "/auth/verification/verify-email",
        requestPayload
      );

      // Check if response includes user data (after successful verification)
      const userData = response.data?.response;

      if (userData) {
        // Store user data and tokens
        const tokens = userData?.extra?.tokens;

        if (tokens && userData) {
          tokenStorage.storeTokens(tokens, userData);
        }

        // Update auth store with user data
        useAuthStore.setState((state) => ({
          ...state,
          user: userData,
          isAuthenticated: true,
          isVerified: true,
          emailVerificationRequired: false,
          tokens: tokens,
        }));
      }

      return {
        success: true,
        data: {
          message: "Email verified successfully",
          isVerified: true,
          response: userData, // Include user data in response
        },
        message: "Email verification successful",
      };
    } catch (error: unknown) {
      const err = error as ApiError;
      console.error("Email verification error:", err.message);
      if (err.response?.data) {
        return {
          success: false,
          message: err.response.data.message || "Email verification failed",
          errors: err.response.data.errors || {
            general: ["Email verification failed"],
          },
        };
      }
      return {
        success: false,
        message: "Email verification failed",
        errors: { general: ["Email verification failed"] },
      };
    }
  },

  // Plan Selection

  // Login
  login: async (data: {
    email?: string;
    phoneNumber?: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> => {
    console.log("API Call: login", data);

    try {
      // Fetch CSRF cookie before login
      // await csrfService.fetchCsrfCookie();

      // console.log("🔄 Second handshake: Starting login request");
      const response = await api.post("/auth/login", {
        identifier: data.email || data.phoneNumber,
        password: data.password,
      });

      // Extract user data and tokens from the response
      const userData = response.data?.response;
      const tokens = userData?.extra?.tokens;
      const currentRole = userData?.user_type;
      // Check if phone verification is required and automatically send OTP
      const verificationStatus =
        userData?.account_overview?.verification_status;
      const phoneVerificationRequired =
        verificationStatus?.verification_required &&
        !verificationStatus?.phone_verified;

      if (phoneVerificationRequired && userData?.phone) {
        try {
          // Automatically send phone OTP
          await authApi.sendPhoneOtp(userData.phone);
          console.log("Phone OTP sent automatically for verification");
        } catch (otpError) {
          console.warn("Failed to send automatic phone OTP:", otpError);
          // Don't fail the login if OTP sending fails
        }
      }

      useAuthStore.setState((state) => ({
        ...state,
        user: userData,
        isAuthenticated: true,
        currentRole: currentRole,
        isVerified:
          userData?.account_overview?.verification_status
            ?.verification_required || false,
        emailVerificationRequired:
          userData?.account_overview?.verification_required?.email_verification
            ?.has_token || false,
        phoneVerificationRequired:
          userData?.account_overview?.verification_required?.phone_verification
            ?.has_token || false,
        tokens: tokens,
        isLoading: false,
        error: null,
      }));
      // Persist tokens and user
      if (tokens && userData) {
        tokenStorage.storeTokens(tokens, userData);
      }
      return {
        success: true,
        data: {
          message: "Login successful",
          response: userData,
        },
      };
    } catch (error: unknown) {
      const err = error as ApiError;
      console.error("Login error:", err.message);
      if (err.response?.data) {
        return {
          success: false,
          message: err.response.data.message || "Login failed",
          errors: err.response.data.errors || { general: ["Login failed"] },
        };
      }
      return {
        success: false,
        message: "Login failed",
        errors: { general: ["Login failed"] },
      };
    }
  },

  // Logout
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    console.log("API Call: logout");

    try {
      await api.post("/auth/logout");
      tokenStorage.clearAll();
      const store = useAuthStore.getState();
      if (store.logout) store.logout();

      return {
        success: true,
        data: { message: "Logged out successfully" },
        message: "Logout successful",
      };
    } catch (error: unknown) {
      const err = error as ApiError;
      console.error("Logout error:", err.message);
      // Ensure client-side cleanup even on failure
      tokenStorage.clearAll();
      const store = useAuthStore.getState();
      if (store.logout) store.logout();

      return {
        success: true,
        data: { message: "Logged out successfully" },
        message: "Logout successful",
      };
    }
  },

  // Forgot Password
  forgotPassword: async (data: {
    email?: string;
    phone?: string;
  }): Promise<ApiResponse<ForgotPasswordResponse>> => {
    console.log("API Call: forgotPassword", data);

    try {
      // Fetch CSRF cookie before forgot password request
      // await csrfService.fetchCsrfCookie();

      const response = await api.post(
        "/auth/verification/forgot-password",
        data
      );
      return {
        success: true,
        message: response.data.message,
        data: response.data,
      };
    } catch (error: unknown) {
      const err = error as ApiError;
      console.error("Forgot password error:", err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Forgot password failed",
        errors: err.response?.data?.errors || {
          general: ["Forgot password failed"],
        },
      };
    }
  },
};
