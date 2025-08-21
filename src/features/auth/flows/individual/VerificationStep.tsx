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
import { ArrowLeft, CheckCircle } from "lucide-react";

// Generic interface for any registration store
interface RegistrationStore {
  currentStep: string;
  authMethod: "email" | "phone" | "thirdParty" | null;
  personalInfo: any;
  phoneInfo?: any; // Optional for freelance engineer store
  thirdPartyInfo?: any; // Optional for freelance engineer store
  isLoading: boolean;
  error: string | null;
}

// Generic interface for any registration hook
interface RegistrationHook {
  handleVerificationSubmit: (
    code: string
  ) => Promise<{ success: boolean; error?: string }>;
  goToPreviousStep: () => void;
  handleResendCode: () => Promise<{ success: boolean; error?: string }>;
}

interface VerificationStepProps {
  store: RegistrationStore;
  hook: RegistrationHook;
}

const VerificationStep: React.FC<VerificationStepProps> = ({ store, hook }) => {
  const { handleVerificationSubmit, goToPreviousStep, handleResendCode } = hook;

  const onVerify = handleVerificationSubmit;
  const onBack = goToPreviousStep;
  const onResend = handleResendCode;
  const isLoading = store.isLoading;
  const authMethod = store.authMethod!;

  // Get contact info from store - handle individual, institution, and contractor stores
  const contactInfo =
    authMethod === "email"
      ? store.personalInfo?.email || store.personalInfo?.institutionEmail
      : authMethod === "phone"
      ? store.personalInfo?.phoneNumber ||
        store.personalInfo?.institutionPhoneNumber ||
        store.personalInfo?.authorizedPersonMobileNumber
      : undefined;
  const [verificationCode, setVerificationCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerificationSubmitLocal = async () => {
    if (verificationCode.length !== 6) {
      setError("Please enter a 6-digit verification code");
      return;
    }

    setError(null);
    const result = await onVerify(verificationCode);

    if (!result.success) {
      setError(result.error || "Verification failed");
      setVerificationCode("");
    }
  };

  const handleResendCodeLocal = async () => {
    setResendCooldown(60); // 60 second cooldown
    setError(null);

    const result = await onResend();
    if (!result.success) {
      setError(result.error || "Failed to resend code");
    }
  };

  const getContactInfo = () => {
    if (contactInfo) return contactInfo;

    switch (authMethod) {
      case "email":
        return "your email";
      case "phone":
        return "your phone number";
      case "thirdParty":
        return "your account";
      default:
        return "your account";
    }
  };

  const getContactType = () => {
    switch (authMethod) {
      case "email":
        return "email";
      case "phone":
        return "SMS";
      case "thirdParty":
        return "account";
      default:
        return "account";
    }
  };

  const getStepNumber = () => {
    switch (authMethod) {
      case "phone":
        return "Step 2 of 3";
      default:
        return "Step 3 of 4";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-1"
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm text-muted-foreground">
              {getStepNumber()}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Verify Your Account
          </CardTitle>
          <CardDescription>
            {authMethod === "thirdParty"
              ? "Complete verification with your selected provider"
              : `Enter the verification code sent to ${getContactInfo()} via ${getContactType()}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {authMethod !== "thirdParty" && (
            <>
              {/* Verification Code Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Verification Code</label>
                <OTPInput
                  value={verificationCode}
                  onChange={setVerificationCode}
                  length={6}
                  disabled={isLoading}
                  className="justify-center"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-sm text-red-600 text-center">{error}</div>
              )}

              {/* Verify Button */}
              <Button
                onClick={handleVerificationSubmitLocal}
                className="w-full"
                disabled={isLoading || verificationCode.length !== 6}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>

              {/* Resend Code */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  variant="ghost"
                  onClick={handleResendCodeLocal}
                  disabled={resendCooldown > 0 || isLoading}
                  className="text-sm"
                >
                  {resendCooldown > 0
                    ? `Resend code in ${resendCooldown}s`
                    : "Resend code"}
                </Button>
              </div>

              {/* Help Text */}
              <div className="text-xs text-center text-muted-foreground">
                For demo purposes, use any 6-digit code
              </div>
            </>
          )}

          {authMethod === "thirdParty" && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-xl font-semibold">Verification Complete!</h3>
              <p className="text-muted-foreground">
                Your {getContactType()} has been verified successfully.
              </p>
              <Button
                className="w-full"
                onClick={handleVerificationSubmitLocal}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Continue"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationStep;
