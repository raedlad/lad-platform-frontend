import { create } from "zustand";
import {
  IndividualRegistrationState,
  IndividualRegistrationStep,
  PersonalInfo, // UPDATED IMPORT
} from "@auth/types/individual";

interface IndividualRegistrationStore extends IndividualRegistrationState {
  // Actions
  setCurrentStep: (step: IndividualRegistrationStep) => void;
  setAuthMethod: (method: "email" | "phone" | "thirdParty") => void;
  setPersonalInfo: (info: PersonalInfo) => void; // Use unified PersonalInfo
  setPhoneInfo: (info: PersonalInfo) => void; // Use unified PersonalInfo
  setThirdPartyInfo: (info: PersonalInfo) => void; // Use unified PersonalInfo
  // If you decide to store specific types in the store, adjust these setters:
  // setPersonalInfo: (info: EmailRegistrationInfo) => void;
  // setPhoneInfo: (info: PhoneRegistrationInfo) => void;
  // setThirdPartyInfo: (info: ThirdPartyRegistrationInfo) => void;
  setVerificationCode: (code: string) => void;
  setIsVerified: (verified: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  resetRegistration: () => void; // Added resetRegistration to the interface

  // Computed actions
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canGoToNextStep: () => boolean;
  canGoToPreviousStep: () => boolean;

  // Getters
  getDefaultPreFilledData: () => {
    firstName: string;
    lastName: string;
    email: string;
  };

  // Registration flow methods
  startRegistration: () => void;
  completeRegistration: () => void;
  getCurrentStepInfo: () => {
    step: IndividualRegistrationStep;
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
  getStoreState: () => IndividualRegistrationState;
  setDefaultPreFilledData: (data: {
    firstName: string;
    lastName: string;
    email: string;
  }) => void;

  // Additional state
  defaultPreFilledData: { firstName: string; lastName: string; email: string };
}

export const useIndividualRegistrationStore =
  create<IndividualRegistrationStore>((set, get) => ({
    // Initial state - these must match IndividualRegistrationState
    currentStep: "authMethod",
    authMethod: null,
    personalInfo: null, // Use unified PersonalInfo
    phoneInfo: null, // Use unified PersonalInfo
    thirdPartyInfo: null, // Use unified PersonalInfo
    verificationCode: "",
    isVerified: false,
    isLoading: false,
    error: null,

    // Default pre-filled data for testing/development
    defaultPreFilledData: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    },

    // Basic setters
    setCurrentStep: (step) => set({ currentStep: step }),
    setAuthMethod: (method) => set({ authMethod: method }),
    setPersonalInfo: (info) => set({ personalInfo: info }),
    setPhoneInfo: (info) => set({ phoneInfo: info }),
    setThirdPartyInfo: (info) => set({ thirdPartyInfo: info }),
    setVerificationCode: (code) => set({ verificationCode: code }),
    setIsVerified: (verified) => set({ isVerified: verified }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // Reset registration
    resetRegistration: () =>
      set({
        currentStep: "authMethod",
        authMethod: null,
        personalInfo: null,
        phoneInfo: null,
        thirdPartyInfo: null,
        verificationCode: "",
        isVerified: false,
        isLoading: false,
        error: null,
        defaultPreFilledData: {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
        },
      }),

    // Navigation actions
    goToNextStep: () => {
      const { currentStep } = get();
      console.log("goToNextStep called from step:", currentStep);

      switch (currentStep) {
        case "authMethod":
          // All auth methods go to personalInfo step first
          console.log("Moving from authMethod to personalInfo");
          set({ currentStep: "personalInfo" });
          break;
        case "personalInfo":
          console.log("Moving from personalInfo to verification");
          set({ currentStep: "verification" });
          break;
        case "verification":
          console.log("Moving from verification to complete");
          set({ currentStep: "complete" });
          break;
      }

      const newStep = get().currentStep;
      console.log("Step after transition:", newStep);
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

    // Navigation validation
    canGoToNextStep: () => {
      const {
        currentStep,
        authMethod,
        personalInfo,
        phoneInfo,
        thirdPartyInfo,
        verificationCode,
        isVerified,
      } = get();

      switch (currentStep) {
        case "authMethod":
          return authMethod !== null;
        case "personalInfo":
          // Check if we have data based on the auth method
          if (authMethod === "email") {
            return personalInfo !== null;
          } else if (authMethod === "phone") {
            return phoneInfo !== null;
          } else if (authMethod === "thirdParty") {
            return thirdPartyInfo !== null;
          }
          return false;
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

    // Getters
    getDefaultPreFilledData: () => {
      const { defaultPreFilledData } = get();
      return defaultPreFilledData;
    },

    // Registration flow methods
    startRegistration: () => {
      set({
        currentStep: "authMethod",
        authMethod: null,
        personalInfo: null,
        phoneInfo: null,
        thirdPartyInfo: null,
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
      const steps: IndividualRegistrationStep[] = [
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
      const { authMethod, personalInfo, phoneInfo, thirdPartyInfo } = get();

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
            phoneInfo !== null &&
            phoneInfo.phoneNumber &&
            phoneInfo.password
          );
        case "thirdParty":
          return !!(thirdPartyInfo !== null && thirdPartyInfo.email);
        default:
          return false;
      }
    },

    getRegistrationSummary: () => {
      const { authMethod, currentStep, isVerified } = get();

      if (!authMethod) return null;

      return {
        authMethod: authMethod,
        userType: "Individual",
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
        phoneInfo: state.phoneInfo,
        thirdPartyInfo: state.thirdPartyInfo,
        verificationCode: state.verificationCode,
        isVerified: state.isVerified,
        isLoading: state.isLoading,
        error: state.error,
      };
    },

    setDefaultPreFilledData: (data) => {
      set({ defaultPreFilledData: data });
    },
  }));
