import { useState } from "react";
import { useRouter } from "next/navigation";

export interface OTPVerificationData {
  code: string;
  identifier: string; // email or phone
  type: "email" | "phone" | "password-reset";
}

export interface OTPVerificationResult {
  success: boolean;
  message?: string;
  token?: string; // For password reset flow
}

export interface ResendOTPData {
  identifier: string;
  type: "email" | "phone" | "password-reset";
}

export function useOTPVerification() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();

  const verifyOTP = async (
    data: OTPVerificationData
  ): Promise<OTPVerificationResult> => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real app, this would call your API
      // const response = await authApi.verifyOTP(data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // For demo purposes, check for specific code
      if (data.code === "123456") {
        console.log("OTP verified for:", data.identifier);

        // For password reset flow, return a token
        if (data.type === "password-reset") {
          return {
            success: true,
            message: "OTP verified successfully",
            token: "demo-reset-token-12345", // In real app, this comes from API
          };
        }

        return {
          success: true,
          message: "OTP verified successfully",
        };
      } else {
        throw new Error("Invalid verification code. Please try again.");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "OTP verification failed";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (
    data: ResendOTPData
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      setError(null);

      // Start cooldown
      setResendCooldown(60);

      // In a real app, this would call your API
      // const response = await authApi.resendOTP(data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("OTP resent to:", data.identifier);

      return {
        success: true,
        message: "Verification code sent successfully",
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to resend OTP";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  // Start cooldown countdown
  const startCooldown = (seconds: number = 60) => {
    setResendCooldown(seconds);

    const countdown = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  };

  const clearError = () => setError(null);

  return {
    verifyOTP,
    resendOTP,
    isLoading,
    error,
    resendCooldown,
    startCooldown,
    clearError,
  };
}
