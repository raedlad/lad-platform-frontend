import { useState, useCallback } from "react";
import { UserType } from "../types";

export const useUserTypeSelection = () => {
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const selectUserType = useCallback((userType: UserType) => {
    setSelectedUserType(userType);
    setError(null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedUserType(null);
    setError(null);
  }, []);

  const validateSelection = useCallback(() => {
    if (!selectedUserType) {
      setError("Please select a user type");
      return false;
    }
    setError(null);
    return true;
  }, [selectedUserType]);

  const getUserTypeInfo = useCallback((userType: UserType) => {
    const userTypeInfo = {
      [UserType.PERSONAL]: {
        title: "Personal Account",
        description: "For individual users and personal projects",
        icon: "👤",
        features: [
          "Personal project management",
          "Individual access",
          "Basic features",
        ],
      },
      [UserType.BUSINESS]: {
        title: "Business Account",
        description: "For companies, contractors, and professional services",
        icon: "🏢",
        features: [
          "Team collaboration",
          "Advanced features",
          "Professional tools",
          "Priority support",
        ],
      },
    };

    return userTypeInfo[userType];
  }, []);

  return {
    selectedUserType,
    selectUserType,
    clearSelection,
    validateSelection,
    getUserTypeInfo,
    error,
  };
};

export default useUserTypeSelection;
