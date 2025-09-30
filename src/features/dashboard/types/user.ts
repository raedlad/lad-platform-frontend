export interface DashboardUser {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  userType: string;
  status: "active" | "pending" | "suspended";
  avatar?: string;
  isVerified: boolean;
  registrationDate: string;
  lastLogin?: string;
  account_overview?: {
    profile_status: string;
    document_status: string;
    overall_status: string;
    rejection_reasons: string[];
    verification_status: {
      verification_required: boolean;
      email_verified: boolean;
      phone_verified: boolean;
      email_verification_enabled: boolean;
      phone_verification_enabled: boolean;
      pending_actions: string[];
    };
    verification_required: {
      email_verification: {
        has_token: boolean;
        token_type: string | null;
      };
      phone_verification: {
        has_token: boolean;
        token_type: string | null;
      };
    };
  };
}

export type UserRole =
  | "individual"
  | "contractor"
  | "supplier"
  | "engineering_office"
  | "freelance_engineer"
  | "organization";

export interface UserProfile {
  id: string;
  userId: string;
  completionPercentage: number;
  isProfileComplete: boolean;
  lastUpdated: string;
}
