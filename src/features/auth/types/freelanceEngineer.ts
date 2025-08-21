import { z } from "zod";
import { UserRole, UserType } from "./auth";
import {
  FreelanceEngineerPersonalInfoSchema,
  FreelanceEngineerProfessionalInfoSchema,
  FreelanceEngineerDocumentUploadSchema,
  FreelanceEngineerEmailRegistrationSchema,
  FreelanceEngineerPhoneRegistrationSchema,
  FreelanceEngineerThirdPartyRegistrationSchema,
} from "@auth/utils/validation";

// Types derived from schemas
export type FreelanceEngineerPersonalInfo = z.infer<typeof FreelanceEngineerPersonalInfoSchema>;
export type FreelanceEngineerProfessionalInfo = z.infer<typeof FreelanceEngineerProfessionalInfoSchema>;
export type FreelanceEngineerDocumentUpload = z.infer<typeof FreelanceEngineerDocumentUploadSchema>;
export type FreelanceEngineerEmailRegistrationInfo = z.infer<typeof FreelanceEngineerEmailRegistrationSchema>;
export type FreelanceEngineerPhoneRegistrationInfo = z.infer<typeof FreelanceEngineerPhoneRegistrationSchema>;
export type FreelanceEngineerThirdPartyRegistrationInfo = z.infer<typeof FreelanceEngineerThirdPartyRegistrationSchema>;

// Combined freelance engineer registration data
export interface FreelanceEngineerRegistrationData {
  userType: UserType.PERSONAL;
  role: UserRole.FREELANCE_ENGINEER;
  authMethod: "email" | "phone" | "thirdParty";
  personalInfo?: FreelanceEngineerPersonalInfo;
  professionalInfo?: FreelanceEngineerProfessionalInfo;
  documentUpload?: FreelanceEngineerDocumentUpload;
  isVerified: boolean;
  verificationCode?: string;
}

// Freelance engineer registration step types
export type FreelanceEngineerRegistrationStep =
  | "authMethod"
  | "personalInfo"
  | "verification"
  | "professionalInfo"
  | "documentUpload"
  | "planSelection"
  | "complete";

// Freelance engineer registration state
export interface FreelanceEngineerRegistrationState {
  currentStep: FreelanceEngineerRegistrationStep;
  authMethod: "email" | "phone" | "thirdParty" | null;
  personalInfo: FreelanceEngineerPersonalInfo | null;
  professionalInfo: FreelanceEngineerProfessionalInfo | null;
  documentUpload: FreelanceEngineerDocumentUpload | null;
  verificationCode: string;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
}


