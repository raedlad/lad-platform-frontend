"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { OTPInput } from "@auth/components/common/OTPInput";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@auth/store/authStore";
// Generic interface for any registration store
import { PersonalInfo } from "@auth/types/auth";
interface RegistrationStore {
  currentStep: string;
  authMethod: "email" | "phone" | "thirdParty" | null;
  personalInfo: PersonalInfo;
  phoneInfo?: Record<string, unknown>; // Optional for freelance engineer store
  thirdPartyInfo?: Record<string, unknown>; // Optional for freelance engineer store
  isLoading: boolean;
  error: string | null;
}

// Generic interface for any registration hook
interface RegistrationHook {
  handleVerificationSubmit: (
    code: string
  ) => Promise<{ success: boolean; error?: string }>;
  goToPreviousStep?: () => void;
  handleResendCode: () => Promise<{ success: boolean; error?: string }>;
  handleResendEmailVerification?: () => Promise<{
    success: boolean;
    error?: string;
  }>;
}

interface VerificationStepProps {
  store: RegistrationStore;
  hook: RegistrationHook;
}

// Wrapper component that handles dashboard redirect after successful verification
const SignupOTPVerificationStep: React.FC<VerificationStepProps> = (props) => {
  const router = useRouter();
  const currentRole = useAuthStore((s) => s.currentRole);
  const isVerified = useAuthStore((s) => s.isVerified);

  // Only redirect to dashboard when verification is successful
  React.useEffect(() => {
    if (currentRole && isVerified) {
      const roleRoutes: Record<string, string> = {
        contractor: "/dashboard/contractor",
        individual: "/dashboard/individual",
        supplier: "/dashboard/supplier",
        organization: "/dashboard/organization",
        freelanceEngineer: "/dashboard/freelance-engineer",
        engineeringOffice: "/dashboard/engineering-office",
      };

      const dashboardRoute = roleRoutes[currentRole] || "/dashboard";
      router.replace(dashboardRoute);
    }
  }, [currentRole, isVerified, router]);

  return <OTPVerificationStep {...props} />;
};

const OTPVerificationStep: React.FC<VerificationStepProps> = ({
  store,
  hook,
}) => {
  const t = useTranslations("auth.verification");
  const {
    handleVerificationSubmit,
    handleResendCode,
    handleResendEmailVerification,
  } = hook;

  const onVerify = handleVerificationSubmit;
  const onResend = handleResendCode;
  const isLoading = store.isLoading;
  const authMethod = store.authMethod!;
  const storeError = store.error; // Get error from store

  const contactInfo =
    authMethod === "email"
      ? store.personalInfo?.email || store.personalInfo?.organizationEmail
      : authMethod === "phone"
      ? store.personalInfo?.phoneNumber ||
        store.personalInfo?.organizationPhoneNumber ||
        store.personalInfo?.authorizedPersonMobileNumber
      : undefined;
  const [verificationCode, setVerificationCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Clear success message when verification code changes
  useEffect(() => {
    if (verificationCode.length > 0) {
      setSuccessMessage(null);
    }
  }, [verificationCode]);

  const handleVerificationSubmitLocal = async () => {
    if (verificationCode.length !== 6) {
      setError(t("errors.invalidCode"));
      return;
    }

    setError(null);
    setSuccessMessage(null);
    const result = await onVerify(verificationCode);

    if (!result.success) {
      setError(result.error || t("errors.verificationFailed"));
    }
  };

  const handleResendCodeLocal = async () => {
    setResendCooldown(60); // 60 second cooldown
    setError(null);

    const result = await onResend();
    if (!result.success) {
      setError(result.error || t("errors.resendFailed"));
    }
  };

  const handleResendEmailVerificationLocal = async () => {
    if (!handleResendEmailVerification) return;

    setResendCooldown(60); // 60 second cooldown
    setError(null);
    setSuccessMessage(null);

    const result = await handleResendEmailVerification();
    if (!result.success) {
      setError(result.error || "Failed to resend email verification");
    } else {
      // Show success message
      setError(null);
      setSuccessMessage("Email verification link sent successfully!");
    }
  };

  const getContactInfo = () => {
    if (contactInfo) return contactInfo;
    else if (authMethod === "phone") {
      return t("contactInfo.phone");
    } else {
      return t("contactInfo.account");
    }
  };

  const getContactType = () => {
    if (authMethod === "email") {
      return t("contactType.email");
    } else if (authMethod === "phone") {
      return t("contactType.sms");
    } else {
      return t("contactType.account");
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Card className="w-full max-w-md shadow-none border-none bg-transparent">
        <CardHeader className="flex flex-col items-center justify-center">
          <CardTitle className="text-2xl font-bold">{t("title")}</CardTitle>
          <CardDescription className="text-center">
            {t("description", {
              contact: getContactInfo(),
              type: getContactType(),
            })}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 flex justify-center">
            <OTPInput
              value={verificationCode}
              onChange={setVerificationCode}
              length={6}
              disabled={isLoading}
              className="justify-center"
            />
          </div>

          {/* Error Message */}
          {(error || storeError) && (
            <div className="text-sm text-red-600 text-center">
              {error || storeError}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="text-sm text-green-600 text-center">
              {successMessage}
            </div>
          )}

          {/* Verify Button */}
          <Button
            onClick={handleVerificationSubmitLocal}
            className="w-full"
            disabled={isLoading || verificationCode.length !== 6}
          >
            {isLoading ? t("actions.verifying") : t("actions.verify")}
          </Button>

          {/* Resend Options */}
          <div className="text-center space-y-3">
            <p className="text-sm text-muted-foreground mb-2">
              {t("noCodeReceived")}
            </p>

            {/* Resend OTP Code */}
            <Button
              variant="ghost"
              onClick={handleResendCodeLocal}
              disabled={resendCooldown > 0 || isLoading}
              className="text-sm w-full"
            >
              {resendCooldown > 0
                ? t("resendCooldown", { seconds: resendCooldown })
                : authMethod === "email"
                ? t("resendEmailCode")
                : t("resendSMSCode")}
            </Button>

            {/* Resend Email Verification (only show for email auth method) */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerificationStep;

export { SignupOTPVerificationStep };
