"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { GroupSelectorForm } from "@auth/components/forms";
import { useAuthStore } from "@auth/store/authStore";
import { RegistrationRole } from "@auth/types/auth";
import RoleRegistration from "@auth/flows/RoleRegistration";

export default function SignUpForm() {
  const searchParams = useSearchParams();
  const { currentGroup, currentRole, setGroup, setRole, setCurrentStep } =
    useAuthStore();

  // Local state for form interactions
  const [localSelectedGroup, setLocalSelectedGroup] = useState<
    "seeker" | "provider" | null
  >(null);
  const [localSelectedRole, setLocalSelectedRole] =
    useState<RegistrationRole | null>(null);

  // Use URL params or store state
  const selectedGroup = localSelectedGroup || currentGroup;
  const selectedRole = localSelectedRole || currentRole;

  // Check if we should proceed to registration
  const isRoleConfirmed = !!currentRole;

  // Check if we have a group and type from URL params
  const urlGroup = searchParams.get("group") as "seeker" | "provider" | null;
  const urlType = searchParams.get("type") as RegistrationRole | null;

  useEffect(() => {
    // If both group and type are provided from URL, skip directly to role confirmation
    if (urlGroup && urlType && !currentGroup && !currentRole) {
      setGroup(urlGroup);
      setRole(urlType);
      setCurrentStep("authMethod");
      return;
    }

    // Set group from URL params if available
    if (urlGroup && !currentGroup) {
      setLocalSelectedGroup(urlGroup);
    }

    // Set role from URL params if available
    if (urlType && !currentRole) {
      setLocalSelectedRole(urlType);
    }
  }, [
    urlGroup,
    urlType,
    currentGroup,
    currentRole,
    setGroup,
    setRole,
    setCurrentStep,
  ]);

  useEffect(() => {
    if (currentRole) {
      console.log("Current role:", currentRole);
    }
  }, [currentRole]);

  const handleGroupSelect = (group: "seeker" | "provider") => {
    setLocalSelectedGroup(group);
    // Clear role selection when group changes
    setLocalSelectedRole(null);
  };

  const handleRoleSelect = (role: RegistrationRole) => {
    setLocalSelectedRole(role);
  };

  const handleGroupContinue = () => {
    if (selectedGroup) {
      setGroup(selectedGroup);
    }
  };

  const handleRoleContinue = () => {
    if (selectedRole) {
      setRole(selectedRole);
      setCurrentStep("authMethod");
    }
  };

  const renderContent = () => {
    // If both group and role are provided from URL, skip directly to registration
    if (urlGroup && urlType && !currentGroup && !currentRole) {
      return <RoleRegistration />;
    }

    // If role is confirmed, proceed to registration
    if (isRoleConfirmed) {
      return <RoleRegistration />;
    }

    // Show group and role selection form
    return (
      <GroupSelectorForm
        selectedGroup={selectedGroup}
        selectedRole={selectedRole}
        onSelectGroup={handleGroupSelect}
        onSelectRole={handleRoleSelect}
        onContinue={selectedGroup ? handleRoleContinue : handleGroupContinue}
      />
    );
  };

  return (
    <div className="w-full flex items-center justify-center">
      {renderContent()}
    </div>
  );
}
