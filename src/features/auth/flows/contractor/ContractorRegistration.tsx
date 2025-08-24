"use client";

import React from "react";
import { useAuthStore } from "@auth/store/authStore";
import { useContractorRegistration } from "./useContractorRegistration";
import AuthMethodSelection from "@auth/flows/common/AuthMethodSelection";
import OTPVerificationStep from "@auth/flows/common/OTPVerificationStep";
import ContractorPersonalInfoForm from "@auth/components/forms/ContractorPersonalInfoForm";
import { OnboardingLayout } from "../../components/onboarding/OnboardingLayout";

// Adapter to convert unified store to expected RegistrationStore interface
const createStoreAdapter = (store: any) => ({
  currentStep: store.currentStep,
  authMethod: store.authMethod,
  personalInfo: store.roleData.personalInfo || {},
  phoneInfo: store.roleData.phoneInfo,
  thirdPartyInfo: store.roleData.thirdPartyInfo,
  isLoading: store.isLoading,
  error: store.error,
});

const ContractorVerificationStep: React.FC = () => {
  const { handleVerificationSubmit, handleResendCode, isLoading, error } =
    useContractorRegistration();
  const store = useAuthStore();

  return (
    <OTPVerificationStep
      store={createStoreAdapter(store)}
      hook={{
        handleVerificationSubmit,
        handleResendCode,
        goToPreviousStep: () => store.goToPreviousStep(),
      }}
    />
  );
};

const ContractorRegistration: React.FC = () => {
  const store = useAuthStore();
  const { currentStep } = store;

  const renderStepContent = () => {
    switch (currentStep) {
      case "authMethod":
        return (
          <AuthMethodSelection
            onAuthMethodSelect={(method: "email" | "phone" | "thirdParty") => {
              store.setAuthMethod(method);
              store.goToNextStep();
            }}
          />
        );
      case "personalInfo":
        return <ContractorPersonalInfoForm />;
      case "verification":
        return <ContractorVerificationStep />;
      default:
        return <div>Unknown step: {currentStep}</div>;
    }
  };

  return <OnboardingLayout>{renderStepContent()}</OnboardingLayout>;
};

export default ContractorRegistration;
