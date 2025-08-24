import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
  ContractorRegistrationState,
  ContractorPersonalInfo,
  ContractorTechnicalOperationalInfo,
  ContractorDocumentUpload,
} from "../types/contractor";

export interface ContractorRegistrationStoreState
  extends ContractorRegistrationState {
  // UI-specific states
  showPassword: boolean;
  showConfirmPassword: boolean;
  authorizationForm: File | null;
  companyLogo: File | null;

  // Technical Operational Info file states
  classificationFile: File | null;
  socialInsuranceCertificate: File | null;
  commercialRegistration: File | null;
  vatCertificate: File | null;
  nationalAddress: File | null;
  projectsAndPreviousWorkRecord: File | null;
  officialContactInformation: File | null;
  bankAccountDetails: File | null;
  chamberOfCommerceMembership: File | null;
  companyProfile: File | null;
  organizationalStructure: File | null;
  qualityCertificates: File[];
  otherFiles: File[];

  // Document Upload file states
  documentUploadSocialInsuranceCertificate: File | null;
  documentUploadCommercialRegistration: File | null;
  documentUploadVatCertificate: File | null;
  documentUploadNationalAddress: File | null;
  documentUploadProjectsAndPreviousWorkRecord: File | null;
  documentUploadOfficialContactInformation: File | null;
  documentUploadBankAccountDetails: File | null;
  documentUploadChamberOfCommerceMembership: File | null;
  documentUploadCompanyProfile: File | null;
  documentUploadOrganizationalStructure: File | null;
  documentUploadQualityCertificates: File[];
  documentUploadOtherFiles: File[];

  // Actions for UI states
  setShowPassword: (show: boolean) => void;
  setShowConfirmPassword: (show: boolean) => void;
  setAuthorizationForm: (file: File | null) => void;
  setCompanyLogo: (file: File | null) => void;

  // Actions for Technical Operational Info file states
  setClassificationFile: (file: File | null) => void;
  setSocialInsuranceCertificate: (file: File | null) => void;
  setCommercialRegistration: (file: File | null) => void;
  setVatCertificate: (file: File | null) => void;
  setNationalAddress: (file: File | null) => void;
  setProjectsAndPreviousWorkRecord: (file: File | null) => void;
  setOfficialContactInformation: (file: File | null) => void;
  setBankAccountDetails: (file: File | null) => void;
  setChamberOfCommerceMembership: (file: File | null) => void;
  setCompanyProfile: (file: File | null) => void;
  setOrganizationalStructure: (file: File | null) => void;
  setQualityCertificates: (files: File[]) => void;
  setOtherFiles: (files: File[]) => void;

  // Actions for Document Upload file states
  setDocumentUploadSocialInsuranceCertificate: (file: File | null) => void;
  setDocumentUploadCommercialRegistration: (file: File | null) => void;
  setDocumentUploadVatCertificate: (file: File | null) => void;
  setDocumentUploadNationalAddress: (file: File | null) => void;
  setDocumentUploadProjectsAndPreviousWorkRecord: (file: File | null) => void;
  setDocumentUploadOfficialContactInformation: (file: File | null) => void;
  setDocumentUploadBankAccountDetails: (file: File | null) => void;
  setDocumentUploadChamberOfCommerceMembership: (file: File | null) => void;
  setDocumentUploadCompanyProfile: (file: File | null) => void;
  setDocumentUploadOrganizationalStructure: (file: File | null) => void;
  setDocumentUploadQualityCertificates: (files: File[]) => void;
  setDocumentUploadOtherFiles: (files: File[]) => void;

  // Form state management
  setPersonalInfo: (info: ContractorPersonalInfo) => void;
  setTechnicalOperationalInfo: (
    info: ContractorTechnicalOperationalInfo
  ) => void;
  setDocumentUpload: (info: ContractorDocumentUpload) => void;

  // Reset
  resetForm: () => void;
}

