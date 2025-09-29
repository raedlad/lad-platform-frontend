"use client";

import { UserCheck, Wrench } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/shared/components/ui/button";
import { useTranslations } from "next-intl";
import Link from "next/link";

interface GroupSelectorProps {
  selectedGroup: "seeker" | "provider" | null;
  onSelectGroup: (group: "seeker" | "provider") => void;
  onContinue: () => void;
}

const GroupSelector = ({
  selectedGroup,
  onSelectGroup,
  onContinue,
}: GroupSelectorProps) => {
  const t = useTranslations("auth");

  const groups = [
    {
      id: "seeker" as const,
      icon: <UserCheck className="size-8" />,
      title: t("groupSelector.serviceSeeker"),
      description: t("groupSelector.serviceSeekerDescription"),
    },
    {
      id: "provider" as const,
      icon: <Wrench className="size-8" />,
      title: t("groupSelector.serviceProvider"),
      description: t("groupSelector.serviceProviderDescription"),
    },
  ];

  const handleSelect = (groupId: "seeker" | "provider") => {
    onSelectGroup(groupId);
  };

  const handleContinue = () => {
    if (selectedGroup) {
      onContinue();
    }
  };

  const getButtonText = () => {
    if (!selectedGroup) return t("continue");
    return t("groupSelector.continueWithGroup", { group: selectedGroup });
  };

  return (
    <div className="container-centered">
      <div className="auth-form-container">
        <div className="auth-form-header">
          <h2 className="heading-section">{t("groupSelector.title")}</h2>
          <p className="text-description">{t("groupSelector.description")}</p>
        </div>

        <div className="auth-form-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {groups.map((group) => {
              const isSelected = selectedGroup === group.id;

              return (
                <div
                  key={group.id}
                  className={twMerge(
                    "relative h-full bg-gradient-to-br from-design-main/10 via-design-main/5 to-white/10 dark:from-n-8/15 dark:via-n-8/10 dark:to-n-8/5 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-n-6/30 shadow-2xl transition-all duration-700 overflow-hidden flex flex-col cursor-pointer group",
                    isSelected
                      ? "ring-2 ring-design-main/50 shadow-design-main/20"
                      : "hover:shadow-xl hover:scale-105"
                  )}
                  onClick={() => handleSelect(group.id)}
                >
                  {/* Animated Background Pattern */}
                  <div className="absolute inset-0 opacity-5 transition-opacity duration-700">
                    <div className="absolute inset-0 bg-gradient-to-br from-design-main/20 via-transparent to-p-5/20"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-design-main/10 to-transparent rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-p-4/10 to-transparent rounded-full blur-2xl"></div>
                  </div>

                  {/* Content */}
                  <div className="relative p-8 flex-1 flex flex-col items-center text-center">
                    {/* Icon Container */}
                    <div className="relative w-20 h-20 mb-6">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-design-main/20 via-p-5/20 to-design-main/20 animate-pulse"></div>
                      <div className="relative w-full h-full rounded-full bg-gradient-to-br from-design-main/10 via-p-3/20 to-p-4/20 transition-all duration-500 flex items-center justify-center shadow-lg">
                        <div className="text-design-main dark:text-p-4 transition-colors duration-300 text-2xl">
                          {group.icon}
                        </div>
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold mb-4 text-design-secondary dark:text-n-1 transition-colors duration-300">
                      {group.title}
                    </h3>
                    <p className="text-design-gray dark:text-n-4 text-base leading-relaxed transition-colors duration-300 flex-1">
                      {group.description}
                    </p>

                    {/* Selection Indicator */}
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-6 h-6 bg-design-main rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="form-submit-section">
            <Button
              onClick={handleContinue}
              className={`btn-full-width-tall ${
                !selectedGroup ? "btn-disabled-state" : ""
              }`}
              disabled={!selectedGroup}
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

export default GroupSelector;
