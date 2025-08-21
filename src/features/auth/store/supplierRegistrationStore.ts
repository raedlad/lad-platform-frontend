import { create } from "zustand";
import {
  SupplierRegistrationState,
  SupplierRegistrationStep,
  SupplierPersonalInfo,
  SupplierOperationalCommercialInfo,
  SupplierDocumentUpload,
} from "@auth/types/supplier";

interface SupplierRegistrationStore extends SupplierRegistrationState {
  setCurrentStep: (step: SupplierRegistrationStep) => void;
  setAuthMethod: (method: "email" | "phone" | "thirdParty") => void;
  setPersonalInfo: (info: SupplierPersonalInfo) => void;
  setOperationalCommercialInfo: (info: SupplierOperationalCommercialInfo) => void;
  setDocumentUpload: (info: SupplierDocumentUpload) => void;
  setVerificationCode: (code: string) => void;
  setIsVerified: (verified: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  resetRegistration: () => void;

  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canGoToNextStep: () => boolean;
  canGoToPreviousStep: () => boolean;

  // Registration flow methods
  startRegistration: () => void;
  completeRegistration: () => void;
  getCurrentStepInfo: () => {
    step: SupplierRegistrationStep;
    stepNumber: number;
    totalSteps: number;
    progress: number;
  };

  // Utility methods
  hasValidData: () => boolean;
  getRegistrationSummary: () => {
    authMethod: string;
    userType: string;
    isComplete: boolean;
  } | null;

  // Debug/Development methods
  getStoreState: () => SupplierRegistrationState;
}

export const useSupplierRegistrationStore =
  create<SupplierRegistrationStore>((set, get) => ({
    currentStep: "authMethod",
    authMethod: null,
    personalInfo: null,
    operationalCommercialInfo: null,
    documentUpload: null,
    verificationCode: "",
    isVerified: false,
    isLoading: false,
    error: null,

    setCurrentStep: (step) => set({ currentStep: step }),
    setAuthMethod: (method) => set({ authMethod: method }),
    setPersonalInfo: (info) => set({ personalInfo: info }),
    setOperationalCommercialInfo: (info) => set({ operationalCommercialInfo: info }),
    setDocumentUpload: (info) => set({ documentUpload: info }),
    setVerificationCode: (code) => set({ verificationCode: code }),
    setIsVerified: (verified) => set({ isVerified: verified }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    resetRegistration: () =>
      set({
        currentStep: "authMethod",
        authMethod: null,
        personalInfo: null,
        operationalCommercialInfo: null,
        documentUpload: null,
        verificationCode: "",
        isVerified: false,
        isLoading: false,
        error: null,
      }),

    goToNextStep: () => {
      const { currentStep } = get();
      switch (currentStep) {
        case "authMethod":
          set({ currentStep: "personalInfo" });
          break;
        case "personalInfo":
          set({ currentStep: "verification" });
          break;
        case "verification":
          set({ currentStep: "operationalCommercialInfo" });
          break;
        case "operationalCommercialInfo":
          set({ currentStep: "documentUpload" });
          break;
        case "documentUpload":
          set({ currentStep: "planSelection" });
          break;
        case "planSelection":
          set({ currentStep: "complete" });
          break;
      }
    },

    goToPreviousStep: () => {
      const { currentStep } = get();
      switch (currentStep) {
        case "personalInfo":
          set({ currentStep: "authMethod" });
          break;
        case "verification":
          set({ currentStep: "personalInfo" });
          break;
        case "operationalCommercialInfo":
          set({ currentStep: "verification" });
          break;
        case "documentUpload":
          set({ currentStep: "operationalCommercialInfo" });
          break;
        case "planSelection":
          set({ currentStep: "documentUpload" });
          break;
        case "complete":
          set({ currentStep: "planSelection" });
          break;
      }
    },

    canGoToNextStep: () => {
      const {
        currentStep,
        authMethod,
        personalInfo,
        operationalCommercialInfo,
        documentUpload,
        isVerified,
      } = get();

      switch (currentStep) {
        case "authMethod":
          return authMethod !== null;
        case "personalInfo":
          return personalInfo !== null;
        case "verification":
          return isVerified;
        case "operationalCommercialInfo":
          return operationalCommercialInfo !== null;
        case "documentUpload":
          return documentUpload !== null;
        case "planSelection":
          return true; // Plan selection doesn't have a specific data requirement to proceed
        case "complete":
          return false;
        default:
          return false;
      }
    },

    canGoToPreviousStep: () => {
      const { currentStep } = get();
      return currentStep !== "authMethod";
    },

    // Registration flow methods
    startRegistration: () => {
      set({
        currentStep: "authMethod",
        authMethod: null,
        personalInfo: null,
        operationalCommercialInfo: null,
        documentUpload: null,
        verificationCode: "",
        isVerified: false,
        isLoading: false,
        error: null,
      });
    },

    completeRegistration: () => {
      set({
        currentStep: "complete",
        isVerified: true,
        isLoading: false,
        error: null,
      });
    },

    getCurrentStepInfo: () => {
      const { currentStep } = get();
      const steps: SupplierRegistrationStep[] = [
        "authMethod",
        "personalInfo",
        "verification",
        "operationalCommercialInfo",
        "documentUpload",
        "planSelection",
        "complete",
      ];
      const stepNumber = steps.indexOf(currentStep) + 1;
      const totalSteps = steps.length;
      const progress = (stepNumber / totalSteps) * 100;

      return {
        step: currentStep,
        stepNumber,
        totalSteps,
        progress,
      };
    },

    // Utility methods
    hasValidData: () => {
      const { authMethod, personalInfo, operationalCommercialInfo, documentUpload } = get();

      if (!authMethod) return false;

      switch (authMethod) {
        case "email":
          return !!(
            personalInfo !== null &&
            personalInfo.email &&
            personalInfo.password
          );
        case "phone":
          return !!(
            personalInfo !== null &&
            personalInfo.authorizedPersonMobileNumber &&
            personalInfo.password
          );
        case "thirdParty":
          return !!(personalInfo !== null && personalInfo.email);
        default:
          return false;
      }
    },

    getRegistrationSummary: () => {
      const { authMethod, currentStep, isVerified } = get();

      if (!authMethod) return null;

      return {
        authMethod: authMethod,
        userType: "Supplier",
        isComplete: currentStep === "complete" && isVerified,
      };
    },

    // Debug/Development methods
    getStoreState: () => {
      const state = get();
      return {
        currentStep: state.currentStep,
        authMethod: state.authMethod,
        personalInfo: state.personalInfo,
        operationalCommercialInfo: state.operationalCommercialInfo,
        documentUpload: state.documentUpload,
        verificationCode: state.verificationCode,
        isVerified: state.isVerified,
        isLoading: state.isLoading,
        error: state.error,
      };
    },
  }));


