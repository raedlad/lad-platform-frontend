"use client";
export const getProjectValidationMessages = (t: (key: string) => string) => ({
  projectName: {
    minLength: t("feedback.validation.projectName.minLength"),
    required: t("feedback.validation.projectName.required"),
  },
  projectType: {
    minLength: t("feedback.validation.projectType.minLength"),
    required: t("feedback.validation.projectType.required"),
  },
  city: {
    minLength: t("feedback.validation.city.minLength"),
    required: t("feedback.validation.city.required"),
  },
  district: {
    minLength: t("feedback.validation.district.minLength"),
    required: t("feedback.validation.district.required"),
  },
  location: {
    minLength: t("feedback.validation.location.minLength"),
    required: t("feedback.validation.location.required"),
  },
  budget: {
    minLength: t("feedback.validation.budget.minLength"),
    required: t("feedback.validation.budget.required"),
  },
  duration: {
    minLength: t("feedback.validation.duration.minLength"),
    required: t("feedback.validation.duration.required"),
  },
  area_sqm: {
    minLength: t("feedback.validation.area_sqm.minLength"),
    required: t("feedback.validation.area_sqm.required"),
  },
  description: {
    minLength: t("feedback.validation.description.minLength"),
    required: t("feedback.validation.description.required"),
  },
  jobId: {
    required: t("feedback.validation.jobId.required"),
  },
  levelId: {
    required: t("feedback.validation.levelId.required"),
  },
  workTypeId: {
    required: t("feedback.validation.workTypeId.required"),
  },
  notes: {
    minLength: t("feedback.validation.notes.minLength"),
  },
  // File upload validation messages
  architectural_plans: {
    maxSize: t("feedback.validation.architectural_plans.maxSize"),
    maxFiles: t("feedback.validation.architectural_plans.maxFiles"),
    minFiles: t("feedback.validation.architectural_plans.minFiles"),
    invalidType: t("feedback.validation.architectural_plans.invalidType"),
  },
  licenses: {
    maxSize: t("feedback.validation.licenses.maxSize"),
    maxFiles: t("feedback.validation.licenses.maxFiles"),
    minFiles: t("feedback.validation.licenses.minFiles"),
    invalidType: t("feedback.validation.licenses.invalidType"),
  },
  specifications: {
    maxSize: t("feedback.validation.specifications.maxSize"),
    maxFiles: t("feedback.validation.specifications.maxFiles"),
    minFiles: t("feedback.validation.specifications.minFiles"),
    invalidType: t("feedback.validation.specifications.invalidType"),
  },
  site_photos: {
    minFiles: t("feedback.validation.site_photos.minFiles"),
    maxFiles: t("feedback.validation.site_photos.maxFiles"),
    maxSize: t("feedback.validation.site_photos.maxSize"),
    invalidType: t("feedback.validation.site_photos.invalidType"),
  },
});
