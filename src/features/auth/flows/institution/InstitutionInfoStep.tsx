"use client";

import React from "react";
import InstitutionInfoForm from "../../components/forms/InstitutionInfoForm";
import { IndividualUnifiedPersonalInfo } from "@auth/types/individual";

interface PersonalInfoStepProps {
  authMethod: "email" | "phone" | "thirdParty";
  onSubmit: (
    data: IndividualUnifiedPersonalInfo
  ) => Promise<{ success: boolean; error?: string }>;
  onBack: () => void;
  isLoading?: boolean;
  preFilledData?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

const PersonalInfoStep: React.FC<PersonalInfoStepProps> = ({
  authMethod,
  onSubmit,
  onBack,
  isLoading = false,
  preFilledData = {},
}) => {
  return (
    <InstitutionInfoForm
      authMethod={authMethod}
      onSubmit={onSubmit}
      onBack={onBack}
      isLoading={isLoading}
      preFilledData={preFilledData}
    />
  );
};

export default PersonalInfoStep;
