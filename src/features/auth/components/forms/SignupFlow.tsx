"use client";

import { useState } from "react";
import { RoleSelectorForm } from "@auth/components/forms";
import { useAuthStore } from "@auth/store/authStore";
import { RegistrationRole } from "@auth/types/auth";
import RoleRegistration from "@auth/flows/RoleRegistration";

export default function SignUpForm() {
  const { currentRole, setRole, setCurrentStep } = useAuthStore();
  const [localSelectedRole, setLocalSelectedRole] =
    useState<RegistrationRole | null>(null);
  const selectedRole = localSelectedRole || currentRole;
  const isRoleConfirmed = !!currentRole;

  const handleRoleSelect = (role: RegistrationRole) => {
    setLocalSelectedRole(role);
  };

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
          onSelectRole={handleRoleSelect}
          onContinue={handleContinue}
        />
      );
    }

    return <RoleRegistration />;
  };

  return (
    <div className="w-full flex items-center justify-center">
      {renderContent()}
    </div>
  );
}
