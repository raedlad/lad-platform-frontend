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

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
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
  INSTITUTION = "institution",
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
  | "institution"
  | "supplier"
  | "freelanceEngineer"
  | "engineeringOffice"
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

// بيانات خاصة بكل دور (تجمع كل أنواع الـ info)
export interface RoleSpecificData {
  personalInfo?: Record<string, any>;
  phoneInfo?: Record<string, any>;
  thirdPartyInfo?: Record<string, any>;
  documentUpload?: Record<string, any>;
  professionalInfo?: Record<string, any>;
  operationalCommercialInfo?: Record<string, any>;
  technicalOperationalInfo?: Record<string, any>;
  planSelection?: Record<string, any>;
  [key: string]: any; // مرونة لإضافة steps جديدة مستقبلاً
}
