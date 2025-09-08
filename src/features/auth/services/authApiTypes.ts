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
