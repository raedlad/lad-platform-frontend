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
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email?: string;
    phoneNumber?: string;
    role: string;
    isVerified: boolean;
    // Add other common user fields
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
  userId: string;
  // Potentially return a token or other initial auth data
}

// Verification Request/Response Types
export interface VerificationRequest {
  contactInfo: string; // email or phone number
  otp: string;
}

export interface VerificationResponse {
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
  nationalIdUpload?: File; // For API, this would be a FormData entry
  // thirdPartyInfo?: { token: string; provider: string };
}

export interface InstitutionRegistrationApiData {
  companyName: string;
  commercialRegistrationNumber: string;
  phoneNumber: string;
  country: string;
  email?: string;
  password?: string;
  commercialRegistrationDocumentUpload?: File;
  // thirdPartyInfo?: { token: string; provider: string };
}

export interface FreelanceEngineerRegistrationApiData {
  fullName: string;
  nationalIdResidencyNumber: string;
  saudiCouncilOfEngineersMembershipNumber: string;
  mobileNumber: string;
  email?: string;
  password?: string;
  engineeringSpecialization: string[];
  yearsOfExperience: string;
  typesOfExperience: string[];
  workLocations: string[];
  currentOfficeAffiliation: boolean;
  officeName?: string;
  technicalCv?: File;
  personalPhoto?: File;
  saudiCouncilOfEngineersCardCopy?: File;
  trainingCertificates?: File[];
  professionalCertificates?: File[];
  personalProfile?: File;
  recommendationLetters?: File[];
  workSamples?: File[];
}

export interface EngineeringOfficeRegistrationApiData {
  engineeringOfficeName: string;
  professionalLicenseNumber: string;
  authorizedPersonName: string;
  authorizedPersonMobileNumber: string;
  email?: string;
  password?: string;
  authorizationForm?: File;
  officeLogo?: File;
  officeSpecializations: string[];
  yearsOfExperience: string;
  numberOfEmployees: string;
  annualProjectVolume: string;
  geographicCoverage: string[];
  officialAccreditations: boolean;
  accreditationDocument?: File;
  saudiCouncilOfEngineersLicense?: File;
  commercialRegistration?: File;
  nationalAddress?: File;
  bankAccountDetails?: File;
  vatCertificate?: File;
  previousWorkRecord?: File;
  officialContactInformation?: File;
  engineeringClassificationCertificate?: File;
  qualityCertificates?: File[];
  chamberOfCommerceMembership?: File;
  zakatAndIncomeCertificate?: File;
  companyProfile?: File;
  organizationalStructure?: File;
  additionalFiles?: File[];
}

export interface ContractorRegistrationApiData {
  companyName: string;
  commercialRegistrationNumber: string;
  authorizedPersonName: string;
  authorizedPersonMobileNumber: string;
  email?: string;
  password?: string;
  officialAuthorizationLetter?: File;
  companyLogo?: File;
  projectSizeCompleted: string;
  targetProjectSize: string[];
  totalEmployees: string;
  governmentAccreditations: boolean;
  contractorClassification: string;
  classificationFile?: File;
  workFields: string[];
  geographicSpread: string[];
  yearsOfExperience: string;
  annualProjectVolume: string;
  socialInsuranceCertificate?: File;
  commercialRegistration?: File;
  vatCertificate?: File;
  nationalAddress?: File;
  projectsAndPreviousWorkRecord?: File;
  officialContactInformation?: File;
  bankAccountDetails?: File;
  chamberOfCommerceMembership?: File;
  companyProfile?: File;
  organizationalStructure?: File;
  qualityCertificates?: File[];
  otherFiles?: File[];
}

export interface SupplierRegistrationApiData {
  commercialEstablishmentName: string;
  commercialRegistrationNumber: string;
  authorizedPersonName: string;
  authorizedPersonMobileNumber: string;
  email?: string;
  password?: string;
  officialAuthorizationLetter?: File;
  establishmentLogo?: File;
  supplyAreas: string[];
  serviceCoverage: string[];
  yearsOfExperience: string;
  governmentPrivateDealings: boolean;
  supportingDocuments?: File[];
  commercialRegistration?: File;
  vatCertificate?: File;
  nationalAddress?: File;
  bankAccountDetails?: File;
  accreditationCertificates?: File[];
  establishmentProfile?: File;
  administrativeStructure?: File;
  previousContracts?: File[];
  thankYouLetters?: File[];
  additionalCredibilityDocuments?: File[];
}

// Plan Selection Request/Response Types
export interface PlanSelectionRequest {
  userId: string;
  planType: "free" | "paid";
}

export interface PlanSelectionResponse {
  message: string;
}


