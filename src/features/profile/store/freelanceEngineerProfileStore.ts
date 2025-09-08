import { create } from "zustand";
import type {
  FreelanceEngineerProfileState,
  FreelanceEngineerProfessionalInfo,
  FreelanceEngineerDocumentUpload,
} from "../types/freelanceEngineer";

export interface FreelanceEngineerProfileStoreState
  extends FreelanceEngineerProfileState {
  // UI-specific file states for document upload
  technicalCV: File | null;
  personalPhoto: File | null;
  saudiCouncilOfEngineersCardCopy: File | null;
  trainingCertificates: File[];
  professionalCertificates: File[];
  personalProfile: File | null;
  recommendationLetters: File[];
  workSamples: File[];

  // Actions for file states
  setTechnicalCV: (file: File | null) => void;
  setPersonalPhoto: (file: File | null) => void;
  setSaudiCouncilOfEngineersCardCopy: (file: File | null) => void;
  setTrainingCertificates: (files: File[]) => void;
  setProfessionalCertificates: (files: File[]) => void;
  setPersonalProfile: (file: File | null) => void;
  setRecommendationLetters: (files: File[]) => void;
  setWorkSamples: (files: File[]) => void;

  // Form state management
  setProfessionalInfo: (info: FreelanceEngineerProfessionalInfo) => void;
  setDocumentUpload: (info: FreelanceEngineerDocumentUpload) => void;

  // Loading and error management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Reset
  resetProfile: () => void;
}

export const useFreelanceEngineerProfileStore =
  create<FreelanceEngineerProfileStoreState>()(
    (set) => ({
      // Initial state from FreelanceEngineerProfileState
      professionalInfo: null,
      documentUpload: null,
      isLoading: false,
      error: null,

      // UI-specific file states
      technicalCV: null,
      personalPhoto: null,
      saudiCouncilOfEngineersCardCopy: null,
      trainingCertificates: [],
      professionalCertificates: [],
      personalProfile: null,
      recommendationLetters: [],
      workSamples: [],

      // Actions for file states
      setTechnicalCV: (file) => set({ technicalCV: file }),
      setPersonalPhoto: (file) => set({ personalPhoto: file }),
      setSaudiCouncilOfEngineersCardCopy: (file) =>
        set({ saudiCouncilOfEngineersCardCopy: file }),
      setTrainingCertificates: (files) => set({ trainingCertificates: files }),
      setProfessionalCertificates: (files) =>
        set({ professionalCertificates: files }),
      setPersonalProfile: (file) => set({ personalProfile: file }),
      setRecommendationLetters: (files) =>
        set({ recommendationLetters: files }),
      setWorkSamples: (files) => set({ workSamples: files }),

      // Form state management
      setProfessionalInfo: (info) => set({ professionalInfo: info }),
      setDocumentUpload: (info) => set({ documentUpload: info }),

      // Loading and error management
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      // Reset
      resetProfile: () =>
        set({
          professionalInfo: null,
          documentUpload: null,
          isLoading: false,
          error: null,
          technicalCV: null,
          personalPhoto: null,
          saudiCouncilOfEngineersCardCopy: null,
          trainingCertificates: [],
          professionalCertificates: [],
          personalProfile: null,
          recommendationLetters: [],
          workSamples: [],
        }),
    })
  );
