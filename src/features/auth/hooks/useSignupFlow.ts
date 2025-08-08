import { useState, useCallback } from "react";
import { UserType, UserRole, SignupData } from "@auth/types";
import { useAuthStore } from "@auth/store";
import { useUserTypeSelection } from "./useUserTypeSelection";
import { useUserRollSelection } from "./useUserRollSelection";

export type SignupStep =
  | "userType"
  | "role"
  | "userInfo"
  | "verification"
  | "complete";

export const useSignupFlow = () => {
  const { signup, isLoading, error } = useAuthStore();
  const userTypeSelection = useUserTypeSelection();
  const roleSelection = useUserRollSelection();

  const [currentStep, setCurrentStep] = useState<SignupStep>("userType");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [flowError, setFlowError] = useState<string | null>(null);

  const goToStep = useCallback((step: SignupStep) => {
    setCurrentStep(step);
    setFlowError(null);
  }, []);

  const nextStep = useCallback(() => {
    switch (currentStep) {
      case "userType":
        if (userTypeSelection.validateSelection()) {
          goToStep("role");
        }
        break;
      case "role":
        if (roleSelection.validateSelection()) {
          goToStep("userInfo");
        }
        break;
      case "userInfo":
        // User info submission is handled separately
        break;
      case "verification":
        goToStep("complete");
        break;
    }
  }, [currentStep, userTypeSelection, roleSelection, goToStep]);

  const previousStep = useCallback(() => {
    switch (currentStep) {
      case "role":
        goToStep("userType");
        roleSelection.clearSelection();
        break;
      case "userInfo":
        goToStep("role");
        setUserInfo(null);
        break;
      case "verification":
        goToStep("userInfo");
        break;
    }
  }, [currentStep, goToStep, roleSelection]);

  const handleUserInfoSubmit = useCallback(
    async (data: any) => {
      setUserInfo(data);
      setFlowError(null);

      const signupData: SignupData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: roleSelection.selectedRole!,
        userType: userTypeSelection.selectedUserType!,
      };

      try {
        await signup(signupData);
        goToStep("verification");
        return { success: true };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Signup failed";
        setFlowError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [
      signup,
      roleSelection.selectedRole,
      userTypeSelection.selectedUserType,
      goToStep,
    ]
  );

  const resetFlow = useCallback(() => {
    setCurrentStep("userType");
    setUserInfo(null);
    setFlowError(null);
    userTypeSelection.clearSelection();
    roleSelection.clearSelection();
  }, [userTypeSelection, roleSelection]);

  const getStepProgress = useCallback(() => {
    const steps = ["userType", "role", "userInfo", "verification", "complete"];
    const currentIndex = steps.indexOf(currentStep);
    return {
      currentStep: currentIndex + 1,
      totalSteps: steps.length,
      progress: ((currentIndex + 1) / steps.length) * 100,
    };
  }, [currentStep]);

  const canGoNext = useCallback(() => {
    switch (currentStep) {
      case "userType":
        return userTypeSelection.selectedUserType !== null;
      case "role":
        return roleSelection.selectedRole !== null;
      case "userInfo":
        return false; // Handled by form submission
      case "verification":
        return true;
      default:
        return false;
    }
  }, [
    currentStep,
    userTypeSelection.selectedUserType,
    roleSelection.selectedRole,
  ]);

  const canGoBack = useCallback(() => {
    return currentStep !== "userType";
  }, [currentStep]);

  return {
    // Step management
    currentStep,
    goToStep,
    nextStep,
    previousStep,
    resetFlow,

    // State
    userInfo,
    setUserInfo,
    flowError,

    // Progress
    getStepProgress,
    canGoNext,
    canGoBack,

    // User type selection
    ...userTypeSelection,

    // Role selection
    ...roleSelection,

    // Auth store
    isLoading,
    error: error || flowError,

    // Actions
    handleUserInfoSubmit,
  };
};

export default useSignupFlow;
