import { create } from "zustand";
import {
  SupplierProfileState,
  SupplierOperationalCommercialInfo,
  SupplierDocumentUpload,
} from "../types/supplier";

export interface SupplierProfileStoreState extends SupplierProfileState {
  // UI-specific file states for document upload
  commercialRegistration: File | null;
  vatCertificate: File | null;
  nationalAddress: File | null;
  bankAccountDetails: File | null;
  accreditationCertificates: File[];
  establishmentProfile: File | null;
  administrativeStructure: File | null;
  previousContracts: File[];
  thankYouLetters: File[];
  additionalCredibilityDocuments: File[];

  // Actions for file states
  setCommercialRegistration: (file: File | null) => void;
  setVatCertificate: (file: File | null) => void;
  setNationalAddress: (file: File | null) => void;
  setBankAccountDetails: (file: File | null) => void;
  setAccreditationCertificates: (files: File[]) => void;
  setEstablishmentProfile: (file: File | null) => void;
  setAdministrativeStructure: (file: File | null) => void;
  setPreviousContracts: (files: File[]) => void;
  setThankYouLetters: (files: File[]) => void;
  setAdditionalCredibilityDocuments: (files: File[]) => void;

  // Form state management
  setOperationalCommercialInfo: (
    info: SupplierOperationalCommercialInfo
  ) => void;
  setDocumentUpload: (info: SupplierDocumentUpload) => void;

  // Loading and error management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Reset
  resetProfile: () => void;
}

export const useSupplierProfileStore = create<SupplierProfileStoreState>()(
  (set) => ({
    // Initial state from SupplierProfileState
    operationalCommercialInfo: null,
    documentUpload: null,
    isLoading: false,
    error: null,

    // UI-specific file states
    commercialRegistration: null,
    vatCertificate: null,
    nationalAddress: null,
    bankAccountDetails: null,
    accreditationCertificates: [],
    establishmentProfile: null,
    administrativeStructure: null,
    previousContracts: [],
    thankYouLetters: [],
    additionalCredibilityDocuments: [],

    // Actions for file states
    setCommercialRegistration: (file) => set({ commercialRegistration: file }),
    setVatCertificate: (file) => set({ vatCertificate: file }),
    setNationalAddress: (file) => set({ nationalAddress: file }),
    setBankAccountDetails: (file) => set({ bankAccountDetails: file }),
    setAccreditationCertificates: (files) =>
      set({ accreditationCertificates: files }),
    setEstablishmentProfile: (file) => set({ establishmentProfile: file }),
    setAdministrativeStructure: (file) =>
      set({ administrativeStructure: file }),
    setPreviousContracts: (files) => set({ previousContracts: files }),
    setThankYouLetters: (files) => set({ thankYouLetters: files }),
    setAdditionalCredibilityDocuments: (files) =>
      set({ additionalCredibilityDocuments: files }),

    // Form state management
    setOperationalCommercialInfo: (info) =>
      set({ operationalCommercialInfo: info }),
    setDocumentUpload: (info) => set({ documentUpload: info }),

    // Loading and error management
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // Reset
    resetProfile: () =>
      set({
        operationalCommercialInfo: null,
        documentUpload: null,
        isLoading: false,
        error: null,
        commercialRegistration: null,
        vatCertificate: null,
        nationalAddress: null,
        bankAccountDetails: null,
        accreditationCertificates: [],
        establishmentProfile: null,
        administrativeStructure: null,
        previousContracts: [],
        thankYouLetters: [],
        additionalCredibilityDocuments: [],
      }),
  })
);
