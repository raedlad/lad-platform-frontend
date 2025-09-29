import { create } from "zustand";

import { tokenStorage } from "@/features/auth/utils/tokenStorage";

// Types
import {
  AuthMethod,
  RegistrationRole,
  BaseRegistrationState,
  RoleSpecificData,
  TokenData,
  AuthUser,
} from "../types/auth";

// Constants
import { roleFlowMeta } from "../constants/roleFlowMeta";

// Development constant - set this to your desired default role for development

export interface AuthStoreState extends BaseRegistrationState {
  // Shared
  user: AuthUser | null;
  isAuthenticated: boolean;
  currentGroup: "seeker" | "provider" | null;
  currentRole: RegistrationRole | null;
  currentStep: string | null;
  authMethod: AuthMethod | null;
  verificationCode: string;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
  tokens?: TokenData | null;
  emailVerificationRequired?: boolean;
  phoneVerificationRequired?: boolean;

  showPassword: boolean;
  showConfirmPassword: boolean;
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  // Role-specific dynamic data bucket
  roleData: RoleSpecificData;

  // Actions
  setGroup: (group: "seeker" | "provider") => void;
  setRole: (role: RegistrationRole) => void;
  setCurrentStep: (step: string) => void;
  setAuthMethod: (method: AuthMethod) => void;
  setRoleData: (
    key: keyof RoleSpecificData,
    data: Record<string, unknown>
  ) => void;
  setVerificationCode: (code: string) => void;
  setIsVerified: (verified: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  setUserData: (userData: AuthUser) => void;
  updateUser: (updates: Partial<AuthUser>) => void;
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
  user: tokenStorage.getUser() as AuthUser | null,
  isAuthenticated: false,
  currentGroup: null,
  currentRole: tokenStorage.getCurrentRole() as RegistrationRole | null,
  currentStep: tokenStorage.getCurrentStep(),
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
  setGroup: (group) => set({ currentGroup: group }),
  setRole: (role) =>
    set(() => {
      const firstStep = roleFlowMeta[role].map((step) => step.key)[0] ?? null;
      return {
        currentRole: role,
        currentStep: firstStep,
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

  setCurrentStep: (step) => {
    set({ currentStep: step });
  },
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
  setUserData: (userData: AuthUser) => {
    const verificationStatus = userData?.account_overview?.verification_status;
    const { currentRole, currentStep } = get();

    // Persist to localStorage when user is set
    if (typeof window !== "undefined") {
      if (currentRole) {
        tokenStorage.setCurrentRole(currentRole);
      }
    }

    set((state) => ({
      ...state,
      user: userData,
      isAuthenticated: true,
      isVerified: !verificationStatus?.verification_required || false,
    }));
  },

  // Update user data partially
  updateUser: (updates: Partial<AuthUser>) => {
    set((state) => {
      if (!state.user) return state;

      const updatedUser = { ...state.user, ...updates };

      // Persist updated user to localStorage
      if (typeof window !== "undefined") {
        tokenStorage.setUser(updatedUser);
      }

      return {
        ...state,
        user: updatedUser,
      };
    });
  },

  // Logout and clear all auth-related state
  logout: () => {
    tokenStorage.clearAll();
    tokenStorage.clearCurrentRole();
    tokenStorage.clearCurrentStep();
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
  resetRegistration: () => {
    if (typeof window !== "undefined") {
      tokenStorage.clearCurrentRole();
      tokenStorage.clearCurrentStep();
    }
    set({
      currentGroup: null,
      currentStep: null,
      currentRole: null,
      authMethod: null,
      roleData: {},
      verificationCode: "",
      isVerified: false,
      isLoading: false,
      error: null,
    });
  },

  // Navigation
  goToNextStep: () => {
    const { currentRole, currentStep, user } = get();
    if (!currentRole || !currentStep) return;

    const steps = roleFlowMeta[currentRole];
    const idx = steps.map((step) => step.key).indexOf(currentStep);
    if (idx >= 0 && idx < steps.length - 1) {
      const nextStep = steps[idx + 1].key;
      if (typeof window !== "undefined" && user) {
        tokenStorage.setCurrentStep(nextStep);
      }
      set({ currentStep: nextStep });
    }
  },

  goToPreviousStep: () => {
    const { currentRole, currentStep, user } = get();
    if (!currentRole || !currentStep) return;

    const steps = roleFlowMeta[currentRole];
    const idx = steps.map((step) => step.key).indexOf(currentStep);

    // If user is on the first step, reset the role selection
    if (idx === 0) {
      if (typeof window !== "undefined" && user) {
        tokenStorage.clearCurrentRole();
        tokenStorage.clearCurrentStep();
      }
      set({
        currentGroup: null,
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
      const prevStep = steps[idx - 1].key;
      if (typeof window !== "undefined" && user) {
        tokenStorage.setCurrentStep(prevStep);
      }
      set({ currentStep: prevStep });
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
