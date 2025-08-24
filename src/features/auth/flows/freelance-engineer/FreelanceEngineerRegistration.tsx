"use client";

import React from "react";
import { useAuthStore } from "@auth/store/authStore";
import { useFreelanceEngineerRegistration } from "@/features/auth/flows/freelance-engineer/useFreelanceEngineerRegistration";
import AuthMethodSelection from "../common/AuthMethodSelection";
import FreelanceEngineerPersonalInfoForm from "@auth/components/forms/FreelanceEngineerPersonalInfoForm";
import OTPVerificationStep from "../common/OTPVerificationStep";
import { OnboardingLayout } from "../../components/onboarding/OnboardingLayout";
import { useTranslations } from "next-intl";

// Wrapper component for freelance engineer verification
const FreelanceEngineerVerificationStep: React.FC = () => {
  const store = useAuthStore();
  const hook = useFreelanceEngineerRegistration();

  // Adapt the new store structure to the expected interface
  const adaptedStore = {
    currentStep: store.currentStep || "",
    authMethod: store.authMethod,
    personalInfo: store.roleData.personalInfo,
    phoneInfo: store.roleData.phoneInfo,
    thirdPartyInfo: store.roleData.thirdPartyInfo,
    isLoading: store.isLoading,
    error: store.error,
  };

  return <OTPVerificationStep store={adaptedStore} hook={hook} />;
};

// Wrapper component for freelance engineer completion

const FreelanceEngineerRegistration: React.FC = () => {
  const store = useAuthStore();
  const { handleAuthMethodSelect } = useFreelanceEngineerRegistration();
  const t = useTranslations("common");

  const renderStepContent = () => {
    switch (store.currentStep) {
      case "authMethod":
        return (
          <AuthMethodSelection onAuthMethodSelect={handleAuthMethodSelect} />
        );

      case "personalInfo":
        return <FreelanceEngineerPersonalInfoForm />;

      case "verification":
        return <FreelanceEngineerVerificationStep />;

      default:
        return (
          <AuthMethodSelection onAuthMethodSelect={handleAuthMethodSelect} />
        );
    }
  };

  return (
    <OnboardingLayout>
      {store.error && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {store.error}
        </div>
      )}
      {renderStepContent()}
    </OnboardingLayout>
  );
};

export default FreelanceEngineerRegistration;
