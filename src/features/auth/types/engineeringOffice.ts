import { z } from "zod";
import { UserRole, UserType } from "./auth";
import {
  EngineeringOfficePersonalInfoSchema,
  EngineeringOfficeTechnicalOperationalInfoSchema,
  EngineeringOfficeDocumentUploadSchema,
  EngineeringOfficeEmailRegistrationSchema,
  EngineeringOfficePhoneRegistrationSchema,
  EngineeringOfficeThirdPartyRegistrationSchema,
} from "@auth/utils/validation";

// Types derived from schemas
export type EngineeringOfficePersonalInfo = z.infer<typeof EngineeringOfficePersonalInfoSchema>;
export type EngineeringOfficeTechnicalOperationalInfo = z.infer<typeof EngineeringOfficeTechnicalOperationalInfoSchema>;
export type EngineeringOfficeDocumentUpload = z.infer<typeof EngineeringOfficeDocumentUploadSchema>;
export type EngineeringOfficeEmailRegistrationInfo = z.infer<typeof EngineeringOfficeEmailRegistrationSchema>;
export type EngineeringOfficePhoneRegistrationInfo = z.infer<typeof EngineeringOfficePhoneRegistrationSchema>;
export type EngineeringOfficeThirdPartyRegistrationInfo = z.infer<typeof EngineeringOfficeThirdPartyRegistrationSchema>;

// Combined engineering office registration data
export interface EngineeringOfficeRegistrationData {
  userType: UserType.INSTITUTION;
  role: UserRole.ENGINEERING_OFFICE;
  authMethod: "email" | "phone" | "thirdParty";
  personalInfo?: EngineeringOfficePersonalInfo;
  technicalOperationalInfo?: EngineeringOfficeTechnicalOperationalInfo;
  documentUpload?: EngineeringOfficeDocumentUpload;
  isVerified: boolean;
  verificationCode?: string;
}

// Engineering office registration step types
export type EngineeringOfficeRegistrationStep =
  | "authMethod"
  | "personalInfo"
  | "verification"
  | "technicalOperationalInfo"
  | "documentUpload"
  | "planSelection"
  | "complete";

// Engineering office registration state
export interface EngineeringOfficeRegistrationState {
  currentStep: EngineeringOfficeRegistrationStep;
  authMethod: "email" | "phone" | "thirdParty" | null;
  personalInfo: EngineeringOfficePersonalInfo | null;
  technicalOperationalInfo: EngineeringOfficeTechnicalOperationalInfo | null;
  documentUpload: EngineeringOfficeDocumentUpload | null;
  verificationCode: string;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
}


