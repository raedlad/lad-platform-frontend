"use client";

import React from "react";
import { useSupplierRegistrationStore } from "@auth/store/supplierRegistrationStore";
import { useSupplierRegistration } from "@auth/hooks/useSupplierRegistration";
import AuthMethodSelection from "../common/AuthMethodSelection";
import SupplierPersonalInfoForm from "@auth/components/forms/SupplierPersonalInfoForm";
import SupplierOperationalCommercialInfoForm from "@auth/components/forms/SupplierOperationalCommercialInfoForm";
import SupplierDocumentUploadForm from "@auth/components/forms/SupplierDocumentUploadForm";
import SupplierPlanSelectionForm from "@auth/components/forms/SupplierPlanSelectionForm";
import VerificationStep from "../individual/VerificationStep";
import CompletionStep from "../individual/CompletionStep";

// Wrapper component for supplier registration verification
const SupplierVerificationStep: React.FC = () => {
  const store = useSupplierRegistrationStore();
  const hook = useSupplierRegistration();
  return <VerificationStep store={store} hook={hook} />;
};

// Wrapper component for supplier registration completion
const SupplierCompletionStep: React.FC = () => {
  const store = useSupplierRegistrationStore();
  const hook = useSupplierRegistration();
  return <CompletionStep store={store} hook={hook} />;
};

const SupplierRegistration: React.FC = () => {
  const store = useSupplierRegistrationStore();
  const { handleAuthMethodSelect } = useSupplierRegistration();

  const renderStepContent = () => {
    switch (store.currentStep) {
      case "authMethod":
        return (
          <AuthMethodSelection onAuthMethodSelect={handleAuthMethodSelect} />
        );

      case "personalInfo":
        return <SupplierPersonalInfoForm />;

      case "verification":
        return <SupplierVerificationStep />;

      case "operationalCommercialInfo":
        return <SupplierOperationalCommercialInfoForm />;

      case "documentUpload":
        return <SupplierDocumentUploadForm />;

      case "planSelection":
        return <SupplierPlanSelectionForm />;

      case "complete":
        return <SupplierCompletionStep />;

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

export default SupplierRegistration;
