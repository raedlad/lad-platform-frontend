import { useCallback } from "react";
import { useAuthStore } from "@auth/store/authStore";
import {
  EngineeringOfficePersonalInfo,
  EngineeringOfficeTechnicalOperationalInfo,
  EngineeringOfficeDocumentUpload,
  EngineeringOfficeEmailRegistrationInfo,
  EngineeringOfficePhoneRegistrationInfo,
  EngineeringOfficeThirdPartyRegistrationInfo,
} from "@auth/types/engineeringOffice";
import { authApi } from "@auth/services/authApi";
import { UserRole, UserType } from "@auth/types/auth";
import {
  EngineeringOfficeEmailRegistrationSchema,
  EngineeringOfficePhoneRegistrationSchema,
  EngineeringOfficeThirdPartyRegistrationSchema,
  EngineeringOfficeTechnicalOperationalInfoSchema,
  EngineeringOfficeDocumentUploadSchema,
} from "@auth/utils/validation";

export const useEngineeringOfficeRegistration = () => {
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
          return EngineeringOfficeEmailRegistrationSchema;
        case "phone":
          return EngineeringOfficePhoneRegistrationSchema;
        case "thirdParty":
          return EngineeringOfficeThirdPartyRegistrationSchema;
        default:
          throw new Error(`Unsupported authentication method: ${method}`);
      }
    },
    []
  );

  const getTechnicalOperationalInfoSchema = useCallback(() => {
    return EngineeringOfficeTechnicalOperationalInfoSchema;
  }, []);

  const getDocumentUploadSchema = useCallback(() => {
    return EngineeringOfficeDocumentUploadSchema;
  }, []);

  // Personal info submission handler
  const handlePersonalInfoSubmit = useCallback(
    async (data: EngineeringOfficePersonalInfo) => {
      try {
        store.setLoading(true);
        store.clearError();

        console.log("Submitting engineering office personal info:", data);

        const apiData = {
          engineeringOfficeName: data.officeName,
          professionalLicenseNumber: data.professionalLicenseNumber,
          authorizedPersonName: data.authorizedPersonName,
          authorizedPersonMobileNumber: data.authorizedPersonMobileNumber,
          officeSpecializations: [],
          yearsOfExperience: "",
          numberOfEmployees: "",
          annualProjectVolume: "",
          geographicCoverage: [],
          officialAccreditations: false,
          accreditationDocument: undefined,
          saudiCouncilOfEngineersLicense: undefined,
          commercialRegistration: undefined,
          nationalAddress: undefined,
          bankAccountDetails: undefined,
          vatCertificate: undefined,
          previousWorkRecord: undefined,
          officialContactInformation: undefined,
          engineeringClassificationCertificate: undefined,
          qualityCertificates: [],
          chamberOfCommerceMembership: undefined,
          zakatAndIncomeCertificate: undefined,
          companyProfile: undefined,
          organizationalStructure: undefined,
          additionalFiles: [],
        };

        let registrationResult;
        if (store.authMethod === "email") {
          registrationResult = await authApi.registerEngineeringOffice({
            userType: UserType.BUSINESS,
            role: UserRole.ENGINEERING_OFFICE,
            authMethod: "email",
            data: {
              ...apiData,
              email: data.email!,
              password: data.password!,
            },
          });
          store.setRoleData(
            "personalInfo",
            data as EngineeringOfficeEmailRegistrationInfo
          );
        } else if (store.authMethod === "phone") {
          registrationResult = await authApi.registerEngineeringOffice({
            userType: UserType.BUSINESS,
            role: UserRole.ENGINEERING_OFFICE,
            authMethod: "phone",
            data: {
              ...apiData,
              authorizedPersonMobileNumber: data.authorizedPersonMobileNumber!,
              password: data.password!,
            },
          });
          store.setRoleData(
            "personalInfo",
            data as EngineeringOfficePhoneRegistrationInfo
          );
        } else if (store.authMethod === "thirdParty") {
          registrationResult = await authApi.registerEngineeringOffice({
            userType: UserType.BUSINESS,
            role: UserRole.ENGINEERING_OFFICE,
            authMethod: "thirdParty",
            data: {
              ...apiData,
              email: data.email!,
              // thirdPartyToken: data.thirdPartyToken, // Assuming this comes from the auth button
            },
          });
          store.setRoleData(
            "personalInfo",
            data as EngineeringOfficeThirdPartyRegistrationInfo
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

  // Technical operational info submission handler
  const handleTechnicalOperationalInfoSubmit = useCallback(
    async (data: EngineeringOfficeTechnicalOperationalInfo) => {
      try {
        store.setLoading(true);
        store.clearError();

        console.log(
          "Submitting engineering office technical operational info:",
          data
        );

        // Store the technical operational info in the unified store
        store.setRoleData("technicalOperationalInfo", data);

        store.goToNextStep();
        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to submit technical operational info";
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
    async (data: EngineeringOfficeDocumentUpload) => {
      try {
        store.setLoading(true);
        store.clearError();

        console.log("Submitting engineering office document upload:", data);

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
            : store.roleData.personalInfo?.authorizedPersonMobileNumber;
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
          : store.roleData.personalInfo?.authorizedPersonMobileNumber;
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
    return "Engineering Office Registration";
  }, []);

  const getStepDescription = useCallback(() => {
    // This would need to be implemented based on your step configuration
    return "Complete your engineering office registration";
  }, []);

  return {
    ...store,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    handleAuthMethodSelect,
    getPersonalInfoSchema,
    getTechnicalOperationalInfoSchema,
    getDocumentUploadSchema,
    handlePersonalInfoSubmit,
    handleTechnicalOperationalInfoSubmit,
    handleDocumentUploadSubmit,
    handleVerificationSubmit,
    handleResendCode,
    handleComplete,
    getStepProgress,
    getStepTitle,
    getStepDescription,
  };
};

export default useEngineeringOfficeRegistration;
