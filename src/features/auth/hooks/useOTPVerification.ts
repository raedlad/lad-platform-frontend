import { useState } from "react";

export const useOTPVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyOTP = async (email: string, otp: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement actual OTP verification logic
      console.log("OTP verification for:", email, "OTP:", otp);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "OTP verification failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async (email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement actual OTP resend logic
      console.log("Resending OTP to:", email);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to resend OTP";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verifyOTP,
    resendOTP,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};

export default useOTPVerification;
