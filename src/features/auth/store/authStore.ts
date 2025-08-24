import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Types
import type {
  AuthMethod,
  RegistrationRole,
  BaseRegistrationState,
  RoleSpecificData,
} from "../types/auth";

// Constants
import { roleFlowMeta } from "../constants/roleFlowMeta";

export interface AuthStoreState extends BaseRegistrationState {
  // Shared
  currentRole: RegistrationRole | null;
  currentStep: string | null;
  authMethod: AuthMethod | null;
  verificationCode: string;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;

  // Role-specific dynamic data bucket
  roleData: RoleSpecificData;

  // Actions
  setRole: (role: RegistrationRole) => void;
  setCurrentStep: (step: string) => void;
  setAuthMethod: (method: AuthMethod) => void;
  setRoleData: (key: keyof RoleSpecificData, data: any) => void;
  setVerificationCode: (code: string) => void;
  setIsVerified: (verified: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Flow actions
  resetRegistration: () => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // Derived state
  canGoToNextStep: () => boolean;
  canGoToPreviousStep: () => boolean;
  getCurrentStepInfo: () => {
    step: string | null;
    stepNumber: number;
    totalSteps: number;
    progress: number;
  };

  // Debug
  getStoreState: () => AuthStoreState;
}

export const useAuthStore = create<AuthStoreState>()(
  devtools((set, get) => ({
    // Initial state
    currentRole: null,
    currentStep: null,
    authMethod: null,
    verificationCode: "",
    isVerified: false,
    isLoading: false,
    error: null,
    roleData: {},

    // Actions
    setRole: (role) =>
      set({
        currentRole: role,
        currentStep: roleFlowMeta[role].map((step) => step.key)[0] ?? null,
        roleData: {},
        authMethod: null,
        verificationCode: "",
        isVerified: false,
        error: null,
      }),

    setCurrentStep: (step) => set({ currentStep: step }),
    setAuthMethod: (method) => set({ authMethod: method }),
    setRoleData: (key, data) =>
      set((state) => ({
        roleData: { ...state.roleData, [key]: data },
      })),
    setVerificationCode: (code) => set({ verificationCode: code }),
    setIsVerified: (verified) => set({ isVerified: verified }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // Reset
    resetRegistration: () =>
      set({
        currentStep: null,
        currentRole: null,
        authMethod: null,
        roleData: {},
        verificationCode: "",
        isVerified: false,
        isLoading: false,
        error: null,
      }),

    // Navigation
    goToNextStep: () => {
      const { currentRole, currentStep } = get();
      if (!currentRole || !currentStep) return;

      const steps = roleFlowMeta[currentRole];
      const idx = steps.map((step) => step.key).indexOf(currentStep);
      if (idx >= 0 && idx < steps.length - 1) {
        set({ currentStep: steps[idx + 1].key });
      }
    },

    goToPreviousStep: () => {
      const { currentRole, currentStep } = get();
      if (!currentRole || !currentStep) return;

      const steps = roleFlowMeta[currentRole];
      const idx = steps.map((step) => step.key).indexOf(currentStep);

      // If user is on the first step, reset the role selection
      if (idx === 0) {
        set({
          currentRole: null,
          currentStep: null,
          authMethod: null,
          roleData: {},
          verificationCode: "",
          isVerified: false,
          error: null,
        });
      } else if (idx > 0) {
        // Go to previous step
        set({ currentStep: steps[idx - 1].key });
      }
    },

    // Derived
    canGoToNextStep: () => {
      const { currentRole, currentStep } = get();
      if (!currentRole || !currentStep) return false;
      const steps = roleFlowMeta[currentRole];
      return (
        steps.map((step) => step.key).indexOf(currentStep) < steps.length - 1
      );
    },

    canGoToPreviousStep: () => {
      const { currentRole, currentStep } = get();
      if (!currentRole || !currentStep) return false;
      const steps = roleFlowMeta[currentRole];
      const idx = steps.map((step) => step.key).indexOf(currentStep);
      // Allow going back even on first step to reset role selection
      return idx >= 0;
    },

    getCurrentStepInfo: () => {
      const { currentRole, currentStep } = get();
      if (!currentRole || !currentStep) {
        return { step: null, stepNumber: 0, totalSteps: 0, progress: 0 };
      }
      const steps = roleFlowMeta[currentRole];
      const idx = steps.map((step) => step.key).indexOf(currentStep);
      const totalSteps = steps.length;
      return {
        step: currentStep,
        stepNumber: idx + 1,
        totalSteps,
        progress: ((idx + 1) / totalSteps) * 100,
      };
    },

    // Debug
    getStoreState: () => get(),
  }))
);
