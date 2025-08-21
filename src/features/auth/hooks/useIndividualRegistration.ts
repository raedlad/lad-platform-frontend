import { useCallback } from "react";
import { useIndividualRegistrationStore } from "@auth/store/individualRegistrationStore";
import {
  PersonalInfo,
  IndividualRegistrationStep,
  IndividualEmailRegistrationInfo,
  IndividualPhoneRegistrationInfo,
  IndividualThirdPartyRegistrationInfo,
} from "@auth/types/individual";
import {
  REGISTRATION_STEPS,
  STEP_CONFIG,
} from "@auth/constants/individualRegistration";
import { authApi } from "@auth/services/authApi";
import { UserRole, UserType } from "@auth/types/auth";
import {
  IndividualEmailRegistrationSchema,
  IndividualPhoneRegistrationSchema,
  IndividualThirdPartyRegistrationSchema,
} from "../utils";

export const useIndividualRegistration = () => {
  const store = useIndividualRegistrationStore();

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
    (step: IndividualRegistrationStep) => {
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

  // Schema getter - This was already correct.
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
          // Fallback to prevent runtime errors, though it should not be reached.
          throw new Error(`Unsupported authentication method: ${method}`);
      }
    },
    []
  );

  // Unified form submission handler - CORRECTED
  const handlePersonalInfoSubmit = useCallback(
    async (data: PersonalInfo) => {
      try {
        store.setLoading(true);
        store.clearError();

        let registrationResult;

        if (store.authMethod === "email") {
          // This block was correct.
          registrationResult = await authApi.registerIndividual({
            userType: UserType.INDIVIDUAL,
            role: UserRole.INDIVIDUAL,
            authMethod: "email",
            data: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email!,
              password: data.password!,
              phoneNumber: data.phoneNumber!,
              // Add any other fields from your schema like countryOfResidence
            },
          });
          store.setPersonalInfo(data as IndividualEmailRegistrationInfo);

        } else if (store.authMethod === "phone") {
          // ✅ FIX: Removed `email` from the payload.
          // The phone registration form does not collect an email.
          registrationResult = await authApi.registerIndividual({
            userType: UserType.INDIVIDUAL,
            role: UserRole.INDIVIDUAL,
            authMethod: "phone",
            data: {
              firstName: data.firstName,
              lastName: data.lastName,
              phoneNumber: data.phoneNumber!,
              password: data.password!,
              // Add any other fields from your schema
            },
          });
          store.setPhoneInfo(data as IndividualPhoneRegistrationInfo);

        } else if (store.authMethod === "thirdParty") {
          // ✅ FIX: Removed `password` and made `email` safe.
          // The third-party form does not collect a password.
          // The email should be pre-filled from the provider.
          if (!data.email) {
            throw new Error("Email from the third-party provider is missing.");
          }
          registrationResult = await authApi.registerIndividual({
            userType: UserType.INDIVIDUAL,
            role: UserRole.INDIVIDUAL,
            authMethod: "thirdParty",
            data: {
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email, // Comes from pre-filled data
              phoneNumber: data.phoneNumber!,
              // NO password should be sent here.
              // thirdPartyToken: data.thirdPartyToken, // This would be passed separately
            },
          });
          store.setThirdPartyInfo(data as IndividualThirdPartyRegistrationInfo);

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
            ? store.personalInfo?.email
            : store.phoneInfo?.phoneNumber;
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
          ? store.personalInfo?.email
          : store.phoneInfo?.phoneNumber;
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
