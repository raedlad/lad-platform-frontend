// feedback.validation message utility that uses translations
export const getProfileValidationMessages = (t: (key: string) => string) => ({
  firstName: {
    required: t("feedback.validation.firstName.required"),
    minLength: t("feedback.validation.firstName.minLength"),
  },
  lastName: {
    required: t("feedback.validation.lastName.required"),
    minLength: t("feedback.validation.lastName.minLength"),
  },
  fullName: {
    required: t("feedback.validation.fullName.required"),
    minLength: t("feedback.validation.fullName.minLength"),
    maxLength: t("feedback.validation.fullName.maxLength"),
  },
  email: {
    required: t("feedback.validation.email.required"),
    invalid: t("feedback.validation.email.invalid"),
    maxLength: t("feedback.validation.email.maxLength"),
  },
  phoneNumber: {
    required: t("feedback.validation.phoneNumber.required"),
    minLength: t("feedback.validation.phoneNumber.minLength"),
  },
  nationalId: {
    required: t("feedback.validation.nationalId.required"),
    minLength: t("feedback.validation.nationalId.minLength"),
    maxLength: t("feedback.validation.nationalId.maxLength"),
  },
  organizationName: {
    required: t("feedback.validation.organizationName.required"),
  },
  authorizedPersonName: {
    required: t("feedback.validation.authorizedPersonName.required"),
    minLength: t("feedback.validation.authorizedPersonName.minLength"),
    maxLength: t("feedback.validation.authorizedPersonName.maxLength"),
  },
  authorizedPersonPhoneNumber: {
    required: t("feedback.validation.authorizedPersonPhoneNumber.required"),
    minLength: t("feedback.validation.authorizedPersonPhoneNumber.minLength"),
    maxLength: t("feedback.validation.authorizedPersonPhoneNumber.maxLength"),
  },
  commercialRegistrationNumber: {
    required: t("feedback.validation.commercialRegistrationNumber.required"),
    maxLength: t("feedback.validation.commercialRegistrationNumber.maxLength"),
  },
  commercialEstablishmentName: {
    required: t("feedback.validation.commercialEstablishmentName.required"),
  },
  companyName: {
    required: t("feedback.validation.companyName.required"),
    maxLength: t("feedback.validation.companyName.maxLength"),
  },
  officeName: {
    required: t("feedback.validation.officeName.required"),
    maxLength: t("feedback.validation.officeName.maxLength"),
  },
  professionalLicenseNumber: {
    required: t("feedback.validation.professionalLicenseNumber.required"),
  },
  engineersAssociationNumber: {
    required: t("feedback.validation.engineersAssociationNumber.required"),
    maxLength: t("feedback.validation.engineersAssociationNumber.maxLength"),
  },
  aboutMe: {
    required: t("feedback.validation.aboutMe.required"),
    maxLength: t("feedback.validation.aboutMe.maxLength"),
  },
  engineeringType: {
    required: t("feedback.validation.engineeringType.required"),
  },
  experienceYearsRange: {
    required: t("feedback.validation.experienceYearsRange.required"),
  },
  associatedOfficeName: {
    required: t("feedback.validation.associatedOfficeName.required"),
    maxLength: t("feedback.validation.associatedOfficeName.maxLength"),
  },
  countryId: {
    required: t("feedback.validation.countryId.required"),
  },
  stateId: {
    required: t("feedback.validation.stateId.required"),
  },
  cityId: {
    required: t("feedback.validation.cityId.required"),
  },
  detailedAddress: {
    required: t("feedback.validation.detailedAddress.required"),
    maxLength: t("feedback.validation.detailedAddress.maxLength"),
  },
  vatNumber: {
    required: t("feedback.validation.vatNumber.required"),
    maxLength: t("feedback.validation.vatNumber.maxLength"),
  },
  aboutUs: {
    required: t("feedback.validation.aboutUs.required"),
    maxLength: t("feedback.validation.aboutUs.maxLength"),
  },
  // Contractor Operational Validation Messages
  executedProjectRange: {
    required: t(
      "feedback.validation.contractorOperational.executedProjectRange.required"
    ),
  },
  staffSizeRange: {
    required: t(
      "feedback.validation.contractorOperational.staffSizeRange.required"
    ),
  },
  annualProjectsRange: {
    required: t(
      "feedback.validation.contractorOperational.annualProjectsRange.required"
    ),
  },
  targetProjectValueRanges: {
    required: t(
      "feedback.validation.contractorOperational.targetProjectValueRanges.required"
    ),
  },
  workFields: {
    required: t(
      "feedback.validation.contractorOperational.workFields.required"
    ),
    yearsOfExperience: t(
      "feedback.validation.contractorOperational.workFields.yearsOfExperience"
    ),
  },
  operationalGeographicalCoverage: {
    required: t(
      "feedback.validation.contractorOperational.operationalGeographicalCoverage.required"
    ),
    countryRequired: t(
      "feedback.validation.contractorOperational.operationalGeographicalCoverage.countryRequired"
    ),
    stateRequired: t(
      "feedback.validation.contractorOperational.operationalGeographicalCoverage.stateRequired"
    ),
    cityRequired: t(
      "feedback.validation.contractorOperational.operationalGeographicalCoverage.cityRequired"
    ),
  },
  contractorGeographicCoverages: {
    required: t(
      "feedback.validation.contractorOperational.contractorGeographicCoverages.required"
    ),
    countryRequired: t(
      "feedback.validation.contractorOperational.contractorGeographicCoverages.countryRequired"
    ),
    stateRequired: t(
      "feedback.validation.contractorOperational.contractorGeographicCoverages.stateRequired"
    ),
    cityRequired: t(
      "feedback.validation.contractorOperational.contractorGeographicCoverages.cityRequired"
    ),
  },
  delegationForm: {
    required: t("feedback.validation.delegationForm.required"),
  },
  avatar: {
    required: t("feedback.validation.avatar.required"),
  },
  officeSpecializations: {
    required: t("feedback.validation.officeSpecializations.required"),
  },
  classificationFile: {
    required: t("feedback.validation.classificationFile.required"),
  },
  geographicalCoverage: {
    required: t("feedback.validation.geographicalCoverage.required"),
    countryRequired: t(
      "feedback.validation.geographicalCoverage.countryRequired"
    ),
    stateRequired: t("feedback.validation.geographicalCoverage.stateRequired"),
    cityRequired: t("feedback.validation.geographicalCoverage.cityRequired"),
  },
  representativeIdImage: {
    required: t("feedback.validation.representativeIdImage.required"),
  },
  hasGovernmentAccreditation: {
    required: t(
      "feedback.validation.contractorOperational.hasGovernmentAccreditation.required"
    ),
  },
  coversAllRegions: {
    required: t(
      "feedback.validation.contractorOperational.coversAllRegions.required"
    ),
  },
});
