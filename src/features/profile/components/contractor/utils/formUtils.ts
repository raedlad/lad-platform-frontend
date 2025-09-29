import { useTranslations } from "next-intl";

// Error handling utilities
export const handleApiError = (
  error: unknown,
  fallbackMessage: string
): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return fallbackMessage;
};

// Individual validation functions
export const validateWorkFields = (
  workFields: Array<{
    work_field_id: number;
    years_of_experience_in_field: number;
  }>,
  t: (key: string) => string
) => {
  const errors: Record<string, string> = {};

  if (workFields.length === 0) {
    errors.work_fields = t(
      "feedback.validation.contractorOperational.workFields.required"
    );
  } else {
    workFields.forEach((field, index) => {
      if (field.work_field_id === 0) {
        errors[`work_fields.${index}.work_field_id`] = t(
          "feedback.validation.contractorOperational.workFields.required"
        );
      }
      if (field.years_of_experience_in_field < 1) {
        errors[`work_fields.${index}.years_of_experience_in_field`] = t(
          "feedback.validation.contractorOperational.workFields.yearsOfExperience"
        );
      }
    });
  }

  return errors;
};

export const validateGeographicalCoverage = (
  geographicalCoverage: Array<{
    country_code: string;
    state_id: string;
    city_id: string;
    covers_all_areas: boolean;
  }>,
  t: (key: string) => string
) => {
  const errors: Record<string, string> = {};

  if (geographicalCoverage.length === 0) {
    errors.operational_geographical_coverage = t(
      "feedback.validation.contractorOperational.operationalGeographicalCoverage.required"
    );
  } else {
    geographicalCoverage.forEach((coverage, index) => {
      if (!coverage.country_code) {
        const errorKey = `operational_geographical_coverage.${index}.country_code`;
        const errorMessage = t(
          "feedback.validation.contractorOperational.operationalGeographicalCoverage.countryRequired"
        );
        errors[errorKey] = errorMessage;
      }
      if (!coverage.state_id) {
        const errorKey = `operational_geographical_coverage.${index}.state_id`;
        const errorMessage = t(
          "feedback.validation.contractorOperational.operationalGeographicalCoverage.stateRequired"
        );
        errors[errorKey] = errorMessage;
      }
      if (!coverage.city_id) {
        const errorKey = `operational_geographical_coverage.${index}.city_id`;
        const errorMessage = t(
          "feedback.validation.contractorOperational.operationalGeographicalCoverage.cityRequired"
        );
        errors[errorKey] = errorMessage;
      }
    });
  }

  return errors;
};

export const validateContractorCoverage = (
  contractorCoverage: Array<{
    country_code: string;
    state_id: string;
    city_id: string;
    covers_all_areas: boolean;
  }>,
  t: (key: string) => string
) => {
  const errors: Record<string, string> = {};

  if (contractorCoverage.length === 0) {
    errors.contractor_geographic_coverages = t(
      "feedback.validation.contractorOperational.contractorGeographicCoverages.required"
    );
  } else {
    contractorCoverage.forEach((coverage, index) => {
      if (!coverage.country_code) {
        errors[`contractor_geographic_coverages.${index}.country_code`] = t(
          "feedback.validation.contractorOperational.contractorGeographicCoverages.countryRequired"
        );
      }
      if (!coverage.state_id) {
        errors[`contractor_geographic_coverages.${index}.state_id`] = t(
          "feedback.validation.contractorOperational.contractorGeographicCoverages.stateRequired"
        );
      }
      if (!coverage.city_id) {
        errors[`contractor_geographic_coverages.${index}.city_id`] = t(
          "feedback.validation.contractorOperational.contractorGeographicCoverages.cityRequired"
        );
      }
    });
  }

  return errors;
};

export const validateAllArrays = (
  workFields: Array<{
    work_field_id: number;
    years_of_experience_in_field: number;
  }>,
  geographicalCoverage: Array<{
    country_code: string;
    state_id: string;
    city_id: string;
    covers_all_areas: boolean;
  }>,
  contractorCoverage: Array<{
    country_code: string;
    state_id: string;
    city_id: string;
    covers_all_areas: boolean;
  }>,
  t: (key: string) => string
) => {
  const workFieldErrors = validateWorkFields(workFields, t);
  const geographicalErrors = validateGeographicalCoverage(
    geographicalCoverage,
    t
  );
  const contractorErrors = validateContractorCoverage(contractorCoverage, t);

  return {
    ...workFieldErrors,
    ...geographicalErrors,
    ...contractorErrors,
  };
};
