"use client";

import { useAuthStore } from "@auth/store/authStore";
import { roleFlows } from "@auth/constants/roleFlows";
import { roleFlowMeta } from "../../constants/roleFlowMeta";
import OnboardingProgress from "./OnboardingProgress";
import OnboardingStepper from "./OnboardingStepper";

export function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const { currentRole, currentStep } = useAuthStore();

  if (!currentRole || !currentStep) return <>{children}</>;

  const steps = roleFlowMeta[currentRole];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 p-2">
      <div className="hidden lg:block lg:col-span-3 w-full ">
        <OnboardingStepper stepperSteps={steps} />
      </div>
      <div className="lg:col-span-9 space-y-6 flex flex-col items-center justify-center">
        <OnboardingProgress total={steps.length} />
        <div className="w-full flex items-center justify-center max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
