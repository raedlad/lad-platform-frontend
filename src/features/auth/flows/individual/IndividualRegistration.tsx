"use client";

import React from "react";
import { useIndividualRegistrationStore } from "@auth/store/individualRegistrationStore";
import { useIndividualRegistration } from "@/features/auth/hooks/useIndividualRegistration";
import AuthMethodSelection from "../common/AuthMethodSelection";
import PersonalInfoStep from "./PersonalInfoStep";
import VerificationStep from "./VerificationStep";
import CompletionStep from "./CompletionStep";

// Wrapper component for individual registration verification
const IndividualVerificationStep: React.FC = () => {
  const store = useIndividualRegistrationStore();
  const hook = useIndividualRegistration();
  return <VerificationStep store={store} hook={hook} />;
};

// Wrapper component for individual registration completion
const IndividualCompletionStep: React.FC = () => {
  const store = useIndividualRegistrationStore();
  const hook = useIndividualRegistration();
  return <CompletionStep store={store} hook={hook} />;
};

const IndividualRegistration: React.FC = () => {
  const store = useIndividualRegistrationStore();
  const { handleAuthMethodSelect } = useIndividualRegistration();

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

      case "complete":
        return <IndividualCompletionStep />;

      default:
        return (
          <AuthMethodSelection onAuthMethodSelect={handleAuthMethodSelect} />
        );
    }
  };

  return (
    <div className="w-full">
      {store.error && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {store.error}
        </div>
      )}
      {renderStepContent()}
    </div>
  );
};

export default IndividualRegistration;
