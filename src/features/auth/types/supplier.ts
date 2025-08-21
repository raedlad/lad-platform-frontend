import { z } from "zod";
import { UserRole, UserType } from "./auth";
import {
  SupplierPersonalInfoSchema,
  SupplierOperationalCommercialInfoSchema,
  SupplierDocumentUploadSchema,
  SupplierEmailRegistrationSchema,
  SupplierPhoneRegistrationSchema,
  SupplierThirdPartyRegistrationSchema,
} from "@auth/utils/validation";

// Types derived from schemas
export type SupplierPersonalInfo = z.infer<typeof SupplierPersonalInfoSchema>;
export type SupplierOperationalCommercialInfo = z.infer<typeof SupplierOperationalCommercialInfoSchema>;
export type SupplierDocumentUpload = z.infer<typeof SupplierDocumentUploadSchema>;
export type SupplierEmailRegistrationInfo = z.infer<typeof SupplierEmailRegistrationSchema>;
export type SupplierPhoneRegistrationInfo = z.infer<typeof SupplierPhoneRegistrationSchema>;
export type SupplierThirdPartyRegistrationInfo = z.infer<typeof SupplierThirdPartyRegistrationSchema>;

// Combined supplier registration data
export interface SupplierRegistrationData {
  userType: UserType.INSTITUTION;
  role: UserRole.SUPPLIER;
  authMethod: "email" | "phone" | "thirdParty";
  personalInfo?: SupplierPersonalInfo;
  operationalCommercialInfo?: SupplierOperationalCommercialInfo;
  documentUpload?: SupplierDocumentUpload;
  isVerified: boolean;
  verificationCode?: string;
}

// Supplier registration step types
export type SupplierRegistrationStep =
  | "authMethod"
  | "personalInfo"
  | "verification"
  | "operationalCommercialInfo"
  | "documentUpload"
  | "planSelection"
  | "complete";

// Supplier registration state
export interface SupplierRegistrationState {
  currentStep: SupplierRegistrationStep;
  authMethod: "email" | "phone" | "thirdParty" | null;
  personalInfo: SupplierPersonalInfo | null;
  operationalCommercialInfo: SupplierOperationalCommercialInfo | null;
  documentUpload: SupplierDocumentUpload | null;
  verificationCode: string;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
}


