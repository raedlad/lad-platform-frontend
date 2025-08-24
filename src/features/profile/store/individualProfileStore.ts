import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  IndividualRegistrationState,
  PersonalInfo,
} from "../types/individual";

export interface IndividualRegistrationStoreState
  extends IndividualRegistrationState {
  // UI-specific states
  showPassword: boolean;
  showConfirmPassword: boolean;
  nationalIdFile: File | null;

  // Actions for UI states
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  setNationalIdFile: (file: File | null) => void;

  // Form state management
  setPersonalInfo: (info: PersonalInfo) => void;
  setPhoneInfo: (info: PersonalInfo) => void;
  setThirdPartyInfo: (info: PersonalInfo) => void;

  // Reset
  resetForm: () => void;
}

export const useIndividualRegistrationStore =
  create<IndividualRegistrationStoreState>()(
    devtools((set, get) => ({
      // Initial state from IndividualRegistrationState
      currentStep: "authMethod",
      authMethod: null,
      personalInfo: null,
      phoneInfo: null,
      thirdPartyInfo: null,
      verificationCode: "",
      isVerified: false,
      isLoading: false,
      error: null,

      // UI-specific states
      showPassword: false,
      showConfirmPassword: false,
      nationalIdFile: null,

      // Actions for UI states
      setShowPassword: (show) => set({ showPassword: show }),
      setShowConfirmPassword: (show) => set({ showConfirmPassword: show }),
      setNationalIdFile: (file) => set({ nationalIdFile: file }),

      // Form state management
      setPersonalInfo: (info) => set({ personalInfo: info }),
      setPhoneInfo: (info) => set({ phoneInfo: info }),
      setThirdPartyInfo: (info) => set({ thirdPartyInfo: info }),

      // Reset
      resetForm: () =>
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
          showPassword: false,
          showConfirmPassword: false,
          nationalIdFile: null,
        }),
    }))
  );
