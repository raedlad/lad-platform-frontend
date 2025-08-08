import { User, UserRole, UserType } from "./auth";

export interface UserProfile extends User {
  // Additional profile fields
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
}

export interface UserPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  language: string;
  timezone: string;
  theme: "light" | "dark" | "system";
}

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: string;
  createdAt: string;
  lastActivity: string;
  userAgent?: string;
  ipAddress?: string;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  description: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface UserStats {
  userId: string;
  totalProjects: number;
  completedProjects: number;
  activeProjects: number;
  totalEarnings: number;
  rating: number;
  reviewCount: number;
  memberSince: string;
  lastActive: string;
}

export type UserRoleType = UserRole;
export type UserTypeType = UserType;
