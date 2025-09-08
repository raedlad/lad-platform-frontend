import { useState } from "react";
import { useRouter } from "next/navigation";

export interface PasswordResetData {
  contact: string;
  type: "email" | "phone";
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface PasswordResetResult {
  success: boolean;
  message?: string;
}

export function usePasswordReset() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const requestReset = async (
    data: PasswordResetData
  ): Promise<PasswordResetResult> => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real app, this would call your API
      // const response = await authApi.requestPasswordReset(data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, always succeed
      console.log(`Password reset requested for ${data.type}:`, data.contact);

      const successMessage =
        data.type === "email"
          ? "Password reset email sent successfully"
          : "Password reset SMS sent successfully";

      return {
        success: true,
        message: successMessage,
      };
    } catch (err) {
      const baseMessage =
        data.type === "email" ? "reset email" : "reset message";
      const errorMessage =
        err instanceof Error ? err.message : `Failed to send ${baseMessage}`;
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (
    data: ResetPasswordData
  ): Promise<PasswordResetResult> => {
    try {
      setIsLoading(true);
      setError(null);

      // In a real app, this would call your API
      // const response = await authApi.resetPassword(data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, always succeed if token exists
      if (!data.token) {
        throw new Error("Invalid or expired reset token");
      }

      console.log("Password reset with token:", data.token);

      return {
        success: true,
        message: "Password reset successful",
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reset password";
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    requestReset,
    resetPassword,
    isLoading,
    error,
    clearError,
  };
}
