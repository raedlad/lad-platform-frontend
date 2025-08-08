"use client";

import React, { useState, useEffect } from "react";
import { OTPInput } from "@auth/components/common";

interface OTPVerificationStepProps {
  email: string;
  phone?: string;
  onVerificationSuccess: () => void;
  onVerificationFailed: (error: string) => void;
  onBack: () => void;
  onResendOTP: () => void;
}

const OTPVerificationStep: React.FC<OTPVerificationStepProps> = ({
  email,
  phone,
  onVerificationSuccess,
  onVerificationFailed,
  onBack,
  onResendOTP,
}) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [verificationMethod, setVerificationMethod] = useState<
    "email" | "phone"
  >("email");

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(
        () => setResendCountdown(resendCountdown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleOTPChange = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      handleVerifyOTP(value);
    }
  };

  const handleVerifyOTP = async (otpValue: string) => {
    setIsVerifying(true);
    try {
      // Here you would call your OTP verification API
      // const response = await verifyOTP({
      //   email,
      //   phone,
      //   otp: otpValue,
      //   method: verificationMethod,
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, assume success if OTP is "123456"
      if (otpValue === "123456") {
        onVerificationSuccess();
      } else {
        onVerificationFailed("Invalid OTP code. Please try again.");
      }
    } catch (error) {
      onVerificationFailed("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = () => {
    setResendCountdown(60);
    onResendOTP();
  };

  const getVerificationTarget = () => {
    return verificationMethod === "email" ? email : phone;
  };

  const maskEmail = (email: string) => {
    const [localPart, domain] = email.split("@");
    const maskedLocal =
      localPart.slice(0, 2) + "*".repeat(localPart.length - 2);
    return `${maskedLocal}@${domain}`;
  };

  const maskPhone = (phone: string) => {
    return phone.replace(/(\d{3})\d{3}(\d{4})/, "$1***$2");
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 mb-4">
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Verify Your Account
        </h2>
        <p className="text-gray-600">
          We've sent a verification code to your {verificationMethod}
        </p>
      </div>

      {/* Verification Method Toggle */}
      {phone && (
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-4">
            <button
              type="button"
              onClick={() => setVerificationMethod("email")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                verificationMethod === "email"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setVerificationMethod("phone")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                verificationMethod === "phone"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Phone
            </button>
          </div>
        </div>
      )}

      {/* Verification Target Display */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 text-center">
        <p className="text-sm text-gray-600 mb-1">Code sent to:</p>
        <p className="text-sm font-medium text-gray-900">
          {verificationMethod === "email"
            ? maskEmail(email)
            : phone
            ? maskPhone(phone)
            : "N/A"}
        </p>
      </div>

      {/* OTP Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter 6-digit code
        </label>
        <OTPInput
          value={otp}
          onChange={handleOTPChange}
          length={6}
          disabled={isVerifying}
          className="justify-center"
        />
      </div>

      {/* Loading State */}
      {isVerifying && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-sm text-gray-600">Verifying...</span>
          </div>
        </div>
      )}

      {/* Resend OTP */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
        <button
          type="button"
          onClick={handleResendOTP}
          disabled={resendCountdown > 0}
          className={`text-sm font-medium transition-colors ${
            resendCountdown > 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:text-blue-500"
          }`}
        >
          {resendCountdown > 0
            ? `Resend in ${resendCountdown}s`
            : "Resend code"}
        </button>
      </div>

      {/* Demo Note */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Demo Mode</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Use code <strong>123456</strong> to verify your account.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
      </div>
    </div>
  );
};

export default OTPVerificationStep;
