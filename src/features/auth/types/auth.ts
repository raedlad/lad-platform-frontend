import { Country, Value } from "react-phone-number-input";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  userType: UserType;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  userType: UserType;
}

export interface OTPVerificationData {
  email: string;
  otp: string;
}

export interface PasswordResetData {
  email: string;
}

export interface NewPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export enum UserRole {
  INDIVIDUAL = "individual",
  CONTRACTOR = "contractor",
  ENGINEERING_OFFICE = "engineering_office",
  FREELANCE_ENGINEER = "freelance_engineer",
  ORGANIZATION = "organization",
}

export enum UserType {
  PERSONAL = "personal",
  BUSINESS = "business",
}

export interface AuthError {
  message: string;
  code?: string;
  field?: string;
}
// features/authentication/types/auth.ts

// الأدوار المتاحة
export type RegistrationRole =
  | "individual"
  | "organization"
  | "supplier"
  | "freelance_engineer"
  | "engineering_office"
  | "contractor";

// طرق التوثيق
export type AuthMethod = "email" | "phone" | "thirdParty";

// الحالة الأساسية المشتركة بين كل الأدوار
export interface BaseRegistrationState {
  currentRole: RegistrationRole | null;
  currentStep: string | null;
  authMethod: AuthMethod | null;
  verificationCode: string;
  isVerified: boolean;
  isLoading: boolean;
  error: string | null;
}
export interface PersonalInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
  organizationEmail?: string;
  organizationPhoneNumber?: string;
  authorizedPersonMobileNumber?: string;
}
// بيانات خاصة بكل دور (تجمع كل أنواع الـ info)
export interface RoleSpecificData {
  personalInfo?: PersonalInfo;
  phoneInfo?: Record<string, unknown>;
  thirdPartyInfo?: ThirdPartyAuthData;
  documentUpload?: DocumentUploadData;
  professionalInfo?: Record<string, unknown>;
  operationalCommercialInfo?: Record<string, unknown>;
  technicalOperationalInfo?: Record<string, unknown>;
  planSelection?: Record<string, unknown>;
  [key: string]: unknown; // مرونة لإضافة steps جديدة مستقبلاً
}
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: { [key: string]: string[] };
}

// Common Auth Request/Response Types
export interface AuthRequest {
  email?: string;
  phoneNumber?: string;
  password?: string;
  otp?: string;
  thirdPartyToken?: string;
}

export interface AuthResponse {
  message: string;
  response: {
    id: number;
    name: string;
    email: string;
    phone: string;
    user_type: string;
    status: string;
    avatar_url?: string;
    email_verified_at: string | null;
    phone_verified_at: string | null;
    account_overview: {
      verification_status: {
        verification_required: boolean;
        email_verified: boolean;
        phone_verified: boolean;
      };
      verification_required: {
        email_verification: {
          has_token: boolean;
          token_type: string;
        };
        phone_verification: {
          has_token: boolean;
          token_type: string;
        };
      };
    };

    extra: {
      tokens: {
        access_token: string;
        access_token_expires_at: string;
        access_token_expires_in: number;
        token_type: string;
        refresh_token: string;
        refresh_token_expires_at: string;
        refresh_token_expires_in: number;
      };
    };
  };
  tokens?: TokenData;
  user?: AuthUser;
  extra?: {
    tokens: TokenData;
  };
}

// Registration Request/Response Types
export interface RegistrationRequest<T> {
  userType: string;
  role: string;
  authMethod: string;
  data: T;
}

export interface RegistrationResponse {
  message: string;
  response: {
    id: number;
    name: string;
    email: string;
    phone: string;
    user_type: string;
    account_overview: {
      verification_status: {
        verification_required: boolean;
        email_verified: boolean;
        phone_verified: boolean;
      };
      verification_required: {
        email_verification: {
          has_token: boolean;
          token_type: string;
        };
        phone_verification: {
          has_token: boolean;
          token_type: string;
        };
      };
    };
    extra: {
      tokens?: {
        access_token: string;
        access_token_expires_at: string;
        access_token_expires_in: number;
        token_type: string;
        refresh_token: string;
        refresh_token_expires_at: string;
        refresh_token_expires_in: number;
      };
    };
  };
}

export interface ForgotPasswordRequest {
  email?: string;
  phone?: string;
}

export interface ForgotPasswordResponse {
  message: string;
}
// Verification Request/Response Types
export interface VerificationRequest {
  contactInfo: string; // email or phone number
  token: string;
}

export interface VerificationResponse {
  message: string;
  isVerified: boolean;
}

// New verification types based on the API response
export interface VerificationStatus {
  verification_required: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  email_verification_enabled: boolean;
  phone_verification_enabled: boolean;
  pending_actions: string[];
}

