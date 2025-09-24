import { useCallback } from "react";
import { useAuthStore } from "@auth/store/authStore";
import { roleFlowMeta } from "../../constants/roleFlowMeta";


export const useOnboardingStatus = () => {
  const store = useAuthStore();

  // Navigation handlers
  const goToNextStep = useCallback(() => {
    if (store.canGoToNextStep()) {
      store.goToNextStep();
    }
  }, [store]);

  const goToPreviousStep = useCallback(() => {
    if (store.canGoToPreviousStep()) {
      store.goToPreviousStep();
    }
  }, [store]);

  const goToStep = useCallback(
    (step: string) => {
      store.setCurrentStep(step);
    },
    [store]
  );

  // Auth method handlers

  // Completion handler
  const handleComplete = useCallback(() => {
    console.log("Registration completed!");
    store.resetRegistration();
    // Typically you would redirect the user here, e.g.:
    // router.push("/dashboard");
  }, [store]);

  // Utility functions
  const getStepProgress = useCallback(() => {
    const stepInfo = store.getCurrentStepInfo();
    return {
      currentStep: stepInfo.stepNumber,
      totalSteps: stepInfo.totalSteps,
      progress: stepInfo.progress,
    };
  }, [store]);

  const getTotalSteps = useCallback(() => {
  const steps = roleFlowMeta[store.currentRole as keyof typeof roleFlowMeta];
  return steps.length;
  }, [store]);

  const getStepTitle = useCallback(() => {
    // This would need to be implemented based on your step configuration
    return "Individual Registration";
  }, []);

  const getStepDescription = useCallback(() => {
    // This would need to be implemented based on your step configuration
    return "Complete your individual registration";
  }, []);

  return {
    ...store,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    handleComplete,
    getStepProgress,
    getStepTitle,
    getStepDescription,
    getTotalSteps,
  };
};

export default useOnboardingStatus;
