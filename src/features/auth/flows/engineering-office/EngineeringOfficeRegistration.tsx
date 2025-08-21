"use client";

import React from "react";
import { useEngineeringOfficeRegistrationStore } from "@auth/store/engineeringOfficeRegistrationStore";
import { useEngineeringOfficeRegistration } from "@auth/hooks/useEngineeringOfficeRegistration";
import AuthMethodSelection from "../common/AuthMethodSelection";
import EngineeringOfficePersonalInfoForm from "@auth/components/forms/EngineeringOfficePersonalInfoForm";
import EngineeringOfficeTechnicalOperationalInfoForm from "@auth/components/forms/EngineeringOfficeTechnicalOperationalInfoForm";
import EngineeringOfficeDocumentUploadForm from "@auth/components/forms/EngineeringOfficeDocumentUploadForm";
import EngineeringOfficePlanSelectionForm from "@auth/components/forms/EngineeringOfficePlanSelectionForm";
import VerificationStep from "../individual/VerificationStep";
import CompletionStep from "../individual/CompletionStep";

// Wrapper component for engineering office registration verification
const EngineeringOfficeVerificationStep: React.FC = () => {
  const store = useEngineeringOfficeRegistrationStore();
  const hook = useEngineeringOfficeRegistration();
  return <VerificationStep store={store} hook={hook} />;
};

// Wrapper component for engineering office registration completion
const EngineeringOfficeCompletionStep: React.FC = () => {
  const store = useEngineeringOfficeRegistrationStore();
  const hook = useEngineeringOfficeRegistration();
  return <CompletionStep store={store} hook={hook} />;
};

const EngineeringOfficeRegistration: React.FC = () => {
  const store = useEngineeringOfficeRegistrationStore();
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

      case "technicalOperationalInfo":
        return <EngineeringOfficeTechnicalOperationalInfoForm />;

      case "documentUpload":
        return <EngineeringOfficeDocumentUploadForm />;

      case "planSelection":
        return <EngineeringOfficePlanSelectionForm />;

      case "complete":
        return <EngineeringOfficeCompletionStep />;

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

export default EngineeringOfficeRegistration;
