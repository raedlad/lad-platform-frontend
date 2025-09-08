// Profile-specific selectors - no auth-related fields

// Individual Profile Selectors
export const selectIndividualDocumentUpload = (state: any) =>
  state.documentUpload ?? null;
export const selectIndividualIsLoading = (state: any) => state.isLoading;
export const selectIndividualError = (state: any) => state.error;

// Organization Profile Selectors
export const selectOrganizationDocumentUpload = (state: any) =>
  state.documentUpload ?? null;
export const selectOrganizationIsLoading = (state: any) => state.isLoading;
export const selectOrganizationError = (state: any) => state.error;

// Freelance Engineer Profile Selectors
export const selectFreelanceEngineerProfessionalInfo = (state: any) =>
  state.professionalInfo ?? null;
export const selectFreelanceEngineerDocumentUpload = (state: any) =>
  state.documentUpload ?? null;
export const selectFreelanceEngineerIsLoading = (state: any) => state.isLoading;
export const selectFreelanceEngineerError = (state: any) => state.error;

// Engineering Office Profile Selectors
export const selectEngineeringOfficeTechnicalOperationalInfo = (state: any) =>
  state.technicalOperationalInfo ?? null;
export const selectEngineeringOfficeDocumentUpload = (state: any) =>
  state.documentUpload ?? null;
export const selectEngineeringOfficeIsLoading = (state: any) => state.isLoading;
export const selectEngineeringOfficeError = (state: any) => state.error;

// Contractor Profile Selectors
export const selectContractorTechnicalOperationalInfo = (state: any) =>
  state.technicalOperationalInfo ?? null;
export const selectContractorDocumentUpload = (state: any) =>
  state.documentUpload ?? null;
export const selectContractorIsLoading = (state: any) => state.isLoading;
export const selectContractorError = (state: any) => state.error;

// Supplier Profile Selectors
export const selectSupplierOperationalCommercialInfo = (state: any) =>
  state.operationalCommercialInfo ?? null;
export const selectSupplierDocumentUpload = (state: any) =>
  state.documentUpload ?? null;
export const selectSupplierIsLoading = (state: any) => state.isLoading;
export const selectSupplierError = (state: any) => state.error;
