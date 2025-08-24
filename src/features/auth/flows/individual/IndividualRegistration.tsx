"use client";

import React from "react";
import { useAuthStore } from "@auth/store/authStore";
import { useIndividualRegistration } from "@auth/flows/individual/useIndividualRegistration";
import { OnboardingLayout } from "@auth/components/onboarding/OnboardingLayout";
import { useTranslations } from "next-intl";

import AuthMethodSelection from "../common/AuthMethodSelection";
import PersonalInfoStep from "./PersonalInfoStep";
import OTPVerificationStep from "../common/OTPVerificationStep";

// Wrapper for OTP verification
const IndividualVerificationStep: React.FC = () => {
  const store = useAuthStore();
  const hook = useIndividualRegistration();

  const adaptedStore = {
    currentStep: store.currentStep || "",
    authMethod: store.authMethod,
    personalInfo:
      store.roleData.personalInfo ||
      store.roleData.phoneInfo ||
      store.roleData.thirdPartyInfo,
    phoneInfo: store.roleData.phoneInfo,
    thirdPartyInfo: store.roleData.thirdPartyInfo,
    isLoading: store.isLoading,
    error: store.error,
  };

  return <OTPVerificationStep store={adaptedStore} hook={hook} />;
};

const IndividualRegistration: React.FC = () => {
  const store = useAuthStore();
  const { handleAuthMethodSelect } = useIndividualRegistration();
  const t = useTranslations("common");

  const renderStepContent = () => {
    switch (store.currentStep) {
      case "authMethod":
        return (
          <AuthMethodSelection onAuthMethodSelect={handleAuthMethodSelect} />
        );
      case "personalInfo":
        return <PersonalInfoStep />;
      case "verification":
        return <IndividualVerificationStep />;
      default:
        return (
          <AuthMethodSelection onAuthMethodSelect={handleAuthMethodSelect} />
        );
    }
  };

  return (
    <OnboardingLayout>
      <div className="w-full max-w-md">{renderStepContent()}</div>
      {store.error && <div className="">{store.error}</div>}
    </OnboardingLayout>
  );
};

export default IndividualRegistration;
