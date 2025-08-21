import { create } from "zustand";
import {
  InstitutionRegistrationState,
  InstitutionRegistrationStep,
  InstitutionPersonalInfo,
} from "@auth/types/institution";

interface InstitutionRegistrationStore extends InstitutionRegistrationState {
  setCurrentStep: (step: InstitutionRegistrationStep) => void;
  setAuthMethod: (method: "email" | "phone" | "thirdParty") => void;
  setPersonalInfo: (info: InstitutionPersonalInfo) => void;
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
    step: InstitutionRegistrationStep;
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
  getStoreState: () => InstitutionRegistrationState;
}

export const useInstitutionRegistrationStore =
  create<InstitutionRegistrationStore>((set, get) => ({
    currentStep: "authMethod",
    authMethod: null,
    personalInfo: null,
    verificationCode: "",
    isVerified: false,
    isLoading: false,
    error: null,

    setCurrentStep: (step) => set({ currentStep: step }),
    setAuthMethod: (method) => set({ authMethod: method }),
    setPersonalInfo: (info) => set({ personalInfo: info }),
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
        case "complete":
          set({ currentStep: "verification" });
          break;
      }
    },

    canGoToNextStep: () => {
      const {
        currentStep,
        authMethod,
        personalInfo,
        verificationCode,
        isVerified,
      } = get();

      switch (currentStep) {
        case "authMethod":
          return authMethod !== null;
        case "personalInfo":
          return personalInfo !== null;
        case "verification":
          return verificationCode.length === 6 || isVerified;
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
      const steps: InstitutionRegistrationStep[] = [
        "authMethod",
        "personalInfo",
        "verification",
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
      const { authMethod, personalInfo } = get();

      if (!authMethod) return false;

      switch (authMethod) {
        case "email":
          return !!(
            personalInfo !== null &&
            personalInfo.institutionEmail &&
            personalInfo.password
          );
        case "phone":
          return !!(
            personalInfo !== null &&
            personalInfo.institutionPhoneNumber &&
            personalInfo.password
          );
        case "thirdParty":
          return !!(personalInfo !== null && personalInfo.institutionEmail);
        default:
          return false;
      }
    },

    getRegistrationSummary: () => {
      const { authMethod, currentStep, isVerified } = get();

      if (!authMethod) return null;

      return {
        authMethod: authMethod,
        userType: "Institution",
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
        verificationCode: state.verificationCode,
        isVerified: state.isVerified,
        isLoading: state.isLoading,
        error: state.error,
      };
    },
  }));
