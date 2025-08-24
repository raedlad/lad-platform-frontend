import { useCallback } from "react";
import { useAuthStore } from "@auth/store/authStore";
import { useRouter } from "next/navigation";
import {
  SupplierPersonalInfo,
  SupplierOperationalCommercialInfo,
  SupplierDocumentUpload,
} from "@auth/types/supplier";
import { RegistrationRole } from "@auth/types/auth";

export const useSupplierRegistration = () => {
  const store = useAuthStore();
  const router = useRouter();

  // Ensure we're in supplier mode
  const ensureSupplierMode = useCallback(() => {
    if (store.currentRole !== "supplier") {
      store.setRole("supplier");
    }
  }, [store]);

  const handlePersonalInfoSubmit = useCallback(
    async (data: SupplierPersonalInfo) => {
      ensureSupplierMode();
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
    [store, ensureSupplierMode]
  );

  const handleOperationalCommercialInfoSubmit = useCallback(
    async (data: SupplierOperationalCommercialInfo) => {
      ensureSupplierMode();
      store.setLoading(true);
      store.setError(null);

      try {
        // Store the operational commercial info
        store.setRoleData("operationalCommercialInfo", data);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Move to next step
        store.goToNextStep();
        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to submit operational commercial info";
        store.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        store.setLoading(false);
      }
    },
    [store, ensureSupplierMode]
  );

  const handleDocumentUploadSubmit = useCallback(
    async (data: SupplierDocumentUpload) => {
      ensureSupplierMode();
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
    [store, ensureSupplierMode]
  );

  const handlePlanSelection = useCallback(
    async (plan: "free" | "paid") => {
      ensureSupplierMode();
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
    [store, ensureSupplierMode]
  );

  const handleVerificationSubmit = useCallback(
    async (code: string) => {
      ensureSupplierMode();
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
    [store, ensureSupplierMode]
  );

  const handleResendCode = useCallback(async () => {
    ensureSupplierMode();
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
  }, [store, ensureSupplierMode]);

  const goToNextStep = useCallback(() => {
    ensureSupplierMode();
    store.goToNextStep();
  }, [store, ensureSupplierMode]);

  const goToPreviousStep = useCallback(() => {
    ensureSupplierMode();
    store.goToPreviousStep();
  }, [store, ensureSupplierMode]);

  const goToStep = useCallback(
    (step: string) => {
      ensureSupplierMode();
      store.setCurrentStep(step);
    },
    [store, ensureSupplierMode]
  );

  const resetRegistration = useCallback(() => {
    store.resetRegistration();
  }, [store]);

  return {
    // Store state
    currentStep: store.currentStep,
    authMethod: store.authMethod,
    personalInfo: store.roleData.personalInfo as SupplierPersonalInfo | null,
    operationalCommercialInfo: store.roleData
      .operationalCommercialInfo as SupplierOperationalCommercialInfo | null,
    documentUpload: store.roleData
      .documentUpload as SupplierDocumentUpload | null,
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
    handleOperationalCommercialInfoSubmit,
    handleDocumentUploadSubmit,
    handlePlanSelection,
    handleVerificationSubmit,
    handleResendCode,

    // Utilities
    resetRegistration,
    getCurrentStepInfo: store.getCurrentStepInfo,
  };
};
