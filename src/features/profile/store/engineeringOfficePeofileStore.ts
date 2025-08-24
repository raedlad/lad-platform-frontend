import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  EngineeringOfficeRegistrationState,
  EngineeringOfficePersonalInfo,
  EngineeringOfficeTechnicalOperationalInfo,
  EngineeringOfficeDocumentUpload,
} from "../types/engineeringOffice";

export interface EngineeringOfficeRegistrationStoreState
  extends EngineeringOfficeRegistrationState {
  // UI-specific states
  showPassword: boolean;
  showConfirmPassword: boolean;
  authorizationForm: File | null;
  officeLogo: File | null;

  // Actions for UI states
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  setAuthorizationForm: (file: File | null) => void;
  setOfficeLogo: (file: File | null) => void;

  // Document Upload file states
  saudiCouncilOfEngineersLicense: File | null;
  commercialRegistration: File | null;
  nationalAddress: File | null;
  bankAccountDetails: File | null;
  vatCertificate: File | null;
  previousWorkRecord: File | null;
  officialContactInformation: File | null;
  engineeringClassificationCertificate: File | null;
  qualityCertificates: File[];
  chamberOfCommerceMembership: File | null;
  zakatAndIncomeCertificate: File | null;
  companyProfile: File | null;
  organizationalStructure: File | null;
  additionalFiles: File[];

  // Actions for Document Upload file states
  setSaudiCouncilOfEngineersLicense: (file: File | null) => void;
  setCommercialRegistration: (file: File | null) => void;
  setNationalAddress: (file: File | null) => void;
  setBankAccountDetails: (file: File | null) => void;
  setVatCertificate: (file: File | null) => void;
  setPreviousWorkRecord: (file: File | null) => void;
  setOfficialContactInformation: (file: File | null) => void;
  setEngineeringClassificationCertificate: (file: File | null) => void;
  setQualityCertificates: (files: File[]) => void;
  setChamberOfCommerceMembership: (file: File | null) => void;
  setZakatAndIncomeCertificate: (file: File | null) => void;
  setCompanyProfile: (file: File | null) => void;
  setOrganizationalStructure: (file: File | null) => void;
  setAdditionalFiles: (files: File[]) => void;

  // Form state management
  setPersonalInfo: (info: EngineeringOfficePersonalInfo) => void;
  setTechnicalOperationalInfo: (
    info: EngineeringOfficeTechnicalOperationalInfo
  ) => void;
  setDocumentUpload: (info: EngineeringOfficeDocumentUpload) => void;

  // Reset
  resetForm: () => void;
}

export const useEngineeringOfficeRegistrationStore =
  create<EngineeringOfficeRegistrationStoreState>()(
    devtools((set, get) => ({
      // Initial state from EngineeringOfficeRegistrationState
      currentStep: "authMethod",
      authMethod: null,
      personalInfo: null,
      technicalOperationalInfo: null,
      documentUpload: null,
      verificationCode: "",
      isVerified: false,
      isLoading: false,
      error: null,

      // UI-specific states
      showPassword: false,
      showConfirmPassword: false,
      authorizationForm: null,
      officeLogo: null,

      // Document Upload file states
      saudiCouncilOfEngineersLicense: null,
      commercialRegistration: null,
      nationalAddress: null,
      bankAccountDetails: null,
      vatCertificate: null,
      previousWorkRecord: null,
      officialContactInformation: null,
      engineeringClassificationCertificate: null,
      qualityCertificates: [],
      chamberOfCommerceMembership: null,
      zakatAndIncomeCertificate: null,
      companyProfile: null,
      organizationalStructure: null,
      additionalFiles: [],

      // Actions for UI states
      setShowPassword: (show) => set({ showPassword: show }),
      setShowConfirmPassword: (show) => set({ showConfirmPassword: show }),
      setAuthorizationForm: (file) => set({ authorizationForm: file }),
      setOfficeLogo: (file) => set({ officeLogo: file }),

      // Actions for Document Upload file states
      setSaudiCouncilOfEngineersLicense: (file: File | null) =>
        set({ saudiCouncilOfEngineersLicense: file }),
      setCommercialRegistration: (file: File | null) =>
        set({ commercialRegistration: file }),
      setNationalAddress: (file: File | null) => set({ nationalAddress: file }),
      setBankAccountDetails: (file: File | null) =>
        set({ bankAccountDetails: file }),
      setVatCertificate: (file: File | null) => set({ vatCertificate: file }),
      setPreviousWorkRecord: (file: File | null) =>
        set({ previousWorkRecord: file }),
      setOfficialContactInformation: (file: File | null) =>
        set({ officialContactInformation: file }),
      setEngineeringClassificationCertificate: (file: File | null) =>
        set({ engineeringClassificationCertificate: file }),
      setQualityCertificates: (files: File[]) =>
        set({ qualityCertificates: files }),
      setChamberOfCommerceMembership: (file: File | null) =>
        set({ chamberOfCommerceMembership: file }),
      setZakatAndIncomeCertificate: (file: File | null) =>
        set({ zakatAndIncomeCertificate: file }),
      setCompanyProfile: (file: File | null) => set({ companyProfile: file }),
      setOrganizationalStructure: (file: File | null) =>
        set({ organizationalStructure: file }),
      setAdditionalFiles: (files: File[]) => set({ additionalFiles: files }),

      // Form state management
      setPersonalInfo: (info) => set({ personalInfo: info }),
      setTechnicalOperationalInfo: (info) =>
        set({ technicalOperationalInfo: info }),
      setDocumentUpload: (info) => set({ documentUpload: info }),

      // Reset
      resetForm: () =>
        set({
          currentStep: "authMethod",
          authMethod: null,
          personalInfo: null,
          technicalOperationalInfo: null,
          documentUpload: null,
          verificationCode: "",
          isVerified: false,
          isLoading: false,
          error: null,
          showPassword: false,
          showConfirmPassword: false,
          authorizationForm: null,
          officeLogo: null,
          saudiCouncilOfEngineersLicense: null,
          commercialRegistration: null,
          nationalAddress: null,
          bankAccountDetails: null,
          vatCertificate: null,
          previousWorkRecord: null,
          officialContactInformation: null,
          engineeringClassificationCertificate: null,
          qualityCertificates: [],
          chamberOfCommerceMembership: null,
          zakatAndIncomeCertificate: null,
          companyProfile: null,
          organizationalStructure: null,
          additionalFiles: [],
        }),
    }))
  );
