import { z } from "zod";
import { UserRole, UserType } from "./auth";
import {
  InstitutionPersonalInfoSchema,
  InstitutionEmailRegistrationSchema,
  InstitutionPhoneRegistrationSchema,
  InstitutionThirdPartyRegistrationSchema,
} from "@auth/utils/validation";

// Types derived from schemas
export type InstitutionPersonalInfo = z.infer<typeof InstitutionPersonalInfoSchema>;
export type InstitutionEmailRegistrationInfo = z.infer<typeof InstitutionEmailRegistrationSchema>;
export type InstitutionPhoneRegistrationInfo = z.infer<typeof InstitutionPhoneRegistrationSchema>;
export type InstitutionThirdPartyRegistrationInfo = z.infer<typeof InstitutionThirdPartyRegistrationSchema>;

// Combined institution registration data
export interface InstitutionRegistrationData {
  userType: UserType.INSTITUTION;
  role: UserRole.INSTITUTION;
  authMethod: "email" | "phone" | "thirdParty";
  personalInfo?: InstitutionPersonalInfo;
  isVerified: boolean;
  verificationCode?: string;
}

// Institution registration step types
export type InstitutionRegistrationStep =
  | "authMethod"
  | "personalInfo"
  | "verification"
  | "complete";

// Institution registration state
export interface InstitutionRegistrationState {
  currentStep: InstitutionRegistrationStep;
  authMethod: "email" | "phone" | "thirdParty" | null;
  personalInfo: InstitutionPersonalInfo | null;
  verificationCode: string;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
}


