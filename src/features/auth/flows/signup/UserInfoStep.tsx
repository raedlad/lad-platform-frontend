"use client";

import React, { useState } from "react";
import { UserRole, UserType } from "@auth/types";
import { useSignupForm } from "@auth/hooks";
// import { GoogleAuthButton } from "../../../components/common/GoogleAuthButton";

interface UserInfoStepProps {
  selectedUserType: UserType | null;
  selectedRole: UserRole | null;
  onUserInfoSubmit: (data: any) => void;
  onBack: () => void;
}

const UserInfoStep: React.FC<UserInfoStepProps> = ({
  selectedUserType,
  selectedRole,
  onUserInfoSubmit,
  onBack,
}) => {
  const [signupMethod, setSignupMethod] = useState<"social" | "email">("email");
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const {
    register,
    handleSubmit,
    form,
    getFieldError,
    getPasswordStrength,
    setSocialLogin,
    setEmailSignup,
    isSocialLogin,
    isEmailSignup,
    getAccountSummary,
    validateSocialLogin,
    validateEmailSignup,
  } = useSignupForm(selectedUserType!, selectedRole!);

  const {
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: any) => {
    // Add user type and role to the data
    const signupData = {
      ...data,
      userType: selectedUserType,
      role: selectedRole,
    };

    onUserInfoSubmit(signupData);
  };

  const handleGoogleSignup = async (token: string) => {
    setSocialLogin("google", token);
    setSignupMethod("social");
    // Auto-submit the form with Google data
    // You would typically get user info from Google token here
  };

  const handleAppleSignup = async (token: string) => {
    setSocialLogin("apple", token);
    setSignupMethod("social");
    // Auto-submit the form with Apple data
    // You would typically get user info from Apple token here
  };

  const handleEmailSignup = () => {
    setEmailSignup();
    setSignupMethod("email");
    setShowPasswordFields(true);
  };

  const accountSummary = getAccountSummary();

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Create Your Account
        </h2>
        <p className="text-gray-600">
          Complete your registration to get started
        </p>
      </div>

      {/* Account Summary */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          Account Summary
        </h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p>
            <span className="font-medium">Type:</span> {accountSummary.userType}
          </p>
          <p>
            <span className="font-medium">Role:</span> {accountSummary.role}
          </p>
        </div>
      </div>

      {/* Signup Method Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Choose Signup Method
        </h3>

        {/* Social Login Options */}
        <div className="space-y-3 mb-4">
          <button
            type="button"
            onClick={() => handleGoogleSignup("google-token")}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => handleAppleSignup("apple-token")}
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            Continue with Apple
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with email
            </span>
          </div>
        </div>

        {/* Email Signup Option */}
        <button
          type="button"
          onClick={handleEmailSignup}
          className={`w-full flex items-center justify-center px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            signupMethod === "email"
              ? "border-blue-500 bg-blue-50 text-blue-700"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Continue with Email
        </button>
      </div>

      {/* Email Signup Form */}
      {showPasswordFields && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name *
              </label>
              <input
                {...register("firstName")}
                type="text"
                id="firstName"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  getFieldError("firstName")
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="John"
              />
              {getFieldError("firstName") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError("firstName")}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name *
              </label>
              <input
                {...register("lastName")}
                type="text"
                id="lastName"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  getFieldError("lastName")
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                placeholder="Doe"
              />
              {getFieldError("lastName") && (
                <p className="mt-1 text-sm text-red-600">
                  {getFieldError("lastName")}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address *
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("email") ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="john.doe@example.com"
            />
            {getFieldError("email") && (
              <p className="mt-1 text-sm text-red-600">
                {getFieldError("email")}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number (Optional)
            </label>
            <input
              {...register("phone")}
              type="tel"
              id="phone"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password *
            </label>
            <input
              {...register("password")}
              type="password"
              id="password"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("password") ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            {getFieldError("password") && (
              <p className="mt-1 text-sm text-red-600">
                {getFieldError("password")}
              </p>
            )}
            {/* Password strength indicator */}
            {form.watch("password") && (
              <div className="mt-2">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        getPasswordStrength(form.watch("password") || "")
                          .score <= 2
                          ? "bg-red-500"
                          : getPasswordStrength(form.watch("password") || "")
                              .score <= 3
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${
                          (getPasswordStrength(form.watch("password") || "")
                            .score /
                            5) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <span
                    className={`text-sm ${
                      getPasswordStrength(form.watch("password") || "").color
                    }`}
                  >
                    {getPasswordStrength(form.watch("password") || "").label}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password *
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              id="confirmPassword"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                getFieldError("confirmPassword")
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="••••••••"
            />
            {getFieldError("confirmPassword") && (
              <p className="mt-1 text-sm text-red-600">
                {getFieldError("confirmPassword")}
              </p>
            )}
          </div>

          {/* Terms and Privacy */}
          <div className="space-y-3">
            <div className="flex items-start">
              <input
                {...register("acceptTerms")}
                type="checkbox"
                id="acceptTerms"
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="acceptTerms"
                className="ml-2 text-sm text-gray-700"
              >
                I agree to the{" "}
                <a href="/terms" className="text-blue-600 hover:text-blue-500">
                  Terms and Conditions
                </a>
              </label>
            </div>
            {getFieldError("acceptTerms") && (
              <p className="text-sm text-red-600">
                {getFieldError("acceptTerms")}
              </p>
            )}

            <div className="flex items-start">
              <input
                {...register("acceptPrivacy")}
                type="checkbox"
                id="acceptPrivacy"
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="acceptPrivacy"
                className="ml-2 text-sm text-gray-700"
              >
                I agree to the{" "}
                <a
                  href="/privacy"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
            {getFieldError("acceptPrivacy") && (
              <p className="text-sm text-red-600">
                {getFieldError("acceptPrivacy")}
              </p>
            )}

            {/* Marketing preferences */}
            <div className="flex items-start">
              <input
                {...register("marketingEmails")}
                type="checkbox"
                id="marketingEmails"
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="marketingEmails"
                className="ml-2 text-sm text-gray-700"
              >
                I would like to receive marketing emails about new features and
                updates
              </label>
            </div>

            <div className="flex items-start">
              <input
                {...register("newsletter")}
                type="checkbox"
                id="newsletter"
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="newsletter"
                className="ml-2 text-sm text-gray-700"
              >
                I would like to subscribe to the newsletter
              </label>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-lg transition-colors ${
                isSubmitting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
      )}

      {/* Back button for social login */}
      {signupMethod === "social" && (
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default UserInfoStep;
