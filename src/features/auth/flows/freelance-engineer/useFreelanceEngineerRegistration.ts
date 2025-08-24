import { useCallback } from "react";
import { useAuthStore } from "@auth/store/authStore";
import {
  FreelanceEngineerPersonalInfo,
  FreelanceEngineerProfessionalInfo,
  FreelanceEngineerDocumentUpload,
  FreelanceEngineerEmailRegistrationInfo,
  FreelanceEngineerPhoneRegistrationInfo,
  FreelanceEngineerThirdPartyRegistrationInfo,
} from "@auth/types/freelanceEngineer";
import { authApi } from "@auth/services/authApi";
import { UserRole, UserType } from "@auth/types/auth";
import {
  FreelanceEngineerEmailRegistrationSchema,
  FreelanceEngineerPhoneRegistrationSchema,
  FreelanceEngineerThirdPartyRegistrationSchema,
  FreelanceEngineerProfessionalInfoSchema,
  FreelanceEngineerDocumentUploadSchema,
} from "@auth/utils/validation";

export const useFreelanceEngineerRegistration = () => {
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

  // Schema getters
  const getPersonalInfoSchema = useCallback(
    (method: "email" | "phone" | "thirdParty") => {
      switch (method) {
        case "email":
          return FreelanceEngineerEmailRegistrationSchema;
        case "phone":
          return FreelanceEngineerPhoneRegistrationSchema;
        case "thirdParty":
          return FreelanceEngineerThirdPartyRegistrationSchema;
        default:
          throw new Error(`Unsupported authentication method: ${method}`);
      }
    },
    []
  );

  const getProfessionalInfoSchema = useCallback(() => {
    return FreelanceEngineerProfessionalInfoSchema;
  }, []);

  const getDocumentUploadSchema = useCallback(() => {
    return FreelanceEngineerDocumentUploadSchema;
  }, []);

  // Personal info submission handler
  const handlePersonalInfoSubmit = useCallback(
    async (data: FreelanceEngineerPersonalInfo) => {
      try {
        store.setLoading(true);
        store.clearError();

        console.log("Submitting freelance engineer personal info:", data);

        const apiData = {
          fullName: `${data.firstName} ${data.lastName}`,
          nationalIdResidencyNumber: "", // This field is not in the form schema, using empty string for now
          saudiCouncilOfEngineersMembershipNumber: "", // This field is not in the form schema, using empty string for now
          mobileNumber: data.phoneNumber!,
          engineeringSpecialization: [],
          yearsOfExperience: "",
          typesOfExperience: [],
          workLocations: [],
          currentOfficeAffiliation: false,
          officeName: "",
          technicalCv: undefined,
          personalPhoto: undefined,
          saudiCouncilOfEngineersCardCopy: undefined,
          trainingCertificates: [],
          professionalCertificates: [],
          personalProfile: undefined,
          recommendationLetters: [],
          workSamples: [],
        };

        let registrationResult;
        if (store.authMethod === "email") {
          registrationResult = await authApi.registerFreelanceEngineer({
            userType: UserType.PERSONAL,
            role: UserRole.FREELANCE_ENGINEER,
            authMethod: "email",
            data: {
              ...apiData,
              email: data.email!,
              password: data.password!,
            },
          });
          store.setRoleData(
            "personalInfo",
            data as FreelanceEngineerEmailRegistrationInfo
          );
        } else if (store.authMethod === "phone") {
          registrationResult = await authApi.registerFreelanceEngineer({
            userType: UserType.PERSONAL,
            role: UserRole.FREELANCE_ENGINEER,
            authMethod: "phone",
            data: {
              ...apiData,
              mobileNumber: data.phoneNumber!,
              password: data.password!,
            },
          });
          store.setRoleData(
            "personalInfo",
            data as FreelanceEngineerPhoneRegistrationInfo
          );
        } else if (store.authMethod === "thirdParty") {
          registrationResult = await authApi.registerFreelanceEngineer({
            userType: UserType.PERSONAL,
            role: UserRole.FREELANCE_ENGINEER,
            authMethod: "thirdParty",
            data: {
              ...apiData,
              email: data.email!,
              // thirdPartyToken: data.thirdPartyToken, // Assuming this comes from the auth button
            },
          });
          store.setRoleData(
            "personalInfo",
            data as FreelanceEngineerThirdPartyRegistrationInfo
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

  // Professional info submission handler
  const handleProfessionalInfoSubmit = useCallback(
    async (data: FreelanceEngineerProfessionalInfo) => {
      try {
        store.setLoading(true);
        store.clearError();

        console.log("Submitting freelance engineer professional info:", data);

        // Store the professional info in the unified store
        store.setRoleData("professionalInfo", data);

        store.goToNextStep();
        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to submit professional info";
        store.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  // Document upload submission handler
  const handleDocumentUploadSubmit = useCallback(
    async (data: FreelanceEngineerDocumentUpload) => {
      try {
        store.setLoading(true);
        store.clearError();

        console.log("Submitting freelance engineer document upload:", data);

        // Store the document upload info in the unified store
        store.setRoleData("documentUpload", data);

        store.goToNextStep();
        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to submit document upload";
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
            : store.roleData.personalInfo?.phoneNumber;
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
          : store.roleData.personalInfo?.phoneNumber;
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
    return "Freelance Engineer Registration";
  }, []);

  const getStepDescription = useCallback(() => {
    // This would need to be implemented based on your step configuration
    return "Complete your freelance engineer registration";
  }, []);

  return {
    ...store,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    handleAuthMethodSelect,
    getPersonalInfoSchema,
    getProfessionalInfoSchema,
    getDocumentUploadSchema,
    handlePersonalInfoSubmit,
    handleProfessionalInfoSubmit,
    handleDocumentUploadSubmit,
    handleVerificationSubmit,
    handleResendCode,
    handleComplete,
    getStepProgress,
    getStepTitle,
    getStepDescription,
  };
};

export default useFreelanceEngineerRegistration;
