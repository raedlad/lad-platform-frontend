import { create } from "zustand";
import {
  ContractorProfileState,
  ContractorTechnicalOperationalInfo,
  ContractorDocumentUpload,
} from "../types/contractor";

export interface ContractorProfileStoreState extends ContractorProfileState {
  // UI-specific file states for document upload
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

  // Actions for file states
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

  // Form state management
  setTechnicalOperationalInfo: (
    info: ContractorTechnicalOperationalInfo
  ) => void;
  setDocumentUpload: (info: ContractorDocumentUpload) => void;

  // Loading and error management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Reset
  resetProfile: () => void;
}

export const useContractorProfileStore = create<ContractorProfileStoreState>()(
  (set) => ({
    // Initial state from ContractorProfileState
    technicalOperationalInfo: null,
    documentUpload: null,
    isLoading: false,
    error: null,

    // UI-specific file states
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

    // Actions for file states
    setSocialInsuranceCertificate: (file) =>
      set({ socialInsuranceCertificate: file }),
    setCommercialRegistration: (file) => set({ commercialRegistration: file }),
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

    // Form state management
    setTechnicalOperationalInfo: (info) =>
      set({ technicalOperationalInfo: info }),
    setDocumentUpload: (info) => set({ documentUpload: info }),

    // Loading and error management
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),

    // Reset
    resetProfile: () =>
      set({
        technicalOperationalInfo: null,
        documentUpload: null,
        isLoading: false,
        error: null,
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
      }),
  })
);
