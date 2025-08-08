import { useAuthStore } from "./authStore";
import { UserRole, UserType } from "@auth/types";

export const useAuthSelectors = () => {
  const store = useAuthStore();

  return {
    // User selectors
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    isLoading: store.isLoading,
    error: store.error,

    // User info selectors
    userId: store.user?.id,
    userEmail: store.user?.email,
    userName: store.user
      ? `${store.user.firstName} ${store.user.lastName}`
      : "",
    userRole: store.user?.role,
    userType: store.user?.userType,

    // Status selectors
    isEmailVerified: store.user?.isEmailVerified || false,
    isPhoneVerified: store.user?.isPhoneVerified || false,

    // Role-based selectors
    isIndividual: store.user?.role === UserRole.INDIVIDUAL,
    isContractor: store.user?.role === UserRole.CONTRACTOR,
    isEngineeringOffice: store.user?.role === UserRole.ENGINEERING_OFFICE,
    isFreelanceEngineer: store.user?.role === UserRole.FREELANCE_ENGINEER,
    isInstitution: store.user?.role === UserRole.INSTITUTION,

    // User type selectors
    isPersonalAccount: store.user?.userType === UserType.PERSONAL,
    isBusinessAccount: store.user?.userType === UserType.BUSINESS,

    // Actions
    login: store.login,
    signup: store.signup,
    logout: store.logout,
    clearError: store.clearError,
  };
};
