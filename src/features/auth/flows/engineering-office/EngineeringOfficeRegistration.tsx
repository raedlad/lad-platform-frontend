"use client";

import React from "react";
import { useAuthStore } from "@auth/store/authStore";
import { useEngineeringOfficeRegistration } from "@/features/auth/flows/engineering-office/useEngineeringOfficeRegistration";
import AuthMethodSelection from "../common/AuthMethodSelection";
import EngineeringOfficePersonalInfoForm from "@auth/components/forms/EngineeringOfficePersonalInfoForm";
import OTPVerificationStep from "../common/OTPVerificationStep";
import { OnboardingLayout } from "../../components/onboarding/OnboardingLayout";

// Wrapper component for engineering office verification
const EngineeringOfficeVerificationStep: React.FC = () => {
  const store = useAuthStore();
  const hook = useEngineeringOfficeRegistration();

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

// Wrapper component for engineering office completion

const EngineeringOfficeRegistration: React.FC = () => {
  const store = useAuthStore();
  const { handleAuthMethodSelect } = useEngineeringOfficeRegistration();

  const renderStepContent = () => {
    switch (store.currentStep) {
      case "authMethod":
        return (
          <AuthMethodSelection onAuthMethodSelect={handleAuthMethodSelect} />
        );

      case "personalInfo":
        return <EngineeringOfficePersonalInfoForm />;

      case "verification":
        return <EngineeringOfficeVerificationStep />;

      default:
        return (
          <AuthMethodSelection onAuthMethodSelect={handleAuthMethodSelect} />
        );
    }
  };

  return (
    <OnboardingLayout >
      {store.error && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {store.error}
        </div>
      )}
      {renderStepContent()}
    </OnboardingLayout>
  );
};

export default EngineeringOfficeRegistration;
