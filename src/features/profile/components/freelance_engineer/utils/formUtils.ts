// Form utility functions for error handling and validation

export const handleApiError = (error: any, defaultMessage: string): string => {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return defaultMessage;
};

export const clearValidationErrors = (
  setValidationErrors: (errors: Record<string, string>) => void,
  fieldName: string
) => {
  setValidationErrors((prev) => {
    const newErrors = { ...prev };
    delete newErrors[fieldName];
    return newErrors;
  });
};

export const setValidationError = (
  setValidationErrors: (errors: Record<string, string>) => void,
  fieldName: string,
  message: string
) => {
  setValidationErrors((prev) => ({
    ...prev,
    [fieldName]: message,
  }));
};
