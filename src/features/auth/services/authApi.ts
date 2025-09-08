import {
  ApiResponse,
  AuthResponse,
  RegistrationRequest,
  RegistrationResponse,
  IndividualRegistrationApiData,
  VerifyPhoneRequest,
  VerifyPhoneResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
  ResendEmailVerificationRequest,
  ResendEmailVerificationResponse,
  ForgotPasswordResponse,
  ForgotPasswordRequest,
} from "./authApiTypes";

import { api } from "@/lib/api";
import { useAuthStore } from "@auth/store/authStore";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import { useDocumentsStore } from "@/features/profile/store/documentStore";
import { documentsService } from "@/features/profile/services/documentApi";

// Helper function for simulating API calls
const simulateApiCall = <T>(
  data: T,
  success: boolean,
  message: string,
  delay = 1000
): Promise<ApiResponse<T>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (success) {
        resolve({ success: true, data, message });
      } else {
        resolve({ success: false, message, errors: { general: [message] } });
      }
    }, delay);
  });
};

// Common function to handle file uploads with FormData
const createFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();
  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      const value = data[key];
      if (value instanceof File) {
        formData.append(key, value, value.name);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item instanceof File) {
            formData.append(`${key}[${index}]`, item, item.name);
          } else {
            formData.append(`${key}[${index}]`, item);
          }
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    }
  }
  return formData;
};

// --- Authentication API Service ---

