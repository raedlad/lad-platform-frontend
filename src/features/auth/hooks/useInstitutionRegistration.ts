import { useCallback } from "react";
import { useInstitutionRegistrationStore } from "@auth/store/institutionRegistrationStore";
import {
  InstitutionPersonalInfo,
  InstitutionRegistrationStep,
  InstitutionEmailRegistrationInfo,
  InstitutionPhoneRegistrationInfo,
  InstitutionThirdPartyRegistrationInfo,
} from "@auth/types/institution";
import {
  REGISTRATION_STEPS,
  STEP_CONFIG,
} from "@auth/constants/institutionRegistration";
import { authApi } from "@auth/services/authApi";
import { UserRole, UserType } from "@auth/types/auth";

export const useInstitutionRegistration = () => {
  const store = useInstitutionRegistrationStore();

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
    (step: InstitutionRegistrationStep) => {
      store.setCurrentStep(step);
    },
    [store]
  );

  // Auth method handlers
  const handleAuthMethodSelect = useCallback(
    (method: "email" | "phone" | "thirdParty") => {
      console.log("Selecting auth method:", method);
      store.setAuthMethod(method);
      console.log("Auth method set, going to next step");
      store.goToNextStep();
      console.log("Current step after going to next:", store.currentStep);
    },
    [store]
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
          commercialRegistrationNumber: data.commercialRegistrationNumber,
          phoneNumber: data.institutionPhoneNumber!,
          country: data.countryOfResidence,
          commercialRegistrationDocumentUpload: data.commercialRegistrationDocumentUpload,
        };

        let registrationResult;
        if (store.authMethod === "email") {
          registrationResult = await authApi.registerInstitution({
            userType: UserType.INSTITUTION,
            role: UserRole.INSTITUTION,
            authMethod: "email",
            data: {
              ...apiData,
              email: data.institutionEmail!,
              password: data.password!,
            },
          });
          store.setPersonalInfo(data as InstitutionEmailRegistrationInfo);
        } else if (store.authMethod === "phone") {
          registrationResult = await authApi.registerInstitution({
            userType: UserType.INSTITUTION,
            role: UserRole.INSTITUTION,
            authMethod: "phone",
            data: {
              ...apiData,
              phoneNumber: data.institutionPhoneNumber!,
              password: data.password!,
            },
          });
          store.setPersonalInfo(data as InstitutionPhoneRegistrationInfo);
        } else if (store.authMethod === "thirdParty") {
          registrationResult = await authApi.registerInstitution({
            userType: UserType.INSTITUTION,
            role: UserRole.INSTITUTION,
            authMethod: "thirdParty",
            data: {
              ...apiData,
              email: data.institutionEmail!,
              // thirdPartyToken: data.thirdPartyToken, // Assuming this comes from the auth button
            },
          });
          store.setPersonalInfo(data as InstitutionThirdPartyRegistrationInfo);
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
            : "Failed to submit institution personal info";
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

        const contactInfo = store.authMethod === "email" ? store.personalInfo?.institutionEmail : store.personalInfo?.institutionPhoneNumber;
        if (!contactInfo) {
          throw new Error("Contact information not available for verification.");
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
          throw new Error(verificationResult.message || "Invalid verification code");
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

      const contactInfo = store.authMethod === "email" ? store.personalInfo?.institutionEmail : store.personalInfo?.institutionPhoneNumber;
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
    console.log("Institution registration completed!");
    store.resetRegistration();
    // router.push("/dashboard");
  }, [store]);

  // Utility functions
  const getStepProgress = useCallback(() => {
    const currentIndex = REGISTRATION_STEPS.indexOf(store.currentStep);
    return {
      currentStep: currentIndex + 1,
      totalSteps: REGISTRATION_STEPS.length,
      progress: ((currentIndex + 1) / REGISTRATION_STEPS.length) * 100,
    };
  }, [store.currentStep]);

  const getStepTitle = useCallback(() => {
    return STEP_CONFIG[store.currentStep]?.title || "";
  }, [store.currentStep]);

  const getStepDescription = useCallback(() => {
    return STEP_CONFIG[store.currentStep]?.description || "";
  }, [store.currentStep]);

  return {
    ...store,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    handleAuthMethodSelect,
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


