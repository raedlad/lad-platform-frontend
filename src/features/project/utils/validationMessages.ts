  "use client";
export const getProjectValidationMessages = (t: (key: string) => string) => ({
  projectName: {
    minLength: t("feedback.validation.projectName.minLength"),
  },
  projectType: {
    minLength: t("feedback.validation.projectType.minLength"),
  },
  location: {
    minLength: t("feedback.validation.location.minLength"),
  },
  budget: {
    minLength: t("feedback.validation.budget.minLength"),
  },
  duration: {
    minLength: t("feedback.validation.duration.minLength"),
  },
  duration_unit: {
    minLength: t("feedback.validation.duration_unit.minLength"),
  },
  area_sqm: {
    minLength: t("feedback.validation.area_sqm.minLength"),
  },
  description: {
    minLength: t("feedback.validation.description.minLength"),
  },
  budget_unit: {
    minLength: t("feedback.validation.budget_unit.minLength"),
  },
});
