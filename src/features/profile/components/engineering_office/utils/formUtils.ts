interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const handleApiError = (
  error: ApiError | unknown,
  defaultMessage: string
): string => {
  // Type guard to check if error has the expected structure
  if (error && typeof error === "object" && "response" in error) {
    const apiError = error as ApiError;
    if (apiError.response?.data?.message) {
      return apiError.response.data.message;
    }
  }

  // Check if error has a message property
  if (error && typeof error === "object" && "message" in error) {
    const errorWithMessage = error as { message: string };
    return errorWithMessage.message;
  }

  return defaultMessage;
};
