import { useState } from "react";

export const useDocumentUpload = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadDocument = async (file: File, type: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement actual document upload logic
      console.log("Uploading document:", file.name, "Type:", type);
      return { success: true, url: "mock-url" };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Document upload failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadDocument,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};

export default useDocumentUpload;
