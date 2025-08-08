"use client";

import React, { useState } from "react";
import { UserType, UserRole, SignupData } from "@auth/types";
import UserTypeStep from "@auth/flows/signup/UserTypeStep";
import RoleSelectionStep from "@auth/flows/signup/RoleSelectionStep";
import UserInfoStep from "@auth/flows/signup/UserInfoStep";

type SignupStep = "userType" | "role" | "userInfo";

const SignupFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<SignupStep>("userType");
  const [selectedUserType, setSelectedUserType] = useState<UserType | null>(
    null
  );
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUserTypeSelect = (userType: UserType) => {
    setSelectedUserType(userType);
    setCurrentStep("role");
  };
  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep("userInfo");
  };

  const handleUserInfoSubmit = async (data: any) => {
    setUserInfo(data);
    setIsLoading(true);
    setError(null);

    const signupData: SignupData = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: selectedRole!,
      userType: selectedUserType!,
    };

    try {
      // Here you would call your signup API
      // await signup(signupData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Redirect to dashboard or onboarding based on user type
      // For now, just show success message
      console.log("Signup successful:", signupData);

      // You can add navigation logic here
      // router.push("/dashboard");
    } catch (err) {
      // Error is handled by the store
      const errorMessage = err instanceof Error ? err.message : "Signup failed";
      setError(errorMessage);
      console.error("Signup failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "role":
        setCurrentStep("userType");
        setSelectedRole(null);
        break;
      case "userInfo":
        setCurrentStep("role");
        setUserInfo(null);
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "userType":
        return (
          <UserTypeStep
            selectedUserType={selectedUserType}
            onUserTypeSelect={handleUserTypeSelect}
            onNext={() => {}}
          />
        );

      case "role":
        return (
          <RoleSelectionStep
            selectedUserType={selectedUserType}
            selectedRole={selectedRole}
            onRoleSelect={handleRoleSelect}
            onNext={() => {}}
            onBack={handleBack}
          />
        );

      case "userInfo":
        return (
          <UserInfoStep
            selectedUserType={selectedUserType}
            selectedRole={selectedRole}
            onUserInfoSubmit={handleUserInfoSubmit}
            onBack={handleBack}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Join LAD Platform and start your journey
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 relative">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div
                className={`flex items-center ${
                  currentStep === "userType" ||
                  currentStep === "role" ||
                  currentStep === "userInfo"
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep === "userType"
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300"
                  }`}
                >
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Account Type</span>
              </div>

              <div
                className={`flex-1 h-0.5 mx-4 ${
                  currentStep === "role" || currentStep === "userInfo"
                    ? "bg-blue-600"
                    : "bg-gray-300"
                }`}
              ></div>

              <div
                className={`flex items-center ${
                  currentStep === "role" || currentStep === "userInfo"
                    ? "text-blue-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep === "role"
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300"
                  }`}
                >
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Role</span>
              </div>

              <div
                className={`flex-1 h-0.5 mx-4 ${
                  currentStep === "userInfo" ? "bg-blue-600" : "bg-gray-300"
                }`}
              ></div>

              <div
                className={`flex items-center ${
                  currentStep === "userInfo" ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    currentStep === "userInfo"
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-300"
                  }`}
                >
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Details</span>
              </div>
            </div>
          </div>

          {/* Error display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Current step */}
          {renderCurrentStep()}

          {/* Loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">
                  Creating your account...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupFlow;
