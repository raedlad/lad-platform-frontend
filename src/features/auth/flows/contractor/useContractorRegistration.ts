import { useCallback } from "react";
import { useAuthStore } from "@auth/store/authStore";
import { useRouter } from "next/navigation";
import {
  ContractorPersonalInfo,
  ContractorTechnicalOperationalInfo,
  ContractorDocumentUpload,
} from "@auth/types/contractor";
import { RegistrationRole } from "@auth/types/auth";

export const useContractorRegistration = () => {
  const store = useAuthStore();
  const router = useRouter();

  // Ensure we're in contractor mode
  const ensureContractorMode = useCallback(() => {
    if (store.currentRole !== "contractor") {
      store.setRole("contractor");
    }
  }, [store]);

  const handlePersonalInfoSubmit = useCallback(
    async (data: ContractorPersonalInfo) => {
      ensureContractorMode();
      store.setLoading(true);
      store.setError(null);

      try {
        // Store the personal info
        store.setRoleData("personalInfo", data);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Move to next step
        store.goToNextStep();
        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to submit personal info";
        store.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        store.setLoading(false);
      }
    },
    [store, ensureContractorMode]
  );

  const handleTechnicalOperationalInfoSubmit = useCallback(
    async (data: ContractorTechnicalOperationalInfo) => {
      ensureContractorMode();
      store.setLoading(true);
      store.setError(null);

      try {
        // Store the technical operational info
        store.setRoleData("technicalOperationalInfo", data);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Move to next step
        store.goToNextStep();
        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to submit technical operational info";
        store.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        store.setLoading(false);
      }
    },
    [store, ensureContractorMode]
  );

  const handleDocumentUploadSubmit = useCallback(
    async (data: ContractorDocumentUpload) => {
      ensureContractorMode();
      store.setLoading(true);
      store.setError(null);

      try {
        // Store the document upload info
        store.setRoleData("documentUpload", data);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Move to next step
        store.goToNextStep();
        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to submit documents";
        store.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        store.setLoading(false);
      }
    },
    [store, ensureContractorMode]
  );

  const handlePlanSelection = useCallback(
    async (plan: "free" | "paid") => {
      ensureContractorMode();
      store.setLoading(true);
      store.setError(null);

      try {
        // Store the plan selection
        store.setRoleData("planSelection", { plan });

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Move to next step
        store.goToNextStep();
        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to select plan";
        store.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        store.setLoading(false);
      }
    },
    [store, ensureContractorMode]
  );

  const handleVerificationSubmit = useCallback(
    async (code: string) => {
      ensureContractorMode();
      store.setLoading(true);
      store.setError(null);

      try {
        // Simulate OTP verification
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (code === "123456") {
          store.setVerificationCode(code);
          store.setIsVerified(true);
          store.goToNextStep();
          return { success: true };
        } else {
          throw new Error("Invalid verification code");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Verification failed";
        store.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        store.setLoading(false);
      }
    },
    [store, ensureContractorMode]
  );

  const handleResendCode = useCallback(async () => {
    ensureContractorMode();
    store.setLoading(true);
    store.setError(null);

    try {
      // Simulate resending code
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to resend code";
      store.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      store.setLoading(false);
    }
  }, [store, ensureContractorMode]);

  const goToNextStep = useCallback(() => {
    ensureContractorMode();
    store.goToNextStep();
  }, [store, ensureContractorMode]);

  const goToPreviousStep = useCallback(() => {
    ensureContractorMode();
    store.goToPreviousStep();
  }, [store, ensureContractorMode]);

  const goToStep = useCallback(
    (step: string) => {
      ensureContractorMode();
      store.setCurrentStep(step);
    },
    [store, ensureContractorMode]
  );

  const resetRegistration = useCallback(() => {
    store.resetRegistration();
  }, [store]);

  return {
    // Store state
    currentStep: store.currentStep,
    authMethod: store.authMethod,
    personalInfo: store.roleData.personalInfo as ContractorPersonalInfo | null,
    technicalOperationalInfo: store.roleData
      .technicalOperationalInfo as ContractorTechnicalOperationalInfo | null,
    documentUpload: store.roleData
      .documentUpload as ContractorDocumentUpload | null,
    verificationCode: store.verificationCode,
    isVerified: store.isVerified,
    isLoading: store.isLoading,
    error: store.error,

    // Navigation
    goToNextStep,
    goToPreviousStep,
    goToStep,
    canGoToNextStep: store.canGoToNextStep,
    canGoToPreviousStep: store.canGoToPreviousStep,

    // Form handlers
    handlePersonalInfoSubmit,
    handleTechnicalOperationalInfoSubmit,
    handleDocumentUploadSubmit,
    handlePlanSelection,
    handleVerificationSubmit,
    handleResendCode,

    // Utilities
    resetRegistration,
    getCurrentStepInfo: store.getCurrentStepInfo,
  };
};
