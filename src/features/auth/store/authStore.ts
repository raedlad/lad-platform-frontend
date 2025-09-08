import { create } from "zustand";

import { tokenStorage } from "@/features/auth/utils/tokenStorage";

// Types
import {
  AuthMethod,
  RegistrationRole,
  BaseRegistrationState,
  RoleSpecificData,
  User,
} from "../types/auth";

// Constants
import { roleFlowMeta } from "../constants/roleFlowMeta";

// Development constant - set this to your desired default role for development

export interface AuthStoreState extends BaseRegistrationState {
  // Shared
  user: any | null;
  isAuthenticated: boolean;
  currentRole: RegistrationRole | null;
  currentStep: string | null;
  authMethod: AuthMethod | null;
  verificationCode: string;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
  tokens?: any | null;
  emailVerificationRequired?: boolean;
  phoneVerificationRequired?: boolean;

  showPassword: boolean;
  showConfirmPassword: boolean;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
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
  setUserData: (userData: any) => void;
  logout: () => void;

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

export const useAuthStore = create<AuthStoreState>()((set, get) => ({
  // Initial state
  user:  tokenStorage.getUser() as User | null,
  isAuthenticated: false,
  currentRole: tokenStorage.getCurrentRole() as RegistrationRole | null,
  currentStep: null,
  authMethod: null,
  verificationCode: "",
  isVerified: false,
  isLoading: false,
  error: null,
  roleData: {},
  tokens: null,
  emailVerificationRequired: false,
  phoneVerificationRequired: false,
  showPassword: false,
  showConfirmPassword: false,
  setShowPassword: (show) => set({ showPassword: show }),
  setShowConfirmPassword: (show) => set({ showConfirmPassword: show }),

  // Actions
  setRole: (role) =>
    set(() => {
      if (typeof window !== "undefined") {
        tokenStorage.setCurrentRole(role);
      }
      return {
        currentRole: role,
        currentStep: roleFlowMeta[role].map((step) => step.key)[0] ?? null,
        roleData: {},
        authMethod: null,
        verificationCode: "",
        isVerified: false,
        error: null,
      };
    }),

  // Persist role change to localStorage
  // Use a separate effect to avoid side effects in set callback
  // but here we can safely write since it's a direct user action
  // and doesn't depend on previous state.

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

  // Set user data and verification status
  setUserData: (userData: any) => {
    const verificationStatus = userData?.account_overview?.verification_status;
    set((state) => ({
      ...state,
      user: userData,
      isVerified: !verificationStatus?.verification_required || false,
    }));
  },

  // Logout and clear all auth-related state
  logout: () => {
    tokenStorage.clearAll();
    tokenStorage.clearCurrentRole();
    set({
      user: null,
      isAuthenticated: false,
      currentStep: null,
      currentRole: null,
      authMethod: null,
      roleData: {},
      verificationCode: "",
      isVerified: false,
      isLoading: false,
      error: null,
      tokens: null,
      emailVerificationRequired: false,
      phoneVerificationRequired: false,
    });
  },

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
}));
