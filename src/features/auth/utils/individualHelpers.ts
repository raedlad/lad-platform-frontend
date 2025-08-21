import {
  IndividualPersonalInfo,
  IndividualPhoneInfo,
  IndividualThirdPartyInfo,
  IndividualRegistrationData,
} from "@auth/types/individual";
import { UserRole, UserType } from "@auth/types/auth";

export const individualHelpers = {
  /**
   * Validates if all required fields are filled for personal info
   */
  validatePersonalInfo(data: Partial<IndividualPersonalInfo>): boolean {
    return !!(
      data.firstName &&
      data.lastName &&
      data.email &&
      data.password &&
      data.confirmPassword &&
      data.agreeToTerms &&
      data.agreeToPrivacy
    );
  },

  /**
   * Validates if all required fields are filled for phone info
   */
  validatePhoneInfo(data: Partial<IndividualPhoneInfo>): boolean {
    return !!(
      data.firstName &&
      data.lastName &&
      data.phoneNumber &&
      data.password &&
      data.confirmPassword &&
      data.agreeToTerms &&
      data.agreeToPrivacy
    );
  },

  /**
   * Validates if all required fields are filled for third party info
   */
  validateThirdPartyInfo(data: Partial<IndividualThirdPartyInfo>): boolean {
    return !!(
      data.firstName &&
      data.lastName &&
      data.email &&
      data.agreeToTerms &&
      data.agreeToPrivacy
    );
  },

  /**
   * Formats individual registration data for API submission
   */
  formatRegistrationData(
    authMethod: "email" | "phone" | "thirdParty",
    personalInfo?: IndividualPersonalInfo,
    phoneInfo?: IndividualPhoneInfo,
    thirdPartyInfo?: IndividualThirdPartyInfo
  ): Partial<IndividualRegistrationData> {
    const baseData = {
      userType: UserType.PERSONAL,
      role: UserRole.INDIVIDUAL,
      authMethod,
      isVerified: false,
    };

    switch (authMethod) {
      case "email":
        return {
          ...baseData,
          personalInfo,
        };
      case "phone":
        return {
          ...baseData,
          phoneInfo,
        };
      case "thirdParty":
        return {
          ...baseData,
          thirdPartyInfo,
        };
      default:
        return baseData;
    }
  },

  /**
   * Gets the display name for the auth method
   */
  getAuthMethodDisplayName(method: "email" | "phone" | "thirdParty"): string {
    switch (method) {
      case "email":
        return "Email";
      case "phone":
        return "Phone";
      case "thirdParty":
        return "Third Party";
      default:
        return "Unknown";
    }
  },

  /**
   * Gets the step number for display purposes
   */
  getStepNumber(
    step: string,
    authMethod: "email" | "phone" | "thirdParty"
  ): string {
    switch (step) {
      case "authMethod":
        return "Step 1";
      case "personalInfo":
        return authMethod === "phone" ? "Step 2 of 3" : "Step 2 of 4";
      case "phoneInfo":
        return "Step 2 of 3";
      case "verification":
        return authMethod === "phone" ? "Step 3 of 3" : "Step 3 of 4";
      case "complete":
        return authMethod === "phone" ? "Complete" : "Step 4 of 4";
      default:
        return "Step";
    }
  },

  /**
   * Checks if the current step can be skipped based on auth method
   */
  canSkipStep(
    step: string,
    authMethod: "email" | "phone" | "thirdParty"
  ): boolean {
    if (authMethod === "phone") {
      // Phone flow: authMethod -> phoneInfo -> verification -> complete
      return step === "personalInfo" || step === "thirdPartyInfo";
    } else if (authMethod === "email") {
      // Email flow: authMethod -> personalInfo -> verification -> complete
      return step === "phoneInfo" || step === "thirdPartyInfo";
    } else {
      // Third party flow: authMethod -> thirdPartyInfo -> verification -> complete
      return step === "personalInfo" || step === "phoneInfo";
    }
  },
};

export default individualHelpers;
