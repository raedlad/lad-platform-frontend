import { z } from "zod";
import { IndividualDocumentUploadSchema } from "../utils/validation";

export type IndividualDocumentUpload = z.infer<
  typeof IndividualDocumentUploadSchema
>;

// Base ProfilePersonalInfo type without validation schema
export interface IndividualProfilePersonalInfo {
  fullName: string;
  phoneNumber: string;
  email?: string;
}

// Individual Profile State - No auth-related fields
export interface IndividualProfileState {
  documentUpload: IndividualDocumentUpload | null;
  isLoading: boolean;
  error: string | null;
}

// Individual Profile Data for API
export interface IndividualProfileData {
  documentUpload?: IndividualDocumentUpload;
}

