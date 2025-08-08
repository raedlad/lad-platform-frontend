import { useState } from "react";

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // TODO: Implement actual Google OAuth logic
      console.log("Google sign-in initiated");
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Google sign-in failed";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    isLoading,
    error,
    clearError: () => setError(null),
  };
};

export default useGoogleAuth;
