import { useAuthStore } from "@auth/store";

export const useAuth = () => {
  const authStore = useAuthStore();

  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isLoading: authStore.isLoading,
    error: authStore.error,
    login: authStore.login,
    signup: authStore.signup,
    logout: authStore.logout,
    clearError: authStore.clearError,
  };
};

export default useAuth;
