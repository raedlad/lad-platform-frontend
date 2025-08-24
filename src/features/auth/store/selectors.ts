import { AuthStoreState } from "./authStore";

// --- Core state selectors ---
export const selectCurrentRole = (state: AuthStoreState) => state.currentRole;
export const selectCurrentStep = (state: AuthStoreState) => state.currentStep;
export const selectAuthMethod = (state: AuthStoreState) => state.authMethod;

export const selectIsVerified = (state: AuthStoreState) => state.isVerified;
export const selectIsLoading = (state: AuthStoreState) => state.isLoading;
export const selectError = (state: AuthStoreState) => state.error;

// --- Role-specific data selectors ---
export const selectPersonalInfo = (state: AuthStoreState) =>
  state.roleData.personalInfo ?? null;

export const selectProfessionalInfo = (state: AuthStoreState) =>
  state.roleData.professionalInfo ?? null;

export const selectTechnicalOperationalInfo = (state: AuthStoreState) =>
  state.roleData.technicalOperationalInfo ?? null;

export const selectOperationalCommercialInfo = (state: AuthStoreState) =>
  state.roleData.operationalCommercialInfo ?? null;

export const selectDocumentUpload = (state: AuthStoreState) =>
  state.roleData.documentUpload ?? null;

// --- Navigation & flow ---
export const selectStepInfo = (state: AuthStoreState) =>
  state.getCurrentStepInfo();

export const selectCanGoNext = (state: AuthStoreState) =>
  state.canGoToNextStep();

export const selectCanGoPrevious = (state: AuthStoreState) =>
  state.canGoToPreviousStep();

// --- Debug / utilities ---
export const selectStoreSnapshot = (state: AuthStoreState) =>
  state.getStoreState();
