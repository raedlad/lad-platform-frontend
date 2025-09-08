import { useDashboardStore } from "../store/dashboardStore";

export function useProfile() {
  const {
    user,
    isLoading,
    error,
    setUser,
    updateUser,
    setLoading,
    setError,
    clearError,
    calculateProfileCompletion,
  } = useDashboardStore();

  const updateProfileCompletion = () => {
    const completion = calculateProfileCompletion();
    if (user) {
      updateUser({ profileCompletion: completion });
    }
  };

  const verifyEmail = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateUser({ isEmailVerified: true });
      updateProfileCompletion();
    } catch (err) {
      setError("Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  const verifyPhone = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateUser({ isPhoneVerified: true });
      updateProfileCompletion();
    } catch (err) {
      setError("Failed to verify phone");
    } finally {
      setLoading(false);
    }
  };

  const updatePersonalInfo = async (data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    location?: string;
  }) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      updateUser(data);
      updateProfileCompletion();
    } catch (err) {
      setError("Failed to update personal information");
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setLoading(true);
      // Simulate file upload
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const avatarUrl = URL.createObjectURL(file);
      updateUser({ avatar: avatarUrl });
      updateProfileCompletion();
    } catch (err) {
      setError("Failed to upload avatar");
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    isLoading,
    error,
    verifyEmail,
    verifyPhone,
    updatePersonalInfo,
    uploadAvatar,
    updateProfileCompletion,
    clearError,
  };
}
