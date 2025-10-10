import { useCallback } from "react";
import { useAuthStore } from "@auth/store/authStore";
import {
  AuthUser,
  PersonalInfo,
  RoleSpecificData,
  DynamicRegistrationData,
} from "@auth/types/auth";
import { authApi } from "@auth/services/authApi";
import { createValidationSchemas } from "@auth/utils/validation";
import { useTranslations } from "next-intl";
import { tokenStorage } from "@auth/utils/tokenStorage";
import { useRouter } from "next/navigation";

export const useRoleRegistration = () => {
  const store = useAuthStore();
  const router = useRouter();
  const t = useTranslations();

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
      // Only advance immediately for email/phone. For thirdParty, wait until
      // the OAuth flow returns successfully, then advance inside the Google hook.
      if (method === "email" || method === "phone") {
        store.goToNextStep();
      }
    },
    [store]
  );

  // Schema getter - returns the appropriate schema based on role
  const getPersonalInfoSchema = useCallback(
    (role: string) => {
      const validationSchemas = createValidationSchemas(t);

      switch (role) {
        case "individual":
          return validationSchemas.individualRegistrationSchema;
        case "supplier":
          return validationSchemas.supplierRegistrationSchema;
        case "engineering_office":
          return validationSchemas.engineeringOfficeRegistrationSchema;
        case "freelance_engineer":
          return validationSchemas.freelanceEngineerRegistrationSchema;
        case "contractor":
          return validationSchemas.contractorRegistrationSchema;
        case "organization":
          return validationSchemas.organizationRegistrationSchema;
        case "governmental":
          return validationSchemas.governmentalRegistrationSchema;
        default:
          return validationSchemas.baseRegistrationSchema;
      }
    },
    [t]
  );

  // Unified form submission handler
  const handlePersonalInfoSubmit = useCallback(
    async (data: PersonalInfo, role: string) => {
      try {
        store.setLoading(true);
        store.clearError();

        // Store personal info in store for persistence
        store.setRoleData("personalInfo", data as unknown as Record<string, unknown>);

        // Prepare data based on role
        const registrationData: DynamicRegistrationData = {
          first_name: data.first_name!,
          last_name: data.last_name!,
          email: data.email!,
          password: data.password!,
          password_confirmation: data.password!,
          phone: data.phone!,
          phone_code: data.phone_code,
          country_id: data.country_id || "SA", // Default to Saudi Arabia
        };

        // Add role-specific fields
        if (role === "individual") {
          registrationData.national_id = data.national_id || "";
        } else if (role === "supplier") {
          registrationData.business_name = data.business_name || "";
          registrationData.commercial_register_number =
            data.commercial_register_number || "";
          registrationData.commercial_register_file =
            data.commercial_register_file;
        } else if (role === "contractor") {
          registrationData.business_name = data.business_name || "";
          registrationData.commercial_register_number =
            data.commercial_register_number || "";
          registrationData.commercial_register_file =
            data.commercial_register_file;
        } else if (role === "engineering_office") {
          registrationData.business_name = data.business_name || "";
          registrationData.commercial_register_number =
            data.commercial_register_number || "";
          registrationData.license_number = data.license_number || "";
          registrationData.commercial_register_file =
            data.commercial_register_file;
        } else if (role === "freelance_engineer") {
          registrationData.engineers_association_number =
            data.engineers_association_number || "";
          registrationData.commercial_register_file =
            data.commercial_register_file;
        } else if (role === "organization") {
          registrationData.business_name = data.business_name || "";
          registrationData.commercial_register_number =
            data.commercial_register_number || "";
          registrationData.commercial_register_file =
            data.commercial_register_file;
        } else if (role === "governmental") {
          registrationData.commercial_register_number =
            data.commercial_register_number || "";
        }

        let registrationResult = await authApi.register(
          {
            userType: store.currentRole!,
            role: store.currentRole!,
            authMethod: store.authMethod!,
            data: registrationData,
          },
          role
        );

        if (registrationResult.success) {
          // Registration successful - now we need to verify
          const verificationData = registrationResult.data?.response;

          if (verificationData) {
            // Store intent token and code verifier from new response
            store.setVerificationToken(verificationData.intent_token);
            store.setCodeVerifier(verificationData.code_verifier);

            // Force phone verification for all registrations
            // Registration only uses phone verification, no email verification
            store.setAuthMethod("phone");
            
            const contactInfo = registrationData.phone;
            store.setVerificationContact(contactInfo);


            // Store the full registration data to send during verification
            store.setRegistrationData(registrationData);

            // Move to verification step
            store.goToNextStep();
            return { success: true };
          } else {
            throw new Error("No verification data received from server");
          }
        } else {
          // Handle backend validation errors
          if (
            registrationResult.errors &&
            Object.keys(registrationResult.errors).length > 0
          ) {
            // Check if it's only a general error (no field-specific errors)
            const errorKeys = Object.keys(registrationResult.errors);
            if (errorKeys.length === 1 && errorKeys[0] === "general") {
              // For general errors, just use the message directly
              const generalMessages = registrationResult.errors.general;
              const errorMessage = Array.isArray(generalMessages)
                ? generalMessages.join(", ")
                : generalMessages;
              throw new Error(errorMessage || registrationResult.message || "Registration failed");
            }

            // Extract field-specific errors (exclude general from field display)
            const fieldErrors = Object.entries(registrationResult.errors)
              .filter(([field]) => field !== "general") // Exclude "general" from field errors
              .map(
                ([field, messages]) =>
                  `${field}: ${
                    Array.isArray(messages) ? messages.join(", ") : messages
                  }`
              )
              .join("; ");

            throw new Error(
              fieldErrors || registrationResult.message || "Registration failed"
            );
          }

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

        // Get the contact info and auth method from the store
        const contactInfo = store.verificationContact;
        const authMethod = store.authMethod;

        if (!contactInfo) {
          throw new Error(
            "Contact information not available for verification."
          );
        }

        if (!authMethod || (authMethod !== "email" && authMethod !== "phone")) {
          throw new Error("Invalid authentication method.");
        }

        // Use the new verifyRegistrationIntent function
        const verificationResult = await authApi.verifyRegistrationIntent(
          code,
          contactInfo,
          authMethod
        );

        if (verificationResult.success && verificationResult.data?.isVerified) {
          // User data should be returned in the verification response
          const userData = verificationResult.data?.response;
          if (userData) {
            store.setUserData(userData);
            store.setIsVerified(true);
          }
          // Redirect to dashboard will be handled by useRoleRedirect
          router.push("/dashboard");
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
    [store, router]
  );

  const handleResendCode = useCallback(async () => {
    try {
      store.setLoading(true);
      store.clearError();

      // Use the new resendRegistrationOtp function
      const resendResult = await authApi.resendRegistrationOtp();

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

  const handleResendEmailVerification = useCallback(async () => {
    try {
      store.setLoading(true);
      store.clearError();

      const resendResult = await authApi.resendEmailVerification();

      if (resendResult.success) {
        return { success: true };
      } else {
        throw new Error(
          resendResult.message || "Failed to resend email verification"
        );
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to resend email verification";
      store.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      store.setLoading(false);
    }
  }, [store]);

  // Completion handler
  const handleComplete = useCallback(() => {
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
    return "Individual Registration";
  }, []);

  const getStepDescription = useCallback(() => {
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
    handleResendEmailVerification,
    handleComplete,
    getStepProgress,
    getStepTitle,
    getStepDescription,
  };
};

export default useRoleRegistration;
