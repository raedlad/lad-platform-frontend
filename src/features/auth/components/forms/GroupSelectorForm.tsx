"use client";

import {
  Building2,
  Briefcase,
  User,
  Search,
  UserCheck,
  Wrench,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { useTranslations } from "next-intl";
import { RegistrationRole, UserRoleOption } from "@auth/types/auth";
import GroupRightCard from "../common/GroupRightCard";

const serviceSeekerRoles = [
  {
    id: "individual" as RegistrationRole,
    icon: <User className="icon-md" />,
    comingSoon: false,
  },
  {
    id: "organization" as RegistrationRole,
    icon: <Building2 className="icon-md" />,
    comingSoon: false,
  },
  {
    id: "government-agency" as string, // This is not a RegistrationRole
    icon: <Briefcase className="icon-md" />,
    comingSoon: true,
  },
];

const serviceProviderRoles = [
  {
    id: "freelance_engineer" as RegistrationRole,
    icon: <User className="icon-md" />,
    comingSoon: false,
    name: "Freelance Engineer",
  },
  {
    id: "engineering_office" as RegistrationRole,
    icon: <Building2 className="icon-md" />,
    comingSoon: false,
  },
  {
    id: "contractor" as RegistrationRole,
    icon: <Briefcase className="icon-md" />,
    comingSoon: false,
  },
  {
    id: "supplier" as RegistrationRole,
    icon: <Search className="icon-md" />,
    comingSoon: false,
  },
];

// 1. Define the props the component will receive from its parent
interface GroupSelectorFormProps {
  selectedGroup: "seeker" | "provider" | null;
  selectedRole: RegistrationRole | null;
  onSelectGroup: (groupId: "seeker" | "provider") => void;
  onSelectRole: (roleId: RegistrationRole) => void;
  onContinue: () => void;
}

// 2. Accept the props
const GroupSelectorForm = ({
  selectedGroup,
  selectedRole,
  onSelectGroup,
  onSelectRole,
  onContinue,
}: GroupSelectorFormProps) => {
  const t = useTranslations("auth");
  const commonT = useTranslations("common");

  const handleGroupSelect = (groupId: "seeker" | "provider") => {
    onSelectGroup(groupId);
  };

  const handleRoleSelect = (roleId: string) => {
    onSelectRole(roleId as RegistrationRole);
  };

  const handleContinue = () => {
    if (selectedRole) {
      onContinue();
    }
  };

  const getButtonText = () => {
    if (!selectedRole) return t("continue");
    return t(`roleSelector.${selectedRole}ButtonText`);
  };

  // Filter roles based on selected group
  const getFilteredRoles = () => {
    if (selectedGroup === "seeker") {
      return serviceSeekerRoles;
    } else if (selectedGroup === "provider") {
      return serviceProviderRoles;
    }
    return [];
  };

  const renderUserRoleCard = (role: UserRoleOption) => {
    const isSelected = selectedRole === role.id;
    const isDisabled = role.comingSoon;
    const hasTranslation = role.id !== "government-agency";

    return (
      <div
        key={role.id}
        className={twMerge(
          "card-role-selector transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-lg dark:hover:shadow-xl/20",
          selectedRole === role.id && !isDisabled
            ? "card-role-selector-selected scale-[1.02] shadow-lg dark:shadow-xl/20"
            : isDisabled
            ? "card-role-selector-disabled"
            : "card-role-selector-hover"
        )}
        onClick={() => !isDisabled && handleRoleSelect(role.id)}
      >
        <div className="role-card-content">
          <div className="role-card-info">
            <div
              className={twMerge(
                "role-card-icon transition-all duration-200 ease-in-out",
                selectedRole === role.id && !isDisabled
                  ? "role-card-icon-selected"
                  : ""
              )}
            >
              {role.icon}
            </div>
            <div className="role-card-details">
              <div className="role-card-header">
                <h4 className="role-card-title">
                  {hasTranslation
                    ? t(`roleSelector.${role.id}Title`)
                    : "Government Agency"}
                </h4>
                {isDisabled && (
                  <span className="badge-coming-soon">
                    {commonT("ui.comingSoon")}
                  </span>
                )}
              </div>
              <p
                className={twMerge(
                  "role-card-description transition-colors duration-200 ease-in-out",
                  isSelected && !isDisabled
                    ? "role-card-description-selected"
                    : ""
                )}
              >
                {hasTranslation
                  ? t(`roleSelector.${role.id}Description`)
                  : "For government agencies looking for services"}
              </p>
            </div>
          </div>
          <div className="role-card-radio-container">
            <div
              className={twMerge(
                "role-card-radio transition-all duration-200 ease-in-out",
                isSelected && !isDisabled
                  ? "role-card-radio-selected"
                  : "role-card-radio-unselected"
              )}
            >
              {isSelected && !isDisabled && (
                <div className="role-card-radio-dot animate-in zoom-in-50 duration-200">
                  <div className="role-card-radio-dot-inner"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-[calc(100vh-100px)] w-full grid grid-cols-1 lg:grid-cols-12 gap-0 items-center">
      <div className="w-full h-full hidden lg:flex lg:col-span-4">
        <GroupRightCard />
      </div>
      <div className="container-centered lg:col-span-8">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2 className="heading-section lg:hidden">
              {t("roleSelection.title")}
            </h2>
            <p className="text-description lg:hidden">
              {t("roleSelection.description")}
            </p>
          </div>

          <div className="auth-form-content">
            {/* Group Selection */}
            <div className="form-field-group">
              <h3 className="heading-subsection">
                {t("groupSelector.selectGroup")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div
                  className={twMerge(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-md dark:hover:shadow-lg/20",
                    selectedGroup === "seeker"
                      ? "border-design-main bg-design-main/5 scale-[1.02] shadow-md dark:bg-design-main/10 dark:shadow-lg/20"
                      : "border-gray-200 hover:border-design-main/50 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:border-design-main/50"
                  )}
                  onClick={() => handleGroupSelect("seeker")}
                >
                  <div className="flex items-center gap-3">
                    <UserCheck className="size-6 text-design-main transition-colors duration-200 dark:text-design-main" />
                    <span className="font-medium transition-colors duration-200 dark:text-white">
                      {t("groupSelector.serviceSeeker")}
                    </span>
                  </div>
                </div>
                <div
                  className={twMerge(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-md dark:hover:shadow-lg/20",
                    selectedGroup === "provider"
                      ? "border-design-main bg-design-main/5 scale-[1.02] shadow-md dark:bg-design-main/10 dark:shadow-lg/20"
                      : "border-gray-200 hover:border-design-main/50 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 dark:hover:border-design-main/50"
                  )}
                  onClick={() => handleGroupSelect("provider")}
                >
                  <div className="flex items-center gap-3">
                    <Wrench className="size-6 text-design-main transition-colors duration-200 dark:text-design-main" />
                    <span className="font-medium transition-colors duration-200 dark:text-white">
                      {t("groupSelector.serviceProvider")}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Role Selection - Only show if group is selected */}
            {selectedGroup && (
              <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <div className="divider-horizontal mb-4">
                  <div className="divider-line">
                    <span className="divider-line-border" />
                  </div>
                  <div className="divider-text">
                    <span className="divider-text-bg">
                      {t("roleSelection.selectRole")}
                    </span>
                  </div>
                </div>

                <div className="form-field-group">
                  <div
                    className={
                      selectedGroup === "seeker"
                        ? "grid-auto-fit"
                        : "grid-responsive-2"
                    }
                  >
                    {getFilteredRoles().map((role, index) => (
                      <div
                        key={role.id}
                        className="animate-in fade-in-0 slide-in-from-bottom-4"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animationDuration: "400ms",
                          animationFillMode: "both",
                        }}
                      >
                        {renderUserRoleCard(role)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="form-submit-section">
              <Button
                onClick={handleContinue}
                className={`btn-full-width-tall transition-all duration-200 ease-in-out transform hover:scale-[1.02] ${
                  !selectedRole
                    ? "btn-disabled-state"
                    : "hover:shadow-lg dark:hover:shadow-xl/20"
                }`}
                disabled={!selectedRole}
              >
                {getButtonText()}
              </Button>
              <p className="text-description text-center-block">
                {t("roleSelection.haveAccount")}{" "}
                <Link
                  href="/login"
                  className="link-primary transition-colors duration-200 hover:text-design-main/80"
                >
                  {t("login")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupSelectorForm;
