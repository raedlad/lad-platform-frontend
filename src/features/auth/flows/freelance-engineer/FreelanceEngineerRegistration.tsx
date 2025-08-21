"use client";

import React from "react";
import { useFreelanceEngineerRegistrationStore } from "@auth/store/freelanceEngineerRegistrationStore";
import { useFreelanceEngineerRegistration } from "@auth/hooks/useFreelanceEngineerRegistration";
import AuthMethodSelection from "../common/AuthMethodSelection";
import FreelanceEngineerPersonalInfoForm from "@auth/components/forms/FreelanceEngineerPersonalInfoForm";
import FreelanceEngineerProfessionalInfoForm from "@auth/components/forms/FreelanceEngineerProfessionalInfoForm";
import FreelanceEngineerDocumentUploadForm from "@auth/components/forms/FreelanceEngineerDocumentUploadForm";
import FreelanceEngineerPlanSelectionForm from "@auth/components/forms/FreelanceEngineerPlanSelectionForm";
import VerificationStep from "../individual/VerificationStep";
import CompletionStep from "../individual/CompletionStep";

// Wrapper component for freelance engineer verification
const FreelanceEngineerVerificationStep: React.FC = () => {
  const store = useFreelanceEngineerRegistrationStore();
  const hook = useFreelanceEngineerRegistration();
  return <VerificationStep store={store} hook={hook} />;
};

// Wrapper component for freelance engineer completion
const FreelanceEngineerCompletionStep: React.FC = () => {
  const store = useFreelanceEngineerRegistrationStore();
  const hook = useFreelanceEngineerRegistration();
  return <CompletionStep store={store} hook={hook} />;
};

const FreelanceEngineerRegistration: React.FC = () => {
  const store = useFreelanceEngineerRegistrationStore();
  const { handleAuthMethodSelect } = useFreelanceEngineerRegistration();

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

      case "professionalInfo":
        return <FreelanceEngineerProfessionalInfoForm />;

      case "documentUpload":
        return <FreelanceEngineerDocumentUploadForm />;

      case "planSelection":
        return <FreelanceEngineerPlanSelectionForm />;

      case "complete":
        return <FreelanceEngineerCompletionStep />;

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

export default FreelanceEngineerRegistration;
