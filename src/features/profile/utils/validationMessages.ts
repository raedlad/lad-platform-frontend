// feedback.validation message utility that uses translations
export const getProfileValidationMessages = (t: (key: string) => string) => ({
  fullName: {
    required: t("feedback.validation.fullName.required"),
    minLength: t("feedback.validation.fullName.minLength"),
  },
  email: {
    required: t("feedback.validation.email.required"),
    invalid: t("feedback.validation.email.invalid"),
  },
  phoneNumber: {
    required: t("feedback.validation.phoneNumber.required"),
    minLength: t("feedback.validation.phoneNumber.minLength"),
  },
  nationalId: {
    minLength: t("feedback.validation.nationalId.minLength"),
  },
  organizationName: {
    required: t("feedback.validation.organizationName.required"),
  },
  authorizedPersonName: {
    required: t("feedback.validation.authorizedPersonName.required"),
    minLength: t("feedback.validation.authorizedPersonName.minLength"),
  },
  authorizedPersonPhoneNumber: {
    required: t("feedback.validation.authorizedPersonPhoneNumber.required"),
    minLength: t("feedback.validation.authorizedPersonPhoneNumber.minLength"),
  },
  commercialRegistrationNumber: {
    required: t("feedback.validation.commercialRegistrationNumber.required"),
  },
  commercialEstablishmentName: {
    required: t("feedback.validation.commercialEstablishmentName.required"),
  },
  companyName: {
    required: t("feedback.validation.companyName.required"),
  },
  officeName: {
    required: t("feedback.validation.officeName.required"),
  },
  professionalLicenseNumber: {
    required: t("feedback.validation.professionalLicenseNumber.required"),
  },
});
