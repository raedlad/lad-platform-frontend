"use client";

import React from "react";
import { useInstitutionRegistrationStore } from "@auth/store/institutionRegistrationStore";
import { useInstitutionRegistration } from "@auth/hooks";
import AuthMethodSelection from "../common/AuthMethodSelection";
import InstitutionPersonalInfoForm from "@auth/components/forms/InstitutionPersonalInfoForm";
import VerificationStep from "../individual/VerificationStep";
import CompletionStep from "../individual/CompletionStep";

// Wrapper component for institution registration verification
const InstitutionVerificationStep: React.FC = () => {
  const store = useInstitutionRegistrationStore();
  const hook = useInstitutionRegistration();
  return <VerificationStep store={store} hook={hook} />;
};

// Wrapper component for institution registration completion
const InstitutionCompletionStep: React.FC = () => {
  const store = useInstitutionRegistrationStore();
  const hook = useInstitutionRegistration();
  return <CompletionStep store={store} hook={hook} />;
};

const InstitutionRegistration: React.FC = () => {
  const store = useInstitutionRegistrationStore();
  const { handleAuthMethodSelect } = useInstitutionRegistration();

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

      case "complete":
        return <InstitutionCompletionStep />;

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

export default InstitutionRegistration;
