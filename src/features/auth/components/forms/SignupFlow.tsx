"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { RoleSelectorForm } from "@auth/components/forms";
import { useAuthStore } from "@auth/store/authStore";
import { useTranslations } from "next-intl";

// Dynamic imports for each role flow
const IndividualRegistration = dynamic(
  () => import("@auth/flows/individual/IndividualRegistration")
);
const InstitutionRegistration = dynamic(
  () => import("@auth/flows/institution/InstitutionRegistration")
);
const FreelanceEngineerRegistration = dynamic(
  () => import("@auth/flows/freelance-engineer/FreelanceEngineerRegistration")
);
const EngineeringOfficeRegistration = dynamic(
  () => import("@auth/flows/engineering-office/EngineeringOfficeRegistration")
);
const ContractorRegistration = dynamic(
  () => import("@auth/flows/contractor/ContractorRegistration")
);
const SupplierRegistration = dynamic(
  () => import("@auth/flows/supplier/SupplierRegistration")
);

export default function SignUpForm() {
  const { currentRole, setRole, setCurrentStep } = useAuthStore();
  const selectedRole = currentRole;
  const isRoleConfirmed = !!currentRole;
  const t = useTranslations("common");

  const handleContinue = () => {
    if (selectedRole) {
      setRole(selectedRole);
      setCurrentStep("authMethod");
    }
  };

  const renderContent = () => {
    if (!isRoleConfirmed) {
      return (
        <RoleSelectorForm
          selectedRole={selectedRole}
          onSelectRole={setRole}
          onContinue={handleContinue}
        />
      );
    }

    switch (selectedRole) {
      case "individual":
        return <IndividualRegistration />;
      case "institution":
        return <InstitutionRegistration />;
      case "freelanceEngineer":
        return <FreelanceEngineerRegistration />;
      case "engineeringOffice":
        return <EngineeringOfficeRegistration />;
      case "contractor":
        return <ContractorRegistration />;
      case "supplier":
        return <SupplierRegistration />;
      default:
        return (
          <RoleSelectorForm
            selectedRole={null}
            onSelectRole={setRole}
            onContinue={handleContinue}
          />
        );
    }
  };

  return (
    <div className="w-full ">
      <Suspense fallback={<div>{t("loading")}</div>}>
        {renderContent()}
      </Suspense>
    </div>
  );
}
