"use client";

import { GroupSelectorForm } from "@auth/components/forms";
import { useAuthStore } from "@auth/store/authStore";
import { RegistrationRole } from "@auth/types/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RoleSelectionPage() {
  const router = useRouter();
  const { setGroup, setRole } = useAuthStore();
  
  const [localSelectedGroup, setLocalSelectedGroup] = useState<
    "seeker" | "provider" | null
  >(null);
  const [localSelectedRole, setLocalSelectedRole] =
    useState<RegistrationRole | null>(null);

  const handleGroupSelect = (group: "seeker" | "provider") => {
    setLocalSelectedGroup(group);
    setLocalSelectedRole(null);
  };

  const handleRoleSelect = (role: RegistrationRole) => {
    setLocalSelectedRole(role);
  };

  const handleContinue = () => {
    if (localSelectedGroup && localSelectedRole) {
      setGroup(localSelectedGroup);
      setRole(localSelectedRole);
      router.push("/signup/personal-info");
    }
  };

  return (
    <GroupSelectorForm
      selectedGroup={localSelectedGroup}
      selectedRole={localSelectedRole}
      onSelectGroup={handleGroupSelect}
      onSelectRole={handleRoleSelect}
      onContinue={handleContinue}
    />
  );
}
