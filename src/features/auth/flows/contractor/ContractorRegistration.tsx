"use client";

import React from "react";
import { useContractorRegistrationStore } from "@auth/store/contractorRegistrationStore";
import { useContractorRegistration } from "@auth/hooks/useContractorRegistration";
import AuthMethodSelection from "../common/AuthMethodSelection";
import ContractorPersonalInfoForm from "@auth/components/forms/ContractorPersonalInfoForm";
import ContractorTechnicalOperationalInfoForm from "@auth/components/forms/ContractorTechnicalOperationalInfoForm";
import ContractorDocumentUploadForm from "@auth/components/forms/ContractorDocumentUploadForm";
import ContractorPlanSelectionForm from "@auth/components/forms/ContractorPlanSelectionForm";
import VerificationStep from "../individual/VerificationStep";
import CompletionStep from "../individual/CompletionStep";

// Wrapper component for contractor registration verification
const ContractorVerificationStep: React.FC = () => {
  const store = useContractorRegistrationStore();
  const hook = useContractorRegistration();
  return <VerificationStep store={store} hook={hook} />;
};

// Wrapper component for contractor registration completion
const ContractorCompletionStep: React.FC = () => {
  const store = useContractorRegistrationStore();
  const hook = useContractorRegistration();
  return <CompletionStep store={store} hook={hook} />;
};

const ContractorRegistration: React.FC = () => {
  const store = useContractorRegistrationStore();
  const { handleAuthMethodSelect } = useContractorRegistration();

  const renderStepContent = () => {
    switch (store.currentStep) {
      case "authMethod":
        return (
          <AuthMethodSelection onAuthMethodSelect={handleAuthMethodSelect} />
        );

      case "personalInfo":
        return <ContractorPersonalInfoForm />;

      case "verification":
        return <ContractorVerificationStep />;

      case "technicalOperationalInfo":
        return <ContractorTechnicalOperationalInfoForm />;

      case "documentUpload":
        return <ContractorDocumentUploadForm />;

      case "planSelection":
        return <ContractorPlanSelectionForm />;

      case "complete":
        return <ContractorCompletionStep />;

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

export default ContractorRegistration;
