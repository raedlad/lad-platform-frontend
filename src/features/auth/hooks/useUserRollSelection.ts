import { useState, useCallback } from "react";
import { UserRole, UserType } from "@auth/types";

export const useUserRollSelection = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectRole = useCallback((role: UserRole) => {
    setSelectedRole(role);
    setError(null);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedRole(null);
    setError(null);
  }, []);

  const validateSelection = useCallback(() => {
    if (!selectedRole) {
      setError("Please select a role");
      return false;
    }
    setError(null);
    return true;
  }, [selectedRole]);

  const getAvailableRoles = useCallback((userType: UserType) => {
    if (userType === UserType.PERSONAL) {
      return [
        {
          role: UserRole.INDIVIDUAL,
          title: "Individual",
          description: "Personal user account for individual projects",
          icon: "👤",
          features: [
            "Personal project access",
            "Individual dashboard",
            "Basic features",
          ],
        },
      ];
    }

    if (userType === UserType.BUSINESS) {
      return [
        {
          role: UserRole.CONTRACTOR,
          title: "Contractor",
          description: "For construction and contracting companies",
          icon: "🏗️",
          features: [
            "Project management",
            "Team collaboration",
            "Contract management",
            "Document handling",
          ],
        },
        {
          role: UserRole.ENGINEERING_OFFICE,
          title: "Engineering Office",
          description: "For engineering consulting firms",
          icon: "🏢",
          features: [
            "Engineering projects",
            "Technical documentation",
            "Client management",
            "Professional tools",
          ],
        },
        {
          role: UserRole.FREELANCE_ENGINEER,
          title: "Freelance Engineer",
          description: "For independent engineering professionals",
          icon: "👨‍💼",
          features: [
            "Project portfolio",
            "Client management",
            "Professional tools",
            "Flexible workflow",
          ],
        },
        {
          role: UserRole.INSTITUTION,
          title: "Institution",
          description: "For government and educational institutions",
          icon: "🏛️",
          features: [
            "Institutional access",
            "Multi-user management",
            "Compliance tools",
            "Reporting features",
          ],
        },
      ];
    }

    return [];
  }, []);

  const getRoleInfo = useCallback((role: UserRole) => {
    const roleInfo = {
      [UserRole.INDIVIDUAL]: {
        title: "Individual",
        description: "Personal user account for individual projects",
        icon: "👤",
        features: [
          "Personal project access",
          "Individual dashboard",
          "Basic features",
        ],
      },
      [UserRole.CONTRACTOR]: {
        title: "Contractor",
        description: "For construction and contracting companies",
        icon: "🏗️",
        features: [
          "Project management",
          "Team collaboration",
          "Contract management",
          "Document handling",
        ],
      },
      [UserRole.ENGINEERING_OFFICE]: {
        title: "Engineering Office",
        description: "For engineering consulting firms",
        icon: "🏢",
        features: [
          "Engineering projects",
          "Technical documentation",
          "Client management",
          "Professional tools",
        ],
      },
      [UserRole.FREELANCE_ENGINEER]: {
        title: "Freelance Engineer",
        description: "For independent engineering professionals",
        icon: "👨‍💼",
        features: [
          "Project portfolio",
          "Client management",
          "Professional tools",
          "Flexible workflow",
        ],
      },
      [UserRole.INSTITUTION]: {
        title: "Institution",
        description: "For government and educational institutions",
        icon: "🏛️",
        features: [
          "Institutional access",
          "Multi-user management",
          "Compliance tools",
          "Reporting features",
        ],
      },
    };

    return roleInfo[role];
  }, []);

  return {
    selectedRole,
    selectRole,
    clearSelection,
    validateSelection,
    getAvailableRoles,
    getRoleInfo,
    error,
  };
};

export default useUserRollSelection;
