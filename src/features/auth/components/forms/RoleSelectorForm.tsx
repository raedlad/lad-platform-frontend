"use client";

import { Building2, Briefcase, User, Search } from "lucide-react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { useTranslations } from "next-intl";
import { RegistrationRole, UserRoleOption } from "@auth/types/auth";

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
interface RoleSelectorFormProps {
  selectedRole: RegistrationRole | null;
  onSelectRole: (roleId: RegistrationRole) => void;
  onContinue: () => void;
}

// 2. Accept the props
const RoleSelectorForm = ({
  selectedRole,
  onSelectRole,
  onContinue,
}: RoleSelectorFormProps) => {
  const t = useTranslations("auth");
  const commonT = useTranslations("common");

  const handleSelect = (id: string, checked: boolean) => {
    if (
      checked &&
      id !== "government-agency" &&
      (id === "individual" ||
        id === "organization" ||
        id === "freelance_engineer" ||
        id === "engineering_office" ||
        id === "contractor" ||
        id === "supplier")
    ) {
      onSelectRole(id as RegistrationRole);
    }
  };

  const handleContinue = () => {
    if (selectedRole) {
      onContinue();
    }
  };

  const getButtonText = () => {
    if (!selectedRole) return t("signup");
    return t(`roleSelector.${selectedRole}ButtonText`);
  };

  const renderUserRoleCard = (role: UserRoleOption) => {
    const isSelected = selectedRole === role.id;
    const isDisabled = role.comingSoon;
    const hasTranslation = role.id !== "government-agency";

    return (
      <div
        key={role.id}
        className={twMerge(
          "card-role-selector",
          isSelected && !isDisabled
            ? "card-role-selector-selected"
            : isDisabled
            ? "card-role-selector-disabled"
            : "card-role-selector-hover"
        )}
        onClick={() => !isDisabled && handleSelect(role.id, !isSelected)}
      >
        <div className="role-card-content">
          <div className="role-card-info">
            <div
              className={twMerge(
                "role-card-icon",
                isSelected && !isDisabled ? "role-card-icon-selected" : ""
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
                  "role-card-description",
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
                "role-card-radio",
                isSelected && !isDisabled
                  ? "role-card-radio-selected"
                  : "role-card-radio-unselected"
              )}
            >
              {isSelected && !isDisabled && (
                <div className="role-card-radio-dot">
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
    <div className="container-centered">
      <div className="auth-form-container">
        <div className="auth-form-header">
          <h2 className="heading-section">{t("subtitle")}</h2>
          <p className="text-description">{t("roleSelection.description")}</p>
        </div>

        <div className="auth-form-content">
          <div className="form-field-group">
            <div className="grid-auto-fit">
              {serviceSeekerRoles.map((role) => renderUserRoleCard(role))}
            </div>
          </div>

          <div className="divider-horizontal">
            <div className="divider-line">
              <span className="divider-line-border" />
            </div>
            <div className="divider-text">
              <span className="divider-text-bg">{t("roleSelection.or")}</span>
            </div>
          </div>

          <div className="form-field-group">
              <div className="grid-responsive-2">
              {serviceProviderRoles.map((role) => renderUserRoleCard(role))}
            </div>
          </div>

          <div className="form-submit-section">
            <Button
              onClick={handleContinue}
              className={`btn-full-width-tall ${
                !selectedRole ? "btn-disabled-state" : ""
              }`}
              disabled={!selectedRole}
            >
              {getButtonText()}
            </Button>
            <p className="text-description text-center-block">
              {t("roleSelection.haveAccount")}{" "}
              <Link href="/login" className="link-primary">
                {t("login")}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectorForm;
