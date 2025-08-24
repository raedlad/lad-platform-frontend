"use client";

import React from "react";
import { useAuthStore } from "@auth/store/authStore";
import { useInstitutionRegistration } from "@auth/flows/institution/useInstitutionRegistration";
import AuthMethodSelection from "../common/AuthMethodSelection";
import InstitutionPersonalInfoForm from "@auth/components/forms/InstitutionPersonalInfoForm";
import OTPVerificationStep from "../common/OTPVerificationStep";
import { OnboardingLayout } from "../../components/onboarding/OnboardingLayout";
import { useTranslations } from "next-intl";

// Wrapper component for institution registration verification
const InstitutionVerificationStep: React.FC = () => {
  const store = useAuthStore();
  const hook = useInstitutionRegistration();

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

const InstitutionRegistration: React.FC = () => {
  const store = useAuthStore();
  const { handleAuthMethodSelect } = useInstitutionRegistration();
  const t = useTranslations("common");

  const renderStepContent = () => {
    switch (store.currentStep) {
      case "authMethod":
        return (
          <AuthMethodSelection onAuthMethodSelect={handleAuthMethodSelect} />
        );
      case "personalInfo":
        return <InstitutionPersonalInfoForm />;

      case "verification":
        return <InstitutionVerificationStep />;

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

export default InstitutionRegistration;
