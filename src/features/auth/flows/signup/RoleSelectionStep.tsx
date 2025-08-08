"use client";

import React from "react";
import { UserRole, UserType } from "@auth/types";

interface RoleSelectionStepProps {
  selectedUserType: UserType | null;
  selectedRole: UserRole | null;
  onRoleSelect: (role: UserRole) => void;
  onNext: () => void;
  onBack: () => void;
}

const RoleSelectionStep: React.FC<RoleSelectionStepProps> = ({
  selectedUserType,
  selectedRole,
  onRoleSelect,
  onNext,
  onBack,
}) => {
  const getRolesForUserType = (
    userType: UserType
  ): Array<{
    role: UserRole;
    title: string;
    description: string;
    icon: string;
    features: string[];
  }> => {
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
  };

  const availableRoles = selectedUserType
    ? getRolesForUserType(selectedUserType)
    : [];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Your Role
        </h2>
        <p className="text-gray-600">
          Choose the role that best describes your professional category
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {availableRoles.map((role) => (
          <div
            key={role.role}
            className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              selectedRole === role.role
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => onRoleSelect(role.role)}
          >
            {selectedRole === role.role && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            <div className="text-center">
              <div className="text-4xl mb-4">{role.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {role.title}
              </h3>
              <p className="text-gray-600 mb-4">{role.description}</p>

              <ul className="text-left space-y-2">
                {role.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-gray-600"
                  >
                    <svg
                      className="w-4 h-4 text-green-500 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>

        <button
          onClick={onNext}
          disabled={!selectedRole}
          className={`px-6 py-2 rounded-lg transition-colors ${
            selectedRole
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionStep;
