import { useCallback } from "react";
import { useAuthStore } from "@auth/store/authStore";
import {
  PersonalInfo,
  IndividualEmailRegistrationInfo,
  IndividualPhoneRegistrationInfo,
  IndividualThirdPartyRegistrationInfo,
} from "@auth/types/individual";
import { authApi } from "@auth/services/authApi";
import { UserRole, UserType } from "@auth/types/auth";
import {
  IndividualEmailRegistrationSchema,
  IndividualPhoneRegistrationSchema,
  IndividualThirdPartyRegistrationSchema,
} from "@auth/utils/validation";

export const useIndividualRegistration = () => {
  const store = useAuthStore();

  // Navigation handlers
  const goToNextStep = useCallback(() => {
    if (store.canGoToNextStep()) {
      store.goToNextStep();
    }
  }, [store]);

  const goToPreviousStep = useCallback(() => {
    if (store.canGoToPreviousStep()) {
      store.goToPreviousStep();
    }
  }, [store]);

  const goToStep = useCallback(
    (step: string) => {
      store.setCurrentStep(step);
    },
    [store]
  );

  // Auth method handlers
  const handleAuthMethodSelect = useCallback(
    (method: "email" | "phone" | "thirdParty") => {
      store.setAuthMethod(method);
      store.goToNextStep();
    },
    [store]
  );

  // Schema getter
  const getPersonalInfoSchema = useCallback(
    (method: "email" | "phone" | "thirdParty") => {
      switch (method) {
        case "email":
          return IndividualEmailRegistrationSchema;
        case "phone":
          return IndividualPhoneRegistrationSchema;
        case "thirdParty":
          return IndividualThirdPartyRegistrationSchema;
        default:
          throw new Error(`Unsupported authentication method: ${method}`);
      }
    },
    []
  );

  // Unified form submission handler
  const handlePersonalInfoSubmit = useCallback(
    async (data: PersonalInfo) => {
      try {
        store.setLoading(true);
        store.clearError();

        let registrationResult;

        if (store.authMethod === "email") {
          registrationResult = await authApi.registerIndividual({
            userType: UserType.PERSONAL,
            role: UserRole.INDIVIDUAL,
            authMethod: "email",
            data: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email!,
              password: data.password!,
              phoneNumber: data.phoneNumber!,
              countryOfResidence: "Saudi Arabia", // Default value, should be configurable
              nationalIdUpload: data.nationalIdFile,
            },
          });
          store.setRoleData(
            "personalInfo",
            data as IndividualEmailRegistrationInfo
          );
        } else if (store.authMethod === "phone") {
          registrationResult = await authApi.registerIndividual({
            userType: UserType.PERSONAL,
            role: UserRole.INDIVIDUAL,
            authMethod: "phone",
            data: {
              firstName: data.firstName,
              lastName: data.lastName,
              phoneNumber: data.phoneNumber!,
              password: data.password!,
              countryOfResidence: "Saudi Arabia", // Default value, should be configurable
              nationalIdUpload: data.nationalIdFile,
            },
          });
          store.setRoleData(
            "phoneInfo",
            data as IndividualPhoneRegistrationInfo
          );
        } else if (store.authMethod === "thirdParty") {
          if (!data.email) {
            throw new Error("Email from the third-party provider is missing.");
          }
          registrationResult = await authApi.registerIndividual({
            userType: UserType.PERSONAL,
            role: UserRole.INDIVIDUAL,
            authMethod: "thirdParty",
            data: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              phoneNumber: data.phoneNumber!,
              countryOfResidence: "Saudi Arabia", // Default value, should be configurable
              nationalIdUpload: data.nationalIdFile,
            },
          });
          store.setRoleData(
            "thirdPartyInfo",
            data as IndividualThirdPartyRegistrationInfo
          );
        } else {
          throw new Error("Authentication method not selected.");
        }

        if (registrationResult.success) {
          store.goToNextStep();
          return { success: true };
        } else {
          throw new Error(registrationResult.message || "Registration failed");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to submit personal info";
        store.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  // Verification handlers
  const handleVerificationSubmit = useCallback(
    async (code: string) => {
      try {
        store.setLoading(true);
        store.clearError();

        const contactInfo =
          store.authMethod === "email"
            ? store.roleData.personalInfo?.email
            : store.roleData.phoneInfo?.phoneNumber;
        if (!contactInfo) {
          throw new Error(
            "Contact information not available for verification."
          );
        }

        const verificationResult = await authApi.verifyOtp({
          contactInfo: contactInfo,
          otp: code,
        });

        if (verificationResult.success && verificationResult.data?.isVerified) {
          store.setIsVerified(true);
          store.goToNextStep();
          return { success: true };
        } else {
          throw new Error(
            verificationResult.message || "Invalid verification code"
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Verification failed";
        store.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  const handleResendCode = useCallback(async () => {
    try {
      store.setLoading(true);
      store.clearError();

      const contactInfo =
        store.authMethod === "email"
          ? store.roleData.personalInfo?.email
          : store.roleData.phoneInfo?.phoneNumber;
      if (!contactInfo) {
        throw new Error("Contact information not available to resend code.");
      }

      const resendResult = await authApi.resendOtp({
        contactInfo: contactInfo,
      });

      if (resendResult.success) {
        return { success: true };
      } else {
        throw new Error(resendResult.message || "Failed to resend code");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to resend code";
      store.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  // Completion handler
  const handleComplete = useCallback(() => {
    console.log("Registration completed!");
    store.resetRegistration();
    // Typically you would redirect the user here, e.g.:
    // router.push("/dashboard");
  }, [store]);

  // Utility functions
  const getStepProgress = useCallback(() => {
    const stepInfo = store.getCurrentStepInfo();
    return {
      currentStep: stepInfo.stepNumber,
      totalSteps: stepInfo.totalSteps,
      progress: stepInfo.progress,
    };
  }, [store]);

  const getStepTitle = useCallback(() => {
    // This would need to be implemented based on your step configuration
    return "Individual Registration";
  }, []);

  const getStepDescription = useCallback(() => {
    // This would need to be implemented based on your step configuration
    return "Complete your individual registration";
  }, []);

  return {
    ...store,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    handleAuthMethodSelect,
    getPersonalInfoSchema,
    handlePersonalInfoSubmit,
    handleVerificationSubmit,
    handleResendCode,
    handleComplete,
    getStepProgress,
    getStepTitle,
    getStepDescription,
  };
};

export default useIndividualRegistration;
