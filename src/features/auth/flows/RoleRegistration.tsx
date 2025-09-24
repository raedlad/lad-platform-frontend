"use client";

import React from "react";
import { useAuthStore } from "@auth/store/authStore";
import { useRoleRegistration } from "@auth/flows/useRoleRegistration";
import { OnboardingLayout } from "@auth/components/onboarding/OnboardingLayout";

import AuthMethodSelection from "./common/AuthMethodSelection";
import PersonalInfoStep from "./PersonalInfoStep";
import { SignupOTPVerificationStep } from "./common/OTPVerificationStep";
import { RegistrationStore, RoleSpecificData } from "@auth/types/auth";

const RoleRegistration: React.FC = () => {
  const store = useAuthStore();
  const { handleAuthMethodSelect } = useRoleRegistration();
  const hook = useRoleRegistration();

  const adaptedStore = {
    currentStep: store.currentStep || "",
    authMethod: store.authMethod,
    personalInfo:
      store.roleData.personalInfo ||
      store.roleData.phoneInfo ||
      store.roleData.thirdPartyInfo as RoleSpecificData,
    phoneInfo: store.roleData.phoneInfo,
    thirdPartyInfo: store.roleData.thirdPartyInfo,
    isLoading: store.isLoading,
    error: store.error,
  };

  const renderStepContent = () => {
    switch (store.currentStep) {
      case "authMethod":
        return (
          <AuthMethodSelection onAuthMethodSelect={handleAuthMethodSelect} />
        );
      case "personalInfo":
        return <PersonalInfoStep />;
      case "verification":
        return <SignupOTPVerificationStep store={adaptedStore as RegistrationStore} hook={hook} />;
      default:
        return (
          <AuthMethodSelection onAuthMethodSelect={handleAuthMethodSelect} />
        );
    }
  };

  return (
    <OnboardingLayout>
      <div className="w-full max-w-md">{renderStepContent()}</div>
    </OnboardingLayout>
  );
};

export default RoleRegistration;
