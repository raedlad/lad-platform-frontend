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
import {  CheckCircle } from "lucide-react";

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

const OTPVerificationStep: React.FC<VerificationStepProps> = ({
  store,
  hook,
}) => {
  const { handleVerificationSubmit, goToPreviousStep, handleResendCode } = hook;

  const onVerify = handleVerificationSubmit;
  const onResend = handleResendCode;
  const isLoading = store.isLoading;
  const authMethod = store.authMethod!;

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


  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-md shadow-none border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">التحقق من الحساب</CardTitle>
          <CardDescription>
            {authMethod === "thirdParty"
              ? "أكمل التحقق باستخدام الموفر الذي قمت باختياره"
              : `أدخل رمز التحقق المرسل إلى ${getContactInfo()} عبر ${getContactType()}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {authMethod !== "thirdParty" && (
            <>
              {/* Verification Code Input */}
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
                  لم تستلم الرمز؟
                </p>
                <Button
                  variant="ghost"
                  onClick={handleResendCodeLocal}
                  disabled={resendCooldown > 0 || isLoading}
                  className="text-sm"
                >
                  {resendCooldown > 0
                    ? `أعد إرسال الرمز في ${resendCooldown} ثانية`
                    : "أعد إرسال الرمز"}
                </Button>
              </div>
            </>
          )}

          {authMethod === "thirdParty" && (
            <div className="text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-xl font-semibold">تم التحقق بنجاح!</h3>
              <p className="text-muted-foreground">
                تم التحقق من {getContactType()} بنجاح.
              </p>
              <Button
                className="w-full"
                onClick={handleVerificationSubmitLocal}
                disabled={isLoading}
              >
                {isLoading ? "جاري التحقق..." : "استمرار"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPVerificationStep;
