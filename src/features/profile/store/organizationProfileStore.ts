import { create } from "zustand";

import {
  OrganizationProfileState,
  OrganizationDocumentUpload,
} from "../types/organization";

export interface OrganizationProfileStoreState
  extends OrganizationProfileState {
  // UI-specific file states
  commercialRegistrationFile: File | null;

  // Actions for file states
  setCommercialRegistrationFile: (file: File | null) => void;

  // Form state management
  setDocumentUpload: (info: OrganizationDocumentUpload) => void;

  // Loading and error management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Reset
  resetProfile: () => void;
}

export const useOrganizationProfileStore =
  create<OrganizationProfileStoreState>()((set) => ({
    // Initial state from OrganizationProfileState
    documentUpload: null,
    isLoading: false,
    error: null,

    // UI-specific file states
    commercialRegistrationFile: null,

    // Actions for file states
    setCommercialRegistrationFile: (file) =>
      set({ commercialRegistrationFile: file }),

    // Form state management
    setDocumentUpload: (info) => set({ documentUpload: info }),

    // Loading and error management
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // Reset
    resetProfile: () =>
      set({
        documentUpload: null,
        isLoading: false,
        error: null,
        commercialRegistrationFile: null,
      }),
  }));
