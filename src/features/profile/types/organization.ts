import { z } from "zod";
import { OrganizationDocumentUploadSchema } from "../utils/validation";

// Organization Profile Types - File Upload Only
export type OrganizationDocumentUpload = z.infer<
  typeof OrganizationDocumentUploadSchema
>;

export interface OrganizationProfilePersonalInfo {
  organizationName: string;
  authorizedPersonName: string;
  organizationEmail?: string;
  authorizedPersonPhoneNumber: string;
}

// Organization Profile State - No auth-related fields
export interface OrganizationProfileState {
  documentUpload: OrganizationDocumentUpload | null;
  isLoading: boolean;
  error: string | null;
}

// Organization Profile Data for API
export interface OrganizationProfileData {
  documentUpload?: OrganizationDocumentUpload;
}
