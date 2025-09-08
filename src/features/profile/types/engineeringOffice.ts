import { z } from "zod";
import {
  EngineeringOfficeTechnicalOperationalInfoSchema,
  EngineeringOfficeDocumentUploadSchema,
} from "../utils/validation";

// Engineering Office Profile Types - Professional Info + File Upload
export type EngineeringOfficeTechnicalOperationalInfo = z.infer<
  typeof EngineeringOfficeTechnicalOperationalInfoSchema
>;
export type EngineeringOfficeDocumentUpload = z.infer<
  typeof EngineeringOfficeDocumentUploadSchema
>;

export interface EngineeringOfficeProfilePersonalInfo {
  officeName: string;
  authorizedPersonName: string;
  email?: string;
  authorizedPersonPhoneNumber: string;
}

// Engineering Office Profile State - No auth-related fields
export interface EngineeringOfficeProfileState {
  technicalOperationalInfo: EngineeringOfficeTechnicalOperationalInfo | null;
  documentUpload: EngineeringOfficeDocumentUpload | null;
  isLoading: boolean;
  error: string | null;
}

// Engineering Office Profile Data for API
export interface EngineeringOfficeProfileData {
  technicalOperationalInfo?: EngineeringOfficeTechnicalOperationalInfo;
  documentUpload?: EngineeringOfficeDocumentUpload;
}
