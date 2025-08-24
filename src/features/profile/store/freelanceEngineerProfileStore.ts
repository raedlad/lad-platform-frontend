import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  FreelanceEngineerRegistrationState,
  FreelanceEngineerPersonalInfo,
  FreelanceEngineerProfessionalInfo,
  FreelanceEngineerDocumentUpload,
} from "../types/freelanceEngineer";

export interface FreelanceEngineerRegistrationStoreState
  extends FreelanceEngineerRegistrationState {
  // UI-specific states
  showPassword: boolean;
  showConfirmPassword: boolean;
  engineeringLicenseFile: File | null;

  // Actions for UI states
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  setEngineeringLicenseFile: (file: File | null) => void;

  // Form state management
  setPersonalInfo: (info: FreelanceEngineerPersonalInfo) => void;
  setProfessionalInfo: (info: FreelanceEngineerProfessionalInfo) => void;
  setDocumentUpload: (info: FreelanceEngineerDocumentUpload) => void;

  // Reset
  resetForm: () => void;
}

export const useFreelanceEngineerRegistrationStore =
  create<FreelanceEngineerRegistrationStoreState>()(
    devtools((set, get) => ({
      // Initial state from FreelanceEngineerRegistrationState
      currentStep: "authMethod",
      authMethod: null,
      personalInfo: null,
      professionalInfo: null,
      documentUpload: null,
      verificationCode: "",
      isVerified: false,
      isLoading: false,
      error: null,

      // UI-specific states
      showPassword: false,
      showConfirmPassword: false,
      engineeringLicenseFile: null,

      // Actions for UI states
      setShowPassword: (show) => set({ showPassword: show }),
      setShowConfirmPassword: (show) => set({ showConfirmPassword: show }),
      setEngineeringLicenseFile: (file) =>
        set({ engineeringLicenseFile: file }),

      // Form state management
      setPersonalInfo: (info) => set({ personalInfo: info }),
      setProfessionalInfo: (info) => set({ professionalInfo: info }),
      setDocumentUpload: (info) => set({ documentUpload: info }),

      // Reset
      resetForm: () =>
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
          showPassword: false,
          showConfirmPassword: false,
          engineeringLicenseFile: null,
        }),
    }))
  );
