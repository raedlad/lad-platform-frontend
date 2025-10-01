// Special characters constant
const SPECIAL_CHARS = '!@#$%^&*(),.?":{}|<>';

// For server-side feedback.validation or contexts where hooks can't be used
export const getValidationMessages = (
  t: (key: string, values?: Record<string, string>) => string
) => ({
  firstName: {
    required: t("feedback.validation.firstName.required"),
    minLength: t("feedback.validation.firstName.minLength"),
  },
  lastName: {
    required: t("feedback.validation.lastName.required"),
    minLength: t("feedback.validation.lastName.minLength"),
  },
  email: {
    required: t("feedback.validation.email.required"),
    invalid: t("feedback.validation.email.invalid"),
  },
  phoneNumber: {
    required: t("feedback.validation.phoneNumber.required"),
    minLength: t("feedback.validation.phoneNumber.minLength"),
  },
  emailOrPhone: {
    required: t("feedback.validation.emailOrPhone.required"),
    invalid: t("feedback.validation.emailOrPhone.invalid"),
  },
  password: {
    required: t("feedback.validation.password.required"),
    minLength: t("feedback.validation.password.minLength"),
    lowercase: t("feedback.validation.password.lowercase"),
    uppercase: t("feedback.validation.password.uppercase"),
    symbol: t("feedback.validation.password.symbol", { chars: SPECIAL_CHARS }),
  },
  confirmPassword: {
    required: t("feedback.validation.confirmPassword.required"),
    mismatch: t("feedback.validation.confirmPassword.mismatch"),
  },
  terms: {
    required: t("feedback.validation.terms.required"),
  },
  otp: {
    length: t("feedback.validation.otp.length"),
  },
});
