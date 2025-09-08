import { z } from "zod";
import {
  FreelanceEngineerProfessionalInfoSchema,
  FreelanceEngineerDocumentUploadSchema,
} from "../utils/validation";

// Freelance Engineer Profile Types - Professional Info + File Upload
export type FreelanceEngineerProfessionalInfo = z.infer<
  typeof FreelanceEngineerProfessionalInfoSchema
>;
export type FreelanceEngineerDocumentUpload = z.infer<
  typeof FreelanceEngineerDocumentUploadSchema
>;

export interface FreelanceEngineerProfilePersonalInfo {
  fullName: string;
  email?: string;
  phoneNumber: string;
}

// Freelance Engineer Profile State - No auth-related fields
export interface FreelanceEngineerProfileState {
  professionalInfo: FreelanceEngineerProfessionalInfo | null;
  documentUpload: FreelanceEngineerDocumentUpload | null;
  isLoading: boolean;
  error: string | null;
}

// Freelance Engineer Profile Data for API
export interface FreelanceEngineerProfileData {
  professionalInfo?: FreelanceEngineerProfessionalInfo;
  documentUpload?: FreelanceEngineerDocumentUpload;
}
