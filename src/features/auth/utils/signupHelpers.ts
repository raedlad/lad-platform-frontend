import { UserType, UserRole, SignupData } from "@auth/types";

export interface SignupValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface SignupFormDataExtended {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  socialProvider?: "google" | "apple" | "email";
  socialToken?: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
  marketingEmails: boolean;
  newsletter: boolean;
  userType: UserType;
  role: UserRole;
}

export const signupHelpers = {
  /**
   * Validates signup form data
   */
  validateSignupData(data: SignupFormDataExtended): SignupValidationResult {
    const errors: string[] = [];

    // Basic validation
    if (!data.firstName || data.firstName.length < 2) {
      errors.push("First name must be at least 2 characters");
    }

    if (!data.lastName || data.lastName.length < 2) {
      errors.push("Last name must be at least 2 characters");
    }

    if (!data.email || !this.isValidEmail(data.email)) {
      errors.push("Please enter a valid email address");
    }

    // Password validation for email signup
    if (data.socialProvider === "email" || !data.socialProvider) {
      if (!data.password || data.password.length < 8) {
        errors.push("Password must be at least 8 characters");
      } else if (!this.isValidPassword(data.password)) {
        errors.push(
          "Password must contain at least one uppercase letter, one lowercase letter, and one number"
        );
      }

      if (data.password !== data.confirmPassword) {
        errors.push("Passwords don't match");
      }
    }

    // Social login validation
    if (data.socialProvider && data.socialProvider !== "email") {
      if (!data.socialToken) {
        errors.push("Social login token is required");
      }
    }

    // Terms acceptance
    if (!data.acceptTerms) {
      errors.push("You must accept the terms and conditions");
    }

    if (!data.acceptPrivacy) {
      errors.push("You must accept the privacy policy");
    }

    // User type and role validation
    if (!data.userType) {
      errors.push("User type is required");
    }

    if (!data.role) {
      errors.push("User role is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Converts form data to API format
   */
  formatSignupData(data: SignupFormDataExtended): SignupData {
    return {
      email: data.email,
      password: data.password || "",
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: data.role,
      userType: data.userType,
    };
  },

  /**
   * Gets available roles for a user type
   */
  getAvailableRoles(userType: UserType): UserRole[] {
    if (userType === UserType.PERSONAL) {
      return [UserRole.INDIVIDUAL];
    }

    if (userType === UserType.BUSINESS) {
      return [
        UserRole.CONTRACTOR,
        UserRole.ENGINEERING_OFFICE,
        UserRole.FREELANCE_ENGINEER,
        UserRole.INSTITUTION,
      ];
    }

    return [];
  },

  /**
   * Validates if a role is compatible with a user type
   */
  isRoleCompatible(userType: UserType, role: UserRole): boolean {
    const availableRoles = this.getAvailableRoles(userType);
    return availableRoles.includes(role);
  },

  /**
   * Gets user type display information
   */
  getUserTypeInfo(userType: UserType) {
    const userTypeInfo = {
      [UserType.PERSONAL]: {
        title: "Personal Account",
        description: "For individual users and personal projects",
        icon: "👤",
        features: [
          "Personal project management",
          "Individual access",
          "Basic features",
        ],
      },
      [UserType.BUSINESS]: {
        title: "Business Account",
        description: "For companies, contractors, and professional services",
        icon: "🏢",
        features: [
          "Team collaboration",
          "Advanced features",
          "Professional tools",
          "Priority support",
        ],
      },
    };

    return userTypeInfo[userType];
  },

  /**
   * Gets role display information
   */
  getRoleInfo(role: UserRole) {
    const roleInfo = {
      [UserRole.INDIVIDUAL]: {
        title: "Individual",
        description: "Personal user account for individual projects",
        icon: "👤",
        features: [
          "Personal project access",
          "Individual dashboard",
          "Basic features",
        ],
      },
      [UserRole.CONTRACTOR]: {
        title: "Contractor",
        description: "For construction and contracting companies",
        icon: "🏗️",
        features: [
          "Project management",
          "Team collaboration",
          "Contract management",
          "Document handling",
        ],
      },
      [UserRole.ENGINEERING_OFFICE]: {
        title: "Engineering Office",
        description: "For engineering consulting firms",
        icon: "🏢",
        features: [
          "Engineering projects",
          "Technical documentation",
          "Client management",
          "Professional tools",
        ],
      },
      [UserRole.FREELANCE_ENGINEER]: {
        title: "Freelance Engineer",
        description: "For independent engineering professionals",
        icon: "👨‍💼",
        features: [
          "Project portfolio",
          "Client management",
          "Professional tools",
          "Flexible workflow",
        ],
      },
      [UserRole.INSTITUTION]: {
        title: "Institution",
        description: "For government and educational institutions",
        icon: "🏛️",
        features: [
          "Institutional access",
          "Multi-user management",
          "Compliance tools",
          "Reporting features",
        ],
      },
    };

    return roleInfo[role];
  },

  /**
   * Validates email format
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validates password strength
   */
  isValidPassword(password: string): boolean {
    // At least 8 characters, one uppercase, one lowercase, one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
  },

  /**
   * Validates phone number format
   */
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone);
  },

  /**
   * Masks sensitive information for display
   */
  maskEmail(email: string): string {
    const [localPart, domain] = email.split("@");
    const maskedLocal =
      localPart.slice(0, 2) + "*".repeat(localPart.length - 2);
    return `${maskedLocal}@${domain}`;
  },

  maskPhone(phone: string): string {
    return phone.replace(/(\d{3})\d{3}(\d{4})/, "$1***$2");
  },

  /**
   * Generates a random OTP code for demo purposes
   */
  generateDemoOTP(): string {
    return "123456";
  },

  /**
   * Checks if signup method is social login
   */
  isSocialSignup(socialProvider?: string): boolean {
    return socialProvider === "google" || socialProvider === "apple";
  },

  /**
   * Checks if signup method is email
   */
  isEmailSignup(socialProvider?: string): boolean {
    return socialProvider === "email" || !socialProvider;
  },
};

export default signupHelpers;
