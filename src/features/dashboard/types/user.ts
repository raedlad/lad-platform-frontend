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
