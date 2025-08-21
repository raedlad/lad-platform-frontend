import { z } from "zod";
import { UserRole, UserType } from "./auth"; // Assuming auth.ts defines UserRole and UserType
import {
  PersonalInfoSchema,
  IndividualEmailRegistrationSchema,
  IndividualPhoneRegistrationSchema,
  IndividualThirdPartyRegistrationSchema,
  OTPVerificationSchema,
  EmailLoginSchema,
  PhoneLoginSchema,
  PasswordResetSchema,
  NewPasswordSchema,
} from "@auth/utils/validation";

// Types derived from schemas

export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type IndividualEmailRegistrationInfo = z.infer<typeof IndividualEmailRegistrationSchema>;
export type IndividualPhoneRegistrationInfo = z.infer<typeof IndividualPhoneRegistrationSchema>;
export type IndividualThirdPartyRegistrationInfo = z.infer<typeof IndividualThirdPartyRegistrationSchema>;
export type OTPVerificationInfo = z.infer<typeof OTPVerificationSchema>;
export type EmailLoginInfo = z.infer<typeof EmailLoginSchema>;
export type PhoneLoginInfo = z.infer<typeof PhoneLoginSchema>;
export type PasswordResetInfo = z.infer<typeof PasswordResetSchema>;
export type NewPasswordInfo = z.infer<typeof NewPasswordSchema>;

// Combined individual registration data (adjust as needed based on your flow)
export interface IndividualRegistrationData {
  userType: UserType.PERSONAL;
  role: UserRole.INDIVIDUAL;
  authMethod: "email" | "phone" | "thirdParty";
  personalInfo?: PersonalInfo; // Use the unified PersonalInfo type
  // You might want to store specific registration data here if needed, e.g.,
  // emailRegistrationInfo?: EmailRegistrationInfo;
  // phoneRegistrationInfo?: PhoneRegistrationInfo;
  // thirdPartyRegistrationInfo?: ThirdPartyRegistrationInfo;
  isVerified: boolean;
  verificationCode?: string;
}

// Individual registration step types
export type IndividualRegistrationStep =
  | "authMethod"
  | "personalInfo"
  | "verification"
  | "complete";

// Individual registration state (updated to use unified types)
export interface IndividualRegistrationState {
  currentStep: IndividualRegistrationStep;
  authMethod: "email" | "phone" | "thirdParty" | null;
  personalInfo: PersonalInfo | null; // Use unified PersonalInfo
  phoneInfo: PersonalInfo | null; // Added phoneInfo
  thirdPartyInfo: PersonalInfo | null; // Added thirdPartyInfo
  // Consider adding specific states for email/phone/third-party if their data structures differ significantly
  // emailRegistrationData?: EmailRegistrationInfo | null;
  // phoneRegistrationData?: PhoneRegistrationInfo | null;
  // thirdPartyRegistrationData?: ThirdPartyRegistrationInfo | null;
  verificationCode: string;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
}


