import { useCallback } from "react";
import { useSupplierRegistrationStore } from "@auth/store/supplierRegistrationStore";
import {
  SupplierPersonalInfo,
  SupplierOperationalCommercialInfo,
  SupplierDocumentUpload,
  SupplierRegistrationStep,
  SupplierEmailRegistrationInfo,
  SupplierPhoneRegistrationInfo,
  SupplierThirdPartyRegistrationInfo,
} from "@auth/types/supplier";
import {
  REGISTRATION_STEPS,
  STEP_CONFIG,
} from "@auth/constants/supplierRegistration";
import { authApi } from "@auth/services/authApi";
import { UserRole, UserType } from "@auth/types/auth";

export const useSupplierRegistration = () => {
  const store = useSupplierRegistrationStore();

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
    (step: SupplierRegistrationStep) => {
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

  // Unified form submission handler for PersonalInfo
  const handlePersonalInfoSubmit = useCallback(
    async (data: SupplierPersonalInfo) => {
      try {
        store.setLoading(true);
        store.clearError();

        console.log("Submitting supplier personal info:", data);

        const apiData = {
          commercialEstablishmentName: data.commercialEstablishmentName,
          commercialRegistrationNumber: data.commercialRegistrationNumber,
          authorizedPersonName: data.authorizedPersonName,
          authorizedPersonMobileNumber: data.authorizedPersonMobileNumber,
          officialAuthorizationLetter: data.officialAuthorizationLetter,
          establishmentLogo: data.establishmentLogo,
        };

        let registrationResult;
        if (store.authMethod === "email") {
          registrationResult = await authApi.registerSupplier({
            userType: UserType.SERVICE_PROVIDER,
            role: UserRole.SUPPLIER,
            authMethod: "email",
            data: {
              ...apiData,
              email: data.email!,
              password: data.password!,
            },
          });
          store.setPersonalInfo(data as SupplierEmailRegistrationInfo);
        } else if (store.authMethod === "phone") {
          registrationResult = await authApi.registerSupplier({
            userType: UserType.SERVICE_PROVIDER,
            role: UserRole.SUPPLIER,
            authMethod: "phone",
            data: {
              ...apiData,
              email: data.email,
              password: data.password!,
            },
          });
          store.setPersonalInfo(data as SupplierPhoneRegistrationInfo);
        } else if (store.authMethod === "thirdParty") {
          registrationResult = await authApi.registerSupplier({
            userType: UserType.SERVICE_PROVIDER,
            role: UserRole.SUPPLIER,
            authMethod: "thirdParty",
            data: {
              ...apiData,
              email: data.email!,
              // thirdPartyToken: data.thirdPartyToken, // Assuming this comes from the auth button
            },
          });
          store.setPersonalInfo(data as SupplierThirdPartyRegistrationInfo);
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
            : "Failed to submit supplier personal info";
        store.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  // Handler for OperationalCommercialInfo submission
  const handleOperationalCommercialInfoSubmit = useCallback(
    async (data: SupplierOperationalCommercialInfo) => {
      try {
        store.setLoading(true);
        store.clearError();

        console.log("Submitting supplier operational/commercial info:", data);

        // In a real app, this would be an API call to update professional info
        // For now, we\"ll simulate it and store locally
        await new Promise((resolve) => setTimeout(resolve, 1000));

        store.setOperationalCommercialInfo(data);
        store.goToNextStep();

        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to submit operational/commercial info";
        store.setError(errorMessage);
        return { success: false, error: errorMessage };
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  // Handler for DocumentUpload submission
  const handleDocumentUploadSubmit = useCallback(
    async (data: SupplierDocumentUpload) => {
      try {
        store.setLoading(true);
        store.clearError();

        console.log("Submitting supplier document upload:", data);

        // In a real app, this would be an API call to upload documents
        // For now, we\"ll simulate it and store locally
        await new Promise((resolve) => setTimeout(resolve, 1000));

        store.setDocumentUpload(data);
        store.goToNextStep();

        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to upload documents";
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

        const contactInfo = store.authMethod === "email" ? store.personalInfo?.email : store.personalInfo?.authorizedPersonMobileNumber;
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

      const contactInfo = store.authMethod === "email" ? store.personalInfo?.email : store.personalInfo?.authorizedPersonMobileNumber;
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
    console.log("Supplier registration completed!");
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
    handleOperationalCommercialInfoSubmit,
    handleDocumentUploadSubmit,
    handleVerificationSubmit,
    handleResendCode,
    handleComplete,
    getStepProgress,
    getStepTitle,
    getStepDescription,
  };
};

export default useSupplierRegistration;


