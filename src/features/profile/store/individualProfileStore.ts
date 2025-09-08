import { create } from "zustand";
  
import {
  IndividualProfileState,
  IndividualDocumentUpload,
} from "../types/individual";

export interface IndividualProfileStoreState extends IndividualProfileState {
  // UI-specific file states
  nationalIdFile: File | null;

  // Actions for file states
  setNationalIdFile: (file: File | null) => void;

  // Form state management
  setDocumentUpload: (info: IndividualDocumentUpload) => void;

  // Loading and error management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Reset
  resetProfile: () => void;
}

export const useIndividualProfileStore = create<IndividualProfileStoreState>()(
  (set) => ({
    // Initial state from IndividualProfileState
    documentUpload: null,
    isLoading: false,
    error: null,

    // UI-specific file states
    nationalIdFile: null,

    // Actions for file states
    setNationalIdFile: (file) => set({ nationalIdFile: file }),

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
        nationalIdFile: null,
      }),
  })
);
