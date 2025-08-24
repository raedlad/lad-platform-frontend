import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  SupplierRegistrationState,
  SupplierPersonalInfo,
  SupplierOperationalCommercialInfo,
  SupplierDocumentUpload,
} from "../types/supplier";

export interface SupplierRegistrationStoreState
  extends SupplierRegistrationState {
  // UI-specific states
  showPassword: boolean;
  showConfirmPassword: boolean;
  officialAuthorizationLetter: File | null;
  establishmentLogo: File | null;

  // Document Upload file states
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

  // Actions for UI states
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  setOfficialAuthorizationLetter: (file: File | null) => void;
  setEstablishmentLogo: (file: File | null) => void;

  // Actions for Document Upload file states
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
  setPersonalInfo: (info: SupplierPersonalInfo) => void;
  setOperationalCommercialInfo: (
    info: SupplierOperationalCommercialInfo
  ) => void;
  setDocumentUpload: (info: SupplierDocumentUpload) => void;

  // Reset
  resetForm: () => void;
}

export const useSupplierRegistrationStore =
  create<SupplierRegistrationStoreState>()(
    devtools((set, get) => ({
      // Initial state from SupplierRegistrationState
      currentStep: "authMethod",
      authMethod: null,
      personalInfo: null,
      operationalCommercialInfo: null,
      documentUpload: null,
      verificationCode: "",
      isVerified: false,
      isLoading: false,
      error: null,

      // UI-specific states
      showPassword: false,
      showConfirmPassword: false,
      officialAuthorizationLetter: null,
      establishmentLogo: null,

      // Document Upload file states
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

      // Actions for UI states
      setShowPassword: (show) => set({ showPassword: show }),
      setShowConfirmPassword: (show) => set({ showConfirmPassword: show }),
      setOfficialAuthorizationLetter: (file) =>
        set({ officialAuthorizationLetter: file }),
      setEstablishmentLogo: (file) => set({ establishmentLogo: file }),

      // Actions for Document Upload file states
      setCommercialRegistration: (file: File | null) =>
        set({ commercialRegistration: file }),
      setVatCertificate: (file: File | null) => set({ vatCertificate: file }),
      setNationalAddress: (file: File | null) => set({ nationalAddress: file }),
      setBankAccountDetails: (file: File | null) =>
        set({ bankAccountDetails: file }),
      setAccreditationCertificates: (files: File[]) =>
        set({ accreditationCertificates: files }),
      setEstablishmentProfile: (file: File | null) =>
        set({ establishmentProfile: file }),
      setAdministrativeStructure: (file: File | null) =>
        set({ administrativeStructure: file }),
      setPreviousContracts: (files: File[]) =>
        set({ previousContracts: files }),
      setThankYouLetters: (files: File[]) => set({ thankYouLetters: files }),
      setAdditionalCredibilityDocuments: (files: File[]) =>
        set({ additionalCredibilityDocuments: files }),

      // Form state management
      setPersonalInfo: (info) => set({ personalInfo: info }),
      setOperationalCommercialInfo: (info) =>
        set({ operationalCommercialInfo: info }),
      setDocumentUpload: (info) => set({ documentUpload: info }),

      // Reset
      resetForm: () =>
        set({
          currentStep: "authMethod",
          authMethod: null,
          personalInfo: null,
          operationalCommercialInfo: null,
          documentUpload: null,
          verificationCode: "",
          isVerified: false,
          isLoading: false,
          error: null,
          showPassword: false,
          showConfirmPassword: false,
          officialAuthorizationLetter: null,
          establishmentLogo: null,
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
    }))
  );
