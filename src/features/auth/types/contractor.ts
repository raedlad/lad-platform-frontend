import { z } from "zod";
import { UserRole, UserType } from "./auth";
import {
  ContractorPersonalInfoSchema,
  ContractorTechnicalOperationalInfoSchema,
  ContractorDocumentUploadSchema,
  ContractorEmailRegistrationSchema,
  ContractorPhoneRegistrationSchema,
  ContractorThirdPartyRegistrationSchema,
} from "@auth/utils/validation";

// Types derived from schemas
export type ContractorPersonalInfo = z.infer<typeof ContractorPersonalInfoSchema>;
export type ContractorTechnicalOperationalInfo = z.infer<typeof ContractorTechnicalOperationalInfoSchema>;
export type ContractorDocumentUpload = z.infer<typeof ContractorDocumentUploadSchema>;
export type ContractorEmailRegistrationInfo = z.infer<typeof ContractorEmailRegistrationSchema>;
export type ContractorPhoneRegistrationInfo = z.infer<typeof ContractorPhoneRegistrationSchema>;
export type ContractorThirdPartyRegistrationInfo = z.infer<typeof ContractorThirdPartyRegistrationSchema>;

// Combined contractor registration data
export interface ContractorRegistrationData {
  userType: UserType.INSTITUTION;
  role: UserRole.CONTRACTOR;
  authMethod: "email" | "phone" | "thirdParty";
  personalInfo?: ContractorPersonalInfo;
  technicalOperationalInfo?: ContractorTechnicalOperationalInfo;
  documentUpload?: ContractorDocumentUpload;
  isVerified: boolean;
  verificationCode?: string;
}

// Contractor registration step types
export type ContractorRegistrationStep =
  | "authMethod"
  | "personalInfo"
  | "verification"
  | "technicalOperationalInfo"
  | "documentUpload"
  | "planSelection"
  | "complete";

// Contractor registration state
export interface ContractorRegistrationState {
  currentStep: ContractorRegistrationStep;
  authMethod: "email" | "phone" | "thirdParty" | null;
  personalInfo: ContractorPersonalInfo | null;
  technicalOperationalInfo: ContractorTechnicalOperationalInfo | null;
  documentUpload: ContractorDocumentUpload | null;
  verificationCode: string;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
}


