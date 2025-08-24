import { useAuthStore } from "@/features/auth/store";
import React from "react";
import { User, UserCheck, Shield } from "lucide-react";
import { useTranslations } from "next-intl";

interface OnboardingStepperProps {
  stepperSteps: {
    key: string;
    showInUI: boolean;
    label: string;
    icon: string;
    description: string;
  }[];
}

const OnboardingStepper: React.FC<OnboardingStepperProps> = ({
  stepperSteps,
}) => {
  const { currentStep } = useAuthStore();
  const t = useTranslations("auth.onboarding.steps");

  // Helper function to get icon component based on step key
  const getIconComponent = (stepKey: string) => {
    switch (stepKey) {
      case "authMethod":
        return Shield;
      case "personalInfo":
        return UserCheck;
      case "verification":
        return User;
      default:
        return User;
    }
  };

  // Helper function to get translated step info
  const getStepInfo = (stepKey: string) => {
    switch (stepKey) {
      case "authMethod":
        return {
          label: t("authMethod.label"),
          description: t("authMethod.description"),
        };
      case "personalInfo":
        return {
          label: t("personalInfo.label"),
          description: t("personalInfo.description"),
        };
      case "verification":
        return {
          label: t("verification.label"),
          description: t("verification.description"),
        };
      default:
        return {
          label: stepKey,
          description: "",
        };
    }
  };

  // Don't render if no steps
  if (stepperSteps.length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg w-full h-full bg-n-1 dark:bg-[#101010] section py-[10vh] p-6">
      <div className="space-y-12">
        {stepperSteps.map((step, index) => {
          const IconComponent = getIconComponent(step.key);
          const isActive = currentStep === step.key;
          const stepInfo = getStepInfo(step.key);

          return (
            <div key={step.key} className="relative group">
              {/* Progress Line */}
              {index < stepperSteps.length - 1 && (
                <div className="absolute right-[1.05rem] top-8 w-0.5 h-16 bg-n-4 dark:bg-n-6">
                  <div
                    className={`h-full bg-p-5 dark:bg-p-4 transition-all duration-700 ease-in-out ${
                      currentStep &&
                      stepperSteps.findIndex((s) => s.key === currentStep) >
                        index
                        ? "w-full"
                        : "w-0"
                    }`}
                  />
                </div>
              )}

              {/* Step Circle */}
              <div className="flex items-center gap-4">
                <div
                  className={`relative z-10 size-9 rounded-lg border flex items-center justify-center transition-all duration-500 ease-in-out transform ${
                    isActive
                      ? "border-n-4 dark:border-n-5 bg-background dark:bg-n-7 scale-110 shadow-xs"
                      : "border-n-4 dark:border-n-5 bg-n-1 dark:bg-n-8 text-n-6 dark:text-n-4 transition-all duration-300"
                  }`}
                >
                  <IconComponent
                    className={`size-5 transition-all duration-300 ${
                      isActive
                        ? "text-n-9 dark:text-n-1"
                        : "text-n-6 dark:text-n-4 opacity-80"
                    }`}
                  />
                </div>

                <div className="flex-1 transition-all duration-500 ease-in-out">
                  <h2
                    className={`font-bold transition-colors duration-300 mb-1 ${
                      isActive
                        ? "text-n-9 dark:text-n-1"
                        : "text-n-6/80 dark:text-n-4/80"
                    }`}
                  >
                    {stepInfo.label}
                  </h2>
                  <p
                    className={`text-sm transition-colors duration-300 ${
                      isActive
                        ? "text-n-7 dark:text-n-3"
                        : "text-n-5 dark:text-n-5"
                    }`}
                  >
                    {stepInfo.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingStepper;
