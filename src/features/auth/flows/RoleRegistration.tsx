"use client";

import React from "react";
import { useAuthStore } from "@auth/store/authStore";
import { useRoleRegistration } from "@auth/flows/useRoleRegistration";
import { OnboardingLayout } from "@auth/components/onboarding/OnboardingLayout";
import CombinedRegistrationForm from "../components/forms/CombinedRegistrationForm";
import SocialLoginForm from "../components/forms/SocialLoginForm";
import { SignupOTPVerificationStep } from "./common/OTPVerificationStep";
import { RegistrationStore, RoleSpecificData } from "@auth/types/auth";

const RoleRegistration: React.FC = () => {
  const store = useAuthStore();
  const hook = useRoleRegistration();

  const adaptedStore = {
    currentStep: store.currentStep || "",
    authMethod: store.authMethod,
    personalInfo: {
      email: store.verificationContact && store.authMethod === "email" ? store.verificationContact : undefined,
      phone: store.verificationContact && store.authMethod === "phone" ? store.verificationContact : undefined,
      phoneNumber: store.verificationContact && store.authMethod === "phone" ? store.verificationContact : undefined,
      ...(store.roleData.personalInfo || store.roleData.phoneInfo || {}),
    },
    phoneInfo: store.roleData.phoneInfo,
    thirdPartyInfo: store.roleData.thirdPartyInfo,
    isLoading: store.isLoading,
    error: store.error,
  };

  const renderStepContent = () => {
    switch (store.currentStep) {
      case "personalInfo":
        return <CombinedRegistrationForm role={store.currentRole!} />;
      case "socialLoginForm":
        // This step only appears when user chooses third-party auth
        const provider = store.roleData.thirdPartyInfo?.provider || "google";
        return <SocialLoginForm provider={provider} />;
      case "verification":
        return (
          <SignupOTPVerificationStep
            store={adaptedStore as RegistrationStore}
            hook={hook}
          />
        );
      default:
        return <CombinedRegistrationForm role={store.currentRole!} />;
    }
  };

  return (
    <OnboardingLayout>
      <div className="w-full max-w-md">{renderStepContent()}</div>
    </OnboardingLayout>
  );
};

export default RoleRegistration;
