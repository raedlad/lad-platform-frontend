"use client";

import React from "react";
import { useAuthStore } from "@auth/store/authStore";
import { useRouter } from "next/navigation";
import { OnboardingLayout } from "@auth/components/onboarding/OnboardingLayout";
import { SignupOTPVerificationStep } from "@auth/flows/common/OTPVerificationStep";
import { useRoleRegistration } from "@auth/flows/useRoleRegistration";
import { RegistrationStore } from "@auth/types/auth";

export default function VerifyPage() {
  const router = useRouter();
  const store = useAuthStore();
  const hook = useRoleRegistration();
  const role = store.currentRole;
  const currentStep = store.currentStep;

  // Redirect if no role selected or not on verification step
  React.useEffect(() => {
    if (!role) {
      router.push("/signup/role");
    } else if (currentStep !== "verification") {
      router.push("/signup/personal-info");
    }
  }, [role, currentStep, router]);


  if (!role || currentStep !== "verification") {
    return null;
  }

  const adaptedStore: RegistrationStore = {
    currentRole: store.currentRole,
    currentStep: store.currentStep || "",
    authMethod: store.authMethod,
    personalInfo: {
      email: store.verificationContact && store.authMethod === "email" ? store.verificationContact : undefined,
      phone: store.verificationContact && store.authMethod === "phone" ? store.verificationContact : undefined,
      phoneNumber: store.verificationContact && store.authMethod === "phone" ? store.verificationContact : undefined,
      ...(store.roleData.personalInfo || {}),
    },
    phoneInfo: store.roleData.phoneInfo,
    thirdPartyInfo: store.roleData.thirdPartyInfo,
    isLoading: store.isLoading,
    error: store.error,
  };

  return (
    <OnboardingLayout>
      <div className="w-full max-w-md">
        <SignupOTPVerificationStep
          store={adaptedStore}
          hook={hook}
        />
      </div>
    </OnboardingLayout>
  );
}