export interface VerificationRequired {
  email_verification: {
    has_token: boolean;
    token_type: string | null;
  };
  phone_verification: {
    has_token: boolean;
    token_type: string | null;
  };
}

export interface VerificationStatusResponse {
  verification_status: VerificationStatus;
  verification_required: VerificationRequired;
}

export interface VerifyPhoneRequest {
  phoneNumber: string;
  token: string;
}

export interface VerifyPhoneResponse {
  message: string;
  isVerified: boolean;
}

// Resend email verification (for existing users)
export interface ResendEmailVerificationRequest {
  email?: string; // Optional, can use current user's email
}

export interface ResendEmailVerificationResponse {
  message: string;
  success: boolean;
}

export interface VerifyEmailRequest {
  email: string;
  token: string;
}

export interface VerifyEmailResponse {
  message: string;
  isVerified: boolean;
}

// Resend OTP Request/Response Types
export interface ResendOtpRequest {
  contactInfo: string; // email or phone number
}

export interface ResendOtpResponse {
  message: string;
}

// Specific Registration Data Payloads (simplified for API)
// These should mirror the Zod schemas but be flattened for API consumption

export interface IndividualRegistrationApiData {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  password?: string;
  countryOfResidence: string;
  nationalId?: string; // For API, this would be a FormData entry
  // thirdPartyInfo?: { token: string; provider: string };
}

// Token Data Types
export interface TokenData {
  access_token: string;
  access_token_expires_at: string;
  access_token_expires_in: number;
  token_type: string;
  refresh_token: string;
  refresh_token_expires_at: string;
  refresh_token_expires_in: number;
}

// API Error Types
export type ApiError<T = any> = {
  response?: {
    data?: {
      message?: string;
      errors?: T;
      [key: string]: any;
    };
    status?: number;
    [key: string]: any;
  };
  message?: string;
  code?: string;
  [key: string]: any;
};

// Form Data Types
export interface FormDataEntry {
  key: string;
  value: string | File;
}

// Google Auth Types
export interface GoogleAuthResponse {
  credential: string;
  select_by: string;
}

export interface GoogleProfile {
  email: string;
  given_name?: string;
  givenName?: string;
  family_name?: string;
  familyName?: string;
  name?: string;
  picture?: string;
  sub: string;
}

// Third Party Auth Types
export interface ThirdPartyAuthData {
  token: string;
  provider: string;
  email?: string;
  name?: string;
  picture?: string;
  firstName?: string;
  lastName?: string;
  [key: string]: unknown;
}

// Document Upload Types
export interface DocumentUploadData {
  file: File;
  documentType: string;
  role: string;
}

// API Response Types
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  code?: string;
}

export type ApiResult<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Store Types
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  phone: string;
  user_type: string;
  country_id?: number;
  city_id?: number;
  state_id?: number;
  national_id?: string;
  detailed_address?: string;
  about_me?: string;
  avatar_url?: string;
  status: string;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  account_overview: {
    verification_status: {
      verification_required: boolean;
      email_verified: boolean;
      phone_verified: boolean;
    };
    verification_required: {
      email_verification: {
        has_token: boolean;
        token_type: string;
      };
      phone_verification: {
        has_token: boolean;
        token_type: string;
      };
    };
  };
}

// Phone Input Types
export interface PhoneInputProps {
  value?: Value;
  onChange: (value?: Value) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  defaultCountry?: Country | undefined;
  countries?: Country[];
  preferredCountries?: Country[];
  excludeCountries?: Country[];
  countryCallingCodeEditable?: boolean;
  international?: boolean;
  withCountryCallingCode?: boolean;
  countrySelectProps?: Record<string, unknown>;
  inputProps?: Record<string, unknown>;
  [key: string]: unknown;
}

// Custom Input Types
export interface CustomInputProps {
  className?: string;
  [key: string]: unknown;
}

// OTP Verification Types
export interface OTPVerificationProps {
  personalInfo: PersonalInfo;
  phoneInfo?: Record<string, unknown>;
  thirdPartyInfo?: Record<string, unknown>;
}

// Role Selector Types
export interface UserRoleOption {
  id: string;
  name?: string;
  description?: string;
  icon?: string | React.ReactElement;
  features?: string[];
  isPopular?: boolean;
  isRecommended?: boolean;
  comingSoon?: boolean;
}

// Registration Store Interface
export interface RegistrationStore {
  currentStep: string;
  authMethod: AuthMethod | null;
  personalInfo: PersonalInfo;
  phoneInfo?: Record<string, unknown>;
  thirdPartyInfo?: ThirdPartyAuthData;
  isLoading: boolean;
  error: string | null;
}
