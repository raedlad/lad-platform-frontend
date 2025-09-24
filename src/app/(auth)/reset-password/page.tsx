"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NewPasswordForm from "@/features/auth/components/forms/NewPasswordForm";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get token from URL params
  const token = searchParams.get("token") || "";

  useEffect(() => {
    // If no token is provided, redirect to forgot password page
    if (!token) {
      router.replace("/forgot-password");
    }
  }, [token, router]);

  const handleSubmit = async (newPassword: string) => {
    try {
      setIsLoading(true);
      setError("");

      // In a real app, this would call your password reset API with the token
      console.log("Resetting password with token:", token);
      console.log("New password:", newPassword);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // For demo purposes, always succeed if token exists
      if (token) {
        setIsSuccess(true);
      } else {
        throw new Error("Invalid or expired reset token");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to reset password. Please try again."
      );
      console.error("Password reset error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return null; // Will redirect
  }

  return (
    <div className="screen-center">
      <NewPasswordForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isSuccess={isSuccess}
        error={error}
        token={token}
      />
    </div>
  );
}

// export default function ResetPasswordPage() {
//   return <div>reset password page</div>;
// }
