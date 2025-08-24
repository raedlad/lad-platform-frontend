"use client";

import React from "react";
import { useAuthStore } from "@auth/store/authStore";
import { useSupplierRegistration } from "./useSupplierRegistration";
import AuthMethodSelection from "@auth/flows/common/AuthMethodSelection";
import OTPVerificationStep from "@auth/flows/common/OTPVerificationStep";
import SupplierPersonalInfoForm from "@auth/components/forms/SupplierPersonalInfoForm";
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

const SupplierVerificationStep: React.FC = () => {
  const { handleVerificationSubmit, handleResendCode, isLoading, error } =
    useSupplierRegistration();
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

const SupplierRegistration: React.FC = () => {
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
        return <SupplierPersonalInfoForm />;
      case "verification":
        return <SupplierVerificationStep />;
      default:
        return <div>Unknown step: {currentStep}</div>;
    }
  };

  return <OnboardingLayout>{renderStepContent()}</OnboardingLayout>;
};

export default SupplierRegistration;