export const useContractorRegistrationStore =
  create<ContractorRegistrationStoreState>()(
    devtools((set, get) => ({
      // Initial state from ContractorRegistrationState
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
      companyLogo: null,

      // Technical Operational Info file states
      classificationFile: null,
      socialInsuranceCertificate: null,
      commercialRegistration: null,
      vatCertificate: null,
      nationalAddress: null,
      projectsAndPreviousWorkRecord: null,
      officialContactInformation: null,
      bankAccountDetails: null,
      chamberOfCommerceMembership: null,
      companyProfile: null,
      organizationalStructure: null,
      qualityCertificates: [],
      otherFiles: [],

      // Document Upload file states
      documentUploadSocialInsuranceCertificate: null,
      documentUploadCommercialRegistration: null,
      documentUploadVatCertificate: null,
      documentUploadNationalAddress: null,
      documentUploadProjectsAndPreviousWorkRecord: null,
      documentUploadOfficialContactInformation: null,
      documentUploadBankAccountDetails: null,
      documentUploadChamberOfCommerceMembership: null,
      documentUploadCompanyProfile: null,
      documentUploadOrganizationalStructure: null,
      documentUploadQualityCertificates: [],
      documentUploadOtherFiles: [],

      // Actions for UI states
      setShowPassword: (show) => set({ showPassword: show }),
      setShowConfirmPassword: (show) => set({ showConfirmPassword: show }),
      setAuthorizationForm: (file) => set({ authorizationForm: file }),
      setCompanyLogo: (file) => set({ companyLogo: file }),

      // Actions for Technical Operational Info file states
      setClassificationFile: (file) => set({ classificationFile: file }),
      setSocialInsuranceCertificate: (file) =>
        set({ socialInsuranceCertificate: file }),
      setCommercialRegistration: (file) =>
        set({ commercialRegistration: file }),
      setVatCertificate: (file) => set({ vatCertificate: file }),
      setNationalAddress: (file) => set({ nationalAddress: file }),
      setProjectsAndPreviousWorkRecord: (file) =>
        set({ projectsAndPreviousWorkRecord: file }),
      setOfficialContactInformation: (file) =>
        set({ officialContactInformation: file }),
      setBankAccountDetails: (file) => set({ bankAccountDetails: file }),
      setChamberOfCommerceMembership: (file) =>
        set({ chamberOfCommerceMembership: file }),
      setCompanyProfile: (file) => set({ companyProfile: file }),
      setOrganizationalStructure: (file) =>
        set({ organizationalStructure: file }),
      setQualityCertificates: (files) => set({ qualityCertificates: files }),
      setOtherFiles: (files) => set({ otherFiles: files }),

      // Actions for Document Upload file states
      setDocumentUploadSocialInsuranceCertificate: (file: File | null) =>
        set({ documentUploadSocialInsuranceCertificate: file }),
      setDocumentUploadCommercialRegistration: (file: File | null) =>
        set({ documentUploadCommercialRegistration: file }),
      setDocumentUploadVatCertificate: (file: File | null) =>
        set({ documentUploadVatCertificate: file }),
      setDocumentUploadNationalAddress: (file: File | null) =>
        set({ documentUploadNationalAddress: file }),
      setDocumentUploadProjectsAndPreviousWorkRecord: (file: File | null) =>
        set({ documentUploadProjectsAndPreviousWorkRecord: file }),
      setDocumentUploadOfficialContactInformation: (file: File | null) =>
        set({ documentUploadOfficialContactInformation: file }),
      setDocumentUploadBankAccountDetails: (file: File | null) =>
        set({ documentUploadBankAccountDetails: file }),
      setDocumentUploadChamberOfCommerceMembership: (file: File | null) =>
        set({ documentUploadChamberOfCommerceMembership: file }),
      setDocumentUploadCompanyProfile: (file: File | null) =>
        set({ documentUploadCompanyProfile: file }),
      setDocumentUploadOrganizationalStructure: (file: File | null) =>
        set({ documentUploadOrganizationalStructure: file }),
      setDocumentUploadQualityCertificates: (files: File[]) =>
        set({ documentUploadQualityCertificates: files }),
      setDocumentUploadOtherFiles: (files: File[]) =>
        set({ documentUploadOtherFiles: files }),

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
          companyLogo: null,
          classificationFile: null,
          socialInsuranceCertificate: null,
          commercialRegistration: null,
          vatCertificate: null,
          nationalAddress: null,
          projectsAndPreviousWorkRecord: null,
          officialContactInformation: null,
          bankAccountDetails: null,
          chamberOfCommerceMembership: null,
          companyProfile: null,
          organizationalStructure: null,
          qualityCertificates: [],
          otherFiles: [],
          documentUploadSocialInsuranceCertificate: null,
          documentUploadCommercialRegistration: null,
          documentUploadVatCertificate: null,
          documentUploadNationalAddress: null,
          documentUploadProjectsAndPreviousWorkRecord: null,
          documentUploadOfficialContactInformation: null,
          documentUploadBankAccountDetails: null,
          documentUploadChamberOfCommerceMembership: null,
          documentUploadCompanyProfile: null,
          documentUploadOrganizationalStructure: null,
          documentUploadQualityCertificates: [],
          documentUploadOtherFiles: [],
        }),
    }))
  );
