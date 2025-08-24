"use client";

import React from "react";
import { Button } from "@shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import { CheckCircle, Sparkles } from "lucide-react";

// Generic interface for any registration store
interface RegistrationStore {
  currentStep: string;
  authMethod: "email" | "phone" | "thirdParty" | null;
  personalInfo: any;
  phoneInfo?: any; // Optional for freelance engineer store
  thirdPartyInfo?: any; // Optional for freelance engineer store
  isLoading: boolean;
  error: string | null;
}

// Generic interface for any registration hook
interface RegistrationHook {
  handleComplete: () => void;
  goToPreviousStep: () => void;
}

interface CompletionStepProps {
  store: RegistrationStore;
  hook: RegistrationHook;
}

const CompletionStep: React.FC<CompletionStepProps> = ({ store, hook }) => {
  const { handleComplete, goToPreviousStep } = hook;

  const onComplete = handleComplete;
  const onBack = goToPreviousStep;
  const authMethod = store.authMethod!;

  // Get user data from store - handle individual, institution, and contractor stores
  const userData = (() => {
    if (authMethod === "email" && store.personalInfo) {
      return {
        firstName:
          store.personalInfo.firstName ||
          store.personalInfo.contactPersonFirstName ||
          store.personalInfo.authorizedPersonName,
        lastName:
          store.personalInfo.lastName ||
          store.personalInfo.contactPersonLastName ||
          store.personalInfo.companyName,
        email: store.personalInfo.email || store.personalInfo.institutionEmail,
        phoneNumber:
          store.personalInfo.phoneNumber ||
          store.personalInfo.institutionPhoneNumber ||
          store.personalInfo.authorizedPersonMobileNumber,
      };
    } else if (authMethod === "phone" && store.phoneInfo) {
      return {
        firstName:
          store.phoneInfo.firstName ||
          store.phoneInfo.contactPersonFirstName ||
          store.phoneInfo.authorizedPersonName,
        lastName:
          store.phoneInfo.lastName ||
          store.phoneInfo.contactPersonLastName ||
          store.phoneInfo.companyName,
        email: undefined,
        phoneNumber:
          store.phoneInfo.phoneNumber ||
          store.phoneInfo.institutionPhoneNumber ||
          store.phoneInfo.authorizedPersonMobileNumber,
      };
    } else if (authMethod === "thirdParty" && store.thirdPartyInfo) {
      return {
        firstName:
          store.thirdPartyInfo.firstName ||
          store.thirdPartyInfo.contactPersonFirstName ||
          store.thirdPartyInfo.authorizedPersonName,
        lastName:
          store.thirdPartyInfo.lastName ||
          store.thirdPartyInfo.contactPersonLastName ||
          store.thirdPartyInfo.companyName,
        email:
          store.thirdPartyInfo.email || store.thirdPartyInfo.institutionEmail,
        phoneNumber: undefined,
      };
    }
    return undefined;
  })();

  const firstName = userData?.firstName || "there";

  const getAuthMethodText = () => {
    switch (authMethod) {
      case "email":
        return "email address";
      case "phone":
        return "phone number";
      case "thirdParty":
        return "third-party account";
      default:
        return "account";
    }
  };

  const getContactInfo = () => {
    switch (authMethod) {
      case "email":
        return userData?.email || "your email";
      case "phone":
        return userData?.phoneNumber || "your phone number";
      case "thirdParty":
        return userData?.email || "your account";
      default:
        return "your account";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            Welcome, {firstName}!
            <Sparkles className="h-5 w-5 text-yellow-500" />
          </CardTitle>
          <CardDescription className="text-base">
            Your account has been successfully created with your{" "}
            {getAuthMethodText()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Success Details */}
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Account created successfully</span>
            </div>
            {authMethod !== "thirdParty" && (
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>
                  {authMethod === "email" ? "Email" : "Phone number"} verified
                </span>
              </div>
            )}
            <div className="flex items-center justify-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Profile setup complete</span>
            </div>
          </div>

          {/* User Info Summary */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
            <div className="font-medium">Account Summary:</div>
            <div>
              Name: {userData?.firstName} {userData?.lastName}
            </div>
            <div>Contact: {getContactInfo()}</div>
            <div>Type: Individual Account</div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button onClick={onComplete} className="w-full">
              Continue to Dashboard
            </Button>
            <Button variant="outline" onClick={onBack} className="w-full">
              Back to Previous Step
            </Button>
          </div>

          {/* Additional Info */}
          <div className="text-xs text-muted-foreground">
            You can now access all features of our platform. Check your{" "}
            {authMethod === "email"
              ? "email"
              : authMethod === "phone"
              ? "phone"
              : "account"}{" "}
            for a welcome message!
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletionStep;
