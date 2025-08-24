import { useCallback } from "react";
import { useAuthStore } from "@auth/store/authStore";
import {
  InstitutionPersonalInfo,
  InstitutionEmailRegistrationInfo,
  InstitutionPhoneRegistrationInfo,
  InstitutionThirdPartyRegistrationInfo,
} from "@auth/types/institution";
import { authApi } from "@auth/services/authApi";
import { UserRole, UserType } from "@auth/types/auth";
import {
  InstitutionEmailRegistrationSchema,
  InstitutionPhoneRegistrationSchema,
  InstitutionThirdPartyRegistrationSchema,
} from "@auth/utils/validation";

export const useInstitutionRegistration = () => {
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
          return InstitutionEmailRegistrationSchema;
        case "phone":
          return InstitutionPhoneRegistrationSchema;
        case "thirdParty":
          return InstitutionThirdPartyRegistrationSchema;
        default:
          throw new Error(`Unsupported authentication method: ${method}`);
      }
    },
    []
  );

  // Unified form submission handler
  const handlePersonalInfoSubmit = useCallback(
    async (data: InstitutionPersonalInfo) => {
      try {
        store.setLoading(true);
        store.clearError();

        console.log("Submitting institution personal info:", data);

        const apiData = {
          companyName: data.institutionName,
          commercialRegistrationNumber: "", // This field is not in the form schema, using empty string for now
          phoneNumber: data.institutionPhoneNumber!,
          country: "Saudi Arabia", // Default value, should be configurable
          commercialRegistrationDocumentUpload: data.commercialRegistrationFile,
        };

        let registrationResult;
        if (store.authMethod === "email") {
          registrationResult = await authApi.registerInstitution({
            userType: UserType.BUSINESS,
            role: UserRole.INSTITUTION,
            authMethod: "email",
            data: {
              ...apiData,
              email: data.institutionEmail!,
              password: data.password!,
            },
          });
          store.setRoleData(
            "personalInfo",
            data as InstitutionEmailRegistrationInfo
          );
        } else if (store.authMethod === "phone") {
          registrationResult = await authApi.registerInstitution({
            userType: UserType.BUSINESS,
            role: UserRole.INSTITUTION,
            authMethod: "phone",
            data: {
              ...apiData,
              phoneNumber: data.institutionPhoneNumber!,
              password: data.password!,
            },
          });
          store.setRoleData(
            "personalInfo",
            data as InstitutionPhoneRegistrationInfo
          );
        } else if (store.authMethod === "thirdParty") {
          registrationResult = await authApi.registerInstitution({
            userType: UserType.BUSINESS,
            role: UserRole.INSTITUTION,
            authMethod: "thirdParty",
            data: {
              ...apiData,
              email: data.institutionEmail!,
              // thirdPartyToken: data.thirdPartyToken, // Assuming this comes from the auth button
            },
          });
          store.setRoleData(
            "personalInfo",
            data as InstitutionThirdPartyRegistrationInfo
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
            ? store.roleData.personalInfo?.institutionEmail
            : store.roleData.personalInfo?.institutionPhoneNumber;
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
          ? store.roleData.personalInfo?.institutionEmail
          : store.roleData.personalInfo?.institutionPhoneNumber;
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
    return "Institution Registration";
  }, []);

  const getStepDescription = useCallback(() => {
    // This would need to be implemented based on your step configuration
    return "Complete your institution registration";
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

export default useInstitutionRegistration;
