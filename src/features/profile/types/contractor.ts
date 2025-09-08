import { z } from "zod";
import {
  ContractorTechnicalOperationalInfoSchema,
  ContractorDocumentUploadSchema,
} from "../utils/validation";

// Contractor Profile Types - Professional Info + File Upload
export type ContractorTechnicalOperationalInfo = z.infer<
  typeof ContractorTechnicalOperationalInfoSchema
>;
export type ContractorDocumentUpload = z.infer<
  typeof ContractorDocumentUploadSchema
>;

export interface ContractorProfileProfessionalInfo {
  commercialRegistrationNumber: string;
  authorizedPersonName: string;
  email?: string;
  authorizedPersonPhoneNumber: string;
}

// Contractor Profile State - No auth-related fields
export interface ContractorProfileState {
  technicalOperationalInfo: ContractorTechnicalOperationalInfo | null;
  documentUpload: ContractorDocumentUpload | null;
  isLoading: boolean;
  error: string | null;
}

// Contractor Profile Data for API
export interface ContractorProfileData {
  technicalOperationalInfo?: ContractorTechnicalOperationalInfo;
  documentUpload?: ContractorDocumentUpload;
}

export interface ContractorProfilePersonalInfo {
  companyName: string;
  commercialRegistrationNumber: string;
  authorizedPersonName: string;
  authorizedPersonPhoneNumber: string;
  email: string;
  representativeEmail: string;
  delegationForm: File;
  companyLogo: File;
  country?: string;
  state?: string;
  city?: string;
}
