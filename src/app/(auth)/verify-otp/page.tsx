"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import OTPVerificationStep from "@/features/auth/flows/common/OTPVerificationStep";
import { tokenStorage } from "@/features/auth/utils/tokenStorage";
import { authApi } from "@/features/auth/services/authApi";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  // Get contact info from URL params or from stored user data
  const contact = searchParams.get("contact") || "";
  const type = (searchParams.get("type") as "email" | "phone") || "email";

  useEffect(() => {
    // If no contact is provided, try to get from stored user data
    if (!contact) {
      const user = tokenStorage.getUser();
      if (user && tokenStorage.isVerificationRequired()) {
        // Check what verification is actually required based on user data
        const verificationStatus = user.account_overview?.verification_status;

        // Determine verification type based on verification status
        let verificationType = "email"; // default fallback
        let userContact = user.email;

        // Check if phone verification is required and not verified
        if (
          verificationStatus?.verification_required === true &&
          verificationStatus?.phone_verified === false
        ) {
          verificationType = "phone";
          userContact = user.phone;
        }
        // Check if email verification is required and not verified
        else if (
          verificationStatus?.verification_required === true &&
          verificationStatus?.email_verified === false
        ) {
          verificationType = "email";
          userContact = user.email;
        }

        if (userContact) {
          // Redirect to the appropriate verification type
          router.replace(
            `/verify-otp?contact=${userContact}&type=${verificationType}`
          );
          return;
        }
      }
      // No contact info available, redirect to login
      router.replace("/login");
    }
  }, [contact, router]);

  const handleVerify = async (code: string) => {
    console.log("Verifying OTP code:", code, "for", type, ":", contact);

    try {
      setIsLoading(true);
      let verificationResult;

      if (type === "phone") {
        // Verify phone OTP
        verificationResult = await authApi.verifyPhone({
          phoneNumber: contact,
          token: code,
        });
      } else {
        // Verify email OTP
        verificationResult = await authApi.verifyEmail({
          email: contact,
          token: code,
        });
      }

      if (verificationResult.success && verificationResult.data?.isVerified) {
        // Determine flow based on presence of user in storage
        const user = tokenStorage.getUser();
        if (user) {
          router.push("/dashboard");
        } else {
          router.push(`/reset-password?token=demo-token-12345`);
        }
      } else {
        throw new Error(verificationResult.message || "Verification failed");
      }
    } catch (error) {
      console.error("Verification error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    console.log(`Resending OTP code to ${type}:`, contact);

    try {
      if (type === "phone") {
        // Use the new sendPhoneOtp API for phone verification
        const result = await authApi.sendPhoneOtp(contact);
        if (result.success) {
          return Promise.resolve();
        } else {
          throw new Error(result.message || "Failed to resend phone OTP");
        }
      } else {
        // Resend email verification
        const result = await authApi.resendEmailVerification({
          email: contact,
        });

        if (result.success) {
          return Promise.resolve();
        } else {
          throw new Error(
            result.message || "Failed to resend verification code"
          );
        }
      }
    } catch (error) {
      console.error("Resend error:", error);
      throw error;
    }
  };

  // Auto-send OTP when visiting the page, based on verification state
  const sentRef = useRef(false);
  useEffect(() => {
    // Require both contact and type to avoid redundant sends during redirects
    if (!contact || !type) return;

    // Skip duplicate invocation in React Strict Mode (dev)
    if (sentRef.current) return;
    sentRef.current = true;

    // Throttle by contact+type for 60s
    const cooldownKey = `otp_sent:${type}:${contact}`;
    const lastSent =
      typeof window !== "undefined"
        ? sessionStorage.getItem(cooldownKey)
        : null;
    if (lastSent && Date.now() - parseInt(lastSent) < 60_000) {
      return;
    }

    const autoSend = async () => {
      const verificationRequired = tokenStorage.isVerificationRequired();
      if (!verificationRequired) return;

      try {
        if (type === "phone") {
          // Only send if no existing phone token flag
          if (!tokenStorage.isPhoneVerificationRequired()) {
            await authApi.sendPhoneOtp(contact);
            tokenStorage.setPhoneVerificationTokenFlag(true);
          }
        } else {
          // Only send if no existing email token flag
          if (!tokenStorage.isEmailVerificationRequired()) {
            const res = await authApi.resendEmailVerification({
              email: contact,
            });
            if (res.success) tokenStorage.setEmailVerificationTokenFlag(true);
          }
        }
        if (typeof window !== "undefined") {
          sessionStorage.setItem(cooldownKey, Date.now().toString());
        }
      } catch (e) {
        // Non-fatal
        console.warn("Auto OTP send failed", e);
      }
    };
    autoSend();
    // run when contact/type available
  }, [contact, type]);

  if (!contact) {
    return null; // Will redirect
  }

  return (
    <div className="screen-center min-h-[calc(100vh-20vh)] flex items-center justify-center">
      <OTPVerificationStep
        store={{
          currentStep: "otp",
          authMethod: type === "phone" ? "phone" : "email",
          personalInfo: { email: contact, phone: contact },
          phoneInfo: type === "phone" ? { phone: contact } : undefined,
          thirdPartyInfo: undefined,
          isLoading: isLoading,
          error: null,
        }}
        hook={{
          handleVerificationSubmit: async (code: string) => {
            await handleVerify(code);
            return { success: true };
          },
          handleResendCode: async () => {
            await handleResend();
            return { success: true };
          },
        }}
      />
    </div>
  );
}
