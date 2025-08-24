import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  InstitutionRegistrationState,
  InstitutionPersonalInfo,
} from "../types/institution";

export interface InstitutionRegistrationStoreState
  extends InstitutionRegistrationState {
  // UI-specific states
  showPassword: boolean;
  showConfirmPassword: boolean;
  commercialRegistrationFile: File | null;

  // Actions for UI states
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  setCommercialRegistrationFile: (file: File | null) => void;

  // Form state management
  setPersonalInfo: (info: InstitutionPersonalInfo) => void;

  // Reset
  resetForm: () => void;
}

export const useInstitutionRegistrationStore =
  create<InstitutionRegistrationStoreState>()(
    devtools((set, get) => ({
      // Initial state from InstitutionRegistrationState
      currentStep: "authMethod",
      authMethod: null,
      personalInfo: null,
      verificationCode: "",
      isVerified: false,
      isLoading: false,
      error: null,

      // UI-specific states
      showPassword: false,
      showConfirmPassword: false,
      commercialRegistrationFile: null,

      // Actions for UI states
      setShowPassword: (show) => set({ showPassword: show }),
      setShowConfirmPassword: (show) => set({ showConfirmPassword: show }),
      setCommercialRegistrationFile: (file) =>
        set({ commercialRegistrationFile: file }),

      // Form state management
      setPersonalInfo: (info) => set({ personalInfo: info }),

      // Reset
      resetForm: () =>
        set({
          currentStep: "authMethod",
          authMethod: null,
          personalInfo: null,
          verificationCode: "",
          isVerified: false,
          isLoading: false,
          error: null,
          showPassword: false,
          showConfirmPassword: false,
          commercialRegistrationFile: null,
        }),
    }))
  );
