import { useAuthStore } from "@/features/auth/store";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React from "react";
import useOnboardingStatus from "./useOnboardingStatus";

const OnboardingProgress = ({total } : {total : number}) => {
  const store = useAuthStore();
  const isLoading = store.isLoading;
  const { goToPreviousStep, getCurrentStepInfo } = useOnboardingStatus();
  const onBack = goToPreviousStep;

  const getStepNumber = () => {
    const stepInfo = store.getCurrentStepInfo();
    return stepInfo.stepNumber;
  };


  return (
    <div className="w-full flex  max-w-md ">
      <div className="flex items-center gap-2">

      <Button
        variant="ghost"
        size="lg"
        onClick={onBack}
        className="p-1"
        disabled={isLoading}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="text-lg text-muted-foreground">
        {getStepNumber()} / {total}
      </div>
      </div>
    </div>
  );
};

export default OnboardingProgress;
