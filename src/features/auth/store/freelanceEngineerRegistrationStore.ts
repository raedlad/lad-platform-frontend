import { create } from "zustand";
import {
  FreelanceEngineerRegistrationState,
  FreelanceEngineerRegistrationStep,
  FreelanceEngineerPersonalInfo,
  FreelanceEngineerProfessionalInfo,
  FreelanceEngineerDocumentUpload,
} from "@auth/types/freelanceEngineer";

interface FreelanceEngineerRegistrationStore
  extends FreelanceEngineerRegistrationState {
  setCurrentStep: (step: FreelanceEngineerRegistrationStep) => void;
  setAuthMethod: (method: "email" | "phone" | "thirdParty") => void;
  setPersonalInfo: (info: FreelanceEngineerPersonalInfo) => void;
  setProfessionalInfo: (info: FreelanceEngineerProfessionalInfo) => void;
  setDocumentUpload: (info: FreelanceEngineerDocumentUpload) => void;
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

  // Getters
  getCurrentStepInfo: () => {
    step: FreelanceEngineerRegistrationStep;
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
  getStoreState: () => FreelanceEngineerRegistrationState;

  // Additional utility methods
  startRegistration: () => void;
  completeRegistration: () => void;
  getStepProgress: () => {
    currentStep: number;
    totalSteps: number;
    progress: number;
  };

  getStepTitle: () => string;
  getStepDescription: () => string;
}

export const useFreelanceEngineerRegistrationStore =
  create<FreelanceEngineerRegistrationStore>((set, get) => ({
    currentStep: "authMethod",
    authMethod: null,
    personalInfo: null,
    professionalInfo: null,
    documentUpload: null,
    verificationCode: "",
    isVerified: false,
    isLoading: false,
    error: null,

    setCurrentStep: (step) => set({ currentStep: step }),
    setAuthMethod: (method) => set({ authMethod: method }),
    setPersonalInfo: (info) => set({ personalInfo: info }),
    setProfessionalInfo: (info) => set({ professionalInfo: info }),
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
        professionalInfo: null,
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
          set({ currentStep: "professionalInfo" });
          break;
        case "professionalInfo":
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
        case "professionalInfo":
          set({ currentStep: "verification" });
          break;
        case "documentUpload":
          set({ currentStep: "professionalInfo" });
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
        professionalInfo,
        documentUpload,
        verificationCode,
        isVerified,
      } = get();

      switch (currentStep) {
        case "authMethod":
          return authMethod !== null;
        case "personalInfo":
          return personalInfo !== null;
        case "verification":
          return isVerified;
        case "professionalInfo":
          return professionalInfo !== null;
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

    // Getters
    getCurrentStepInfo: () => {
      const { currentStep } = get();
      const steps: FreelanceEngineerRegistrationStep[] = [
        "authMethod",
        "personalInfo",
        "verification",
        "professionalInfo",
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
      const { authMethod, personalInfo, professionalInfo, documentUpload } =
        get();

      if (!authMethod || !personalInfo) return false;

      // Check if we have the minimum required data for each step
      const hasPersonalInfo = personalInfo !== null;
      const hasProfessionalInfo = professionalInfo !== null;
      const hasDocuments = documentUpload !== null;

      return hasPersonalInfo && hasProfessionalInfo && hasDocuments;
    },

    getRegistrationSummary: () => {
      const { authMethod, currentStep, isVerified } = get();

      if (!authMethod) return null;

      return {
        authMethod: authMethod,
        userType: "Freelance Engineer",
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
        professionalInfo: state.professionalInfo,
        documentUpload: state.documentUpload,
        verificationCode: state.verificationCode,
        isVerified: state.isVerified,
        isLoading: state.isLoading,
        error: state.error,
      };
    },

    // Additional utility methods
    startRegistration: () => {
      set({ isLoading: true });
    },
    completeRegistration: () => {
      set({ isLoading: false, isVerified: true });
    },
    getStepProgress: () => {
      const { currentStep } = get();
      const steps: FreelanceEngineerRegistrationStep[] = [
        "authMethod",
        "personalInfo",
        "verification",
        "professionalInfo",
        "documentUpload",
        "planSelection",
        "complete",
      ];
      const currentStepIndex = steps.indexOf(currentStep);
      const totalSteps = steps.length;
      const progress = ((currentStepIndex + 1) / totalSteps) * 100;

      return {
        currentStep: currentStepIndex + 1,
        totalSteps,
        progress,
      };
    },

    getStepTitle: () => {
      const { currentStep } = get();
      const stepTitles: Record<FreelanceEngineerRegistrationStep, string> = {
        authMethod: "اختر طريقة التسجيل للمهندس المستقل",
        personalInfo: "المعلومات الشخصية للمهندس المستقل",
        verification: "تأكيد حساب المهندس المستقل",
        professionalInfo: "المعلومات المهنية",
        documentUpload: "رفع المستندات",
        planSelection: "اختر خطة الاشتراك",
        complete: "اكتمل تسجيل المهندس المستقل",
      };
      return stepTitles[currentStep] || "";
    },

    getStepDescription: () => {
      const { currentStep } = get();
      const stepDescriptions: Record<
        FreelanceEngineerRegistrationStep,
        string
      > = {
        authMethod: "حدد الطريقة التي تود استخدامها لإنشاء حسابك كمهندس مستقل",
        personalInfo: "أدخل بياناتك الشخصية للمتابعة كمهندس مستقل",
        verification: "أدخل رمز التحقق المرسل إلى حسابك كمهندس مستقل",
        professionalInfo: "أدخل معلوماتك المهنية وخبراتك",
        documentUpload: "يرجى رفع المستندات المطلوبة لإكمال التسجيل",
        planSelection: "اختر الخطة التي تناسب احتياجاتك",
        complete: "تم إنشاء حسابك كمهندس مستقل بنجاح",
      };
      return stepDescriptions[currentStep] || "";
    },
  }));
