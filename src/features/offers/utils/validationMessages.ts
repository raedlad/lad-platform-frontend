"use client";

export const getOfferValidationMessages = (t: (key: string) => string) => ({
  offerAmount: {
    required: t("feedback.validation.offers.offerAmount.required"),
    minValue: t("feedback.validation.offers.offerAmount.minValue"),
  },
  offerValidityValue: {
    required: t("feedback.validation.offers.offerValidityValue.required"),
    minValue: t("feedback.validation.offers.offerValidityValue.minValue"),
  },
  offerValidityUnit: {
    required: t("feedback.validation.offers.offerValidityUnit.required"),
  },
  executionDurationValue: {
    required: t("feedback.validation.offers.executionDurationValue.required"),
    minValue: t("feedback.validation.offers.executionDurationValue.minValue"),
  },
  executionDurationUnit: {
    required: t("feedback.validation.offers.executionDurationUnit.required"),
  },
  expectedStartDate: {
    required: t("feedback.validation.offers.expectedStartDate.required"),
  },
  expectedEndDate: {
    required: t("feedback.validation.offers.expectedEndDate.required"),
    afterStartDate: t("feedback.validation.offers.expectedEndDate.afterStartDate"),
  },
  details: {
    required: t("feedback.validation.offers.details.required"),
    minLength: t("feedback.validation.offers.details.minLength"),
  },
  qualityCertificate: {
    maxLength: t("feedback.validation.offers.qualityCertificate.maxLength"),
  },
  phases: {
    minItems: t("feedback.validation.offers.phases.minItems"),
    title: {
      required: t("feedback.validation.offers.phases.title.required"),
      minLength: t("feedback.validation.offers.phases.title.minLength"),
    },
    description: {
      required: t("feedback.validation.offers.phases.description.required"),
      minLength: t("feedback.validation.offers.phases.description.minLength"),
    },
    status: {
      required: t("feedback.validation.offers.phases.status.required"),
    },
  },
  paymentPlans: {
    minItems: t("feedback.validation.offers.paymentPlans.minItems"),
    name: {
      required: t("feedback.validation.offers.paymentPlans.name.required"),
      minLength: t("feedback.validation.offers.paymentPlans.name.minLength"),
    },
    amount: {
      required: t("feedback.validation.offers.paymentPlans.amount.required"),
      minValue: t("feedback.validation.offers.paymentPlans.amount.minValue"),
    },
    percentageOfContract: {
      required: t("feedback.validation.offers.paymentPlans.percentageOfContract.required"),
      minValue: t("feedback.validation.offers.paymentPlans.percentageOfContract.minValue"),
      maxValue: t("feedback.validation.offers.paymentPlans.percentageOfContract.maxValue"),
    },
    dueOn: {
      required: t("feedback.validation.offers.paymentPlans.dueOn.required"),
    },
    userBankAccountId: {
      required: t("feedback.validation.offers.paymentPlans.userBankAccountId.required"),
      minValue: t("feedback.validation.offers.paymentPlans.userBankAccountId.minValue"),
    },
  },
});
