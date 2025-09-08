"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import PasswordResetForm from "@/features/auth/components/forms/PasswordResetForm";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState<{
    contact: string;
    type: "email" | "phone";
  } | null>(null);
  const router = useRouter();
  const t = useTranslations("auth");
  const { handleForgotPassword } = useAuth();

  const handleSubmit = async (data: {
    contact: string;
    type: "email" | "phone";
  }) => {
    setIsLoading(true);
    setError("");
    setIsSuccess(false);
    try {
      const response = await handleForgotPassword(data.contact, data.type);
      if (response.success) {
        setIsSuccess(true);
        setSuccessData(data);
      } else {
        setError(response.message || "Failed to send reset email/message");
      }
    } catch (e: any) {
      setError(e?.message || "Failed to send reset email/message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="screen-center flex justify-center items-center">
      <PasswordResetForm
        onSubmit={handleSubmit}
        isLoading={isLoading}
        isSuccess={isSuccess}
        error={error}
        successData={successData || undefined}
      />
    </div>
  );
}
