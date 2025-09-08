import { create } from "zustand";
import type {
  EngineeringOfficeProfileState,
  EngineeringOfficeTechnicalOperationalInfo,
  EngineeringOfficeDocumentUpload,
} from "../types/engineeringOffice";

export interface EngineeringOfficeProfileStoreState
  extends EngineeringOfficeProfileState {
  // UI-specific file states for document upload
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

  // Actions for file states
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
  setTechnicalOperationalInfo: (
    info: EngineeringOfficeTechnicalOperationalInfo
  ) => void;
  setDocumentUpload: (info: EngineeringOfficeDocumentUpload) => void;

  // Loading and error management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Reset
  resetProfile: () => void;
}

export const useEngineeringOfficeProfileStore =
  create<EngineeringOfficeProfileStoreState>()(
    (set) => ({
      // Initial state from EngineeringOfficeProfileState
      technicalOperationalInfo: null,
      documentUpload: null,
      isLoading: false,
      error: null,

      // UI-specific file states
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

      // Actions for file states
      setSaudiCouncilOfEngineersLicense: (file) =>
        set({ saudiCouncilOfEngineersLicense: file }),
      setCommercialRegistration: (file) =>
        set({ commercialRegistration: file }),
      setNationalAddress: (file) => set({ nationalAddress: file }),
      setBankAccountDetails: (file) => set({ bankAccountDetails: file }),
      setVatCertificate: (file) => set({ vatCertificate: file }),
      setPreviousWorkRecord: (file) => set({ previousWorkRecord: file }),
      setOfficialContactInformation: (file) =>
        set({ officialContactInformation: file }),
      setEngineeringClassificationCertificate: (file) =>
        set({ engineeringClassificationCertificate: file }),
      setQualityCertificates: (files) => set({ qualityCertificates: files }),
      setChamberOfCommerceMembership: (file) =>
        set({ chamberOfCommerceMembership: file }),
      setZakatAndIncomeCertificate: (file) =>
        set({ zakatAndIncomeCertificate: file }),
      setCompanyProfile: (file) => set({ companyProfile: file }),
      setOrganizationalStructure: (file) =>
        set({ organizationalStructure: file }),
      setAdditionalFiles: (files) => set({ additionalFiles: files }),

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
    })
  );