export const authApi = {
  // Refresh access token using refresh token
  refreshTokens: async (): Promise<ApiResponse<{ tokens: any }>> => {
    try {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken || tokenStorage.isRefreshTokenExpired()) {
        throw new Error("Refresh token missing or expired");
      }

      // Adjust endpoint/body to match your backend
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
          tokenStorage.storeTokens(tokens, currentUser as any);
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
        data: { tokens },
        message: "Token refreshed",
      };
    } catch (error: any) {
      console.error("Token refresh error:", error);
      // On failure, clear auth state
      try {
        tokenStorage.clearAll();
        const store = useAuthStore.getState();
        if (store.logout) store.logout();
      } catch {}
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          error?.message ||
          "Token refresh failed",
        errors: error?.response?.data?.errors,
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
      // Adjust endpoint/body to match your backend
      const response = await api.post(`/auth/social/${provider}`, {
        access_token: accessToken,
      });

      const userData = (response.data as any)?.response;
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
    } catch (error: any) {
      console.error("Social login error:", error);
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || "Social login failed",
          errors: error.response.data.errors || {
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
    data: RegistrationRequest<IndividualRegistrationApiData>,
    role: string
  ): Promise<ApiResponse<RegistrationResponse>> => {
    console.log("API Call: registerIndividual", data);

    try {
      // Transform the data to match backend expectations
      const transformedData = {
        name: `${data.data.firstName} ${data.data.lastName}`,
        email: data.data.email,
        password: data.data.password,
        password_confirmation: data.data.password, // Assuming confirmPassword is the same
        user_type: role.toLowerCase(),
        phone: data.data.phoneNumber,
        national_id: data.data.nationalId || "",
      };

      console.log("Transformed data being sent to API:", transformedData);

      const response = await api.post("/auth/register", transformedData);
      console.log("API Response:", response.data);

      // Extract user data and tokens from the new response structure
      const userData = response.data?.response;
      const tokens = userData?.extra?.tokens;

      return {
        success: true,
        data: {
          message:
            response.data?.message || "Individual registered successfully",
          response: {
            id: userData?.id,
            name: userData?.name,
            email: userData?.email,
            phone: userData?.phone,
            user_type: userData?.user_type,
            account_overview: {
              verification_status:
                userData?.account_overview?.verification_status,
              verification_required:
                userData?.account_overview?.verification_required,
            },
            extra: {
              tokens: tokens,
            },
          },
        },
        message: response.data?.message || "Registration successful",
      };
    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle axios error response
      if (error.response?.data) {
        const backendError = error.response.data;
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
      if (error.message) {
        return {
          success: false,
          message: error.message,
          errors: { general: [error.message] },
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
        phoneNumber: phoneNumber,
      });

      return {
        success: true,
        data: { message: "Phone OTP sent successfully" },
        message: "Phone OTP sent",
      };
    } catch (error: any) {
      console.error("Send phone OTP error:", error);
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || "Failed to send phone OTP",
          errors: error.response.data.errors || {
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
    } catch (error: any) {
      console.error("Resend email verification error:", error);
      if (error.response?.data) {
        return {
          success: false,
          message:
            error.response.data.message ||
            "Failed to resend email verification",
          errors: error.response.data.errors || {
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

  // Verify Phone
  verifyPhone: async (
    data: VerifyPhoneRequest
  ): Promise<ApiResponse<VerifyPhoneResponse>> => {
    console.log("API Call: verifyPhone", data);

    try {
      const response = await api.post("/auth/verification/verify-phone", {
        phoneNumber: data.phoneNumber,
        token: data.token,
      });

      // Update local storage and auth store on success
      const currentUser = tokenStorage.getUser();
      if (currentUser) {
        const emailVerified =
          currentUser?.account_overview?.verification_status?.email_verified ===
          true;

        const updatedUser = {
          ...currentUser,
          phone_verified_at: new Date().toISOString(),
          account_overview: {
            ...currentUser.account_overview,
            verification_status: {
              ...currentUser.account_overview?.verification_status,
              phone_verified: true,
              verification_required: !emailVerified ? true : false,
            },
            verification_required: {
              ...currentUser.account_overview?.verification_required,
              phone_verification: {
                ...(currentUser.account_overview?.verification_required
                  ?.phone_verification || { token_type: "" }),
                has_token: false,
              },
            },
          },
        } as any;

        // Persist updated user
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        // Update flags
        tokenStorage.setPhoneVerificationTokenFlag(false);
        tokenStorage.setVerificationRequired(!emailVerified ? true : false);

        // Update store
        useAuthStore.setState((state) => ({
          ...state,
          user: updatedUser,
          isVerified: emailVerified, // if email was verified, this completes verification
          phoneVerificationRequired: false,
        }));
      }

      return {
        success: true,
        data: {
          message: "Phone verified successfully",
          isVerified: true,
        },
        message: "Phone verification successful",
      };
    } catch (error: any) {
      console.error("Phone verification error:", error);
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || "Phone verification failed",
          errors: error.response.data.errors || {
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
      const response = await api.post("/auth/verification/verify-email", {
        email: data.email,
        token: data.token,
      });

      // Update local storage and auth store on success
      const currentUser = tokenStorage.getUser();
      if (currentUser) {
        const emailVerified =
          currentUser?.account_overview?.verification_status?.phone_verified ===
          true;

        const updatedUser = {
          ...currentUser,
          email_verified_at: new Date().toISOString(),
          account_overview: {
            ...currentUser.account_overview,
            verification_status: {
              ...currentUser.account_overview?.verification_status,
              email_verified: true,
              verification_required: !emailVerified ? true : false,
            },
            verification_required: {
              ...currentUser.account_overview?.verification_required,
              email_verification: {
                ...(currentUser.account_overview?.verification_required
                  ?.email_verification || { token_type: "" }),
                has_token: false,
              },
            },
          },
        } as any;

        // Persist updated user
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }

        // Update flags
        tokenStorage.setEmailVerificationTokenFlag(false);
        tokenStorage.setVerificationRequired(!emailVerified ? true : false);

        // Update store
        useAuthStore.setState((state) => ({
          ...state,
          user: updatedUser,
          isVerified: emailVerified, // if email was verified, this completes verification
          emailVerificationRequired: false,
        }));
      }

      return {
        success: true,
        data: {
          message: "Email verified successfully",
          isVerified: true,
        },
        message: "Email verification successful",
      };
    } catch (error: any) {
      console.error("Email verification error:", error);
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || "Email verification failed",
          errors: error.response.data.errors || {
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
      const response = await api.post("/auth/login", {
        identifier: data.email || data.phoneNumber,
        password: data.password,
      });

      // Extract user data and tokens from the response
      const userData = response.data?.response;
      const tokens = userData?.extra?.tokens;
      const currentRole = userData?.user_type
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
    } catch (error: any) {
      console.error("Login error:", error);
      if (error.response?.data) {
        return {
          success: false,
          message: error.response.data.message || "Login failed",
          errors: error.response.data.errors || { general: ["Login failed"] },
        };
      }
      return {
        success: false,
        message: "Login failed",
        errors: { general: ["Login failed"] },
      };
    }
  },

  // Fetch and hydrate profile after auth (documents + personal info)
  hydrateProfileFromBackend: async (role: string) => {
    try {
      const res = await api.get(`/${role}/profile`);
      const payload = res.data?.response || res.data;
      if (!payload) return;

      // Personal info: payload.user
      const user = payload.user;
      if (user) {
        useAuthStore.setState((state) => ({
          ...state,
          user: { ...(state as any).user, ...user },
        }));
      }

      // Documents: payload.document_types + payload.documents
      const types = payload.document_types || [];
      const docs = payload.documents || [];
      const mapped = documentsService.mapBackendDocuments(types, docs);
      const documentsStore = useDocumentsStore.getState();
      documentsStore.setRoleDocuments(role.toUpperCase(), mapped);
    } catch (e) {
      // Non-fatal
      console.warn("Failed to hydrate profile", e);
    }
  },

  // Logout
  logout: async (): Promise<ApiResponse<{ message: string }>> => {
    console.log("API Call: logout");

    try {
      const response = await api.post("/auth/logout");

      // Clear local storage and reset auth store regardless of API response
      tokenStorage.clearAll();
      const store = useAuthStore.getState();
      if (store.logout) store.logout();

      return {
        success: true,
        data: { message: "Logged out successfully" },
        message: "Logout successful",
      };
    } catch (error: any) {
      console.error("Logout error:", error);
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
      const response = await api.post(
        "/auth/verification/forgot-password",
        data
      );
      return {
        success: true,
        message: response.data.message,
        data: response.data,
      };
    } catch (error: any) {
      console.error("Forgot password error:", error);
      return {
        success: false,
        message: error.response.data.message || "Forgot password failed",
        errors: error.response.data.errors || {
          general: ["Forgot password failed"],
        },
      };
    }
  },
};
