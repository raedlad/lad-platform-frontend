import { UserRole, UserType } from "@auth/types";

export const roleSpecificData = {
  getRolesForUserType(userType: UserType): UserRole[] {
    switch (userType) {
      case UserType.PERSONAL:
        return [UserRole.INDIVIDUAL];
      case UserType.BUSINESS:
        return [
          UserRole.CONTRACTOR,
          UserRole.ENGINEERING_OFFICE,
          UserRole.FREELANCE_ENGINEER,
          UserRole.INSTITUTION,
        ];
      default:
        return [];
    }
  },

  getRoleDisplayName(role: UserRole): string {
    switch (role) {
      case UserRole.INDIVIDUAL:
        return "Individual";
      case UserRole.CONTRACTOR:
        return "Contractor";
      case UserRole.ENGINEERING_OFFICE:
        return "Engineering Office";
      case UserRole.FREELANCE_ENGINEER:
        return "Freelance Engineer";
      case UserRole.INSTITUTION:
        return "Institution";
      default:
        return "Unknown";
    }
  },

  getUserTypeDisplayName(userType: UserType): string {
    switch (userType) {
      case UserType.PERSONAL:
        return "Personal";
      case UserType.BUSINESS:
        return "Business";
      default:
        return "Unknown";
    }
  },

  getRoleDescription(role: UserRole): string {
    switch (role) {
      case UserRole.INDIVIDUAL:
        return "Personal user account for individual projects";
      case UserRole.CONTRACTOR:
        return "For construction and contracting companies";
      case UserRole.ENGINEERING_OFFICE:
        return "For engineering consulting firms";
      case UserRole.FREELANCE_ENGINEER:
        return "For independent engineering professionals";
      case UserRole.INSTITUTION:
        return "For government and educational institutions";
      default:
        return "";
    }
  },
};
