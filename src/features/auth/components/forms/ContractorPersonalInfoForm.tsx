"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@shared/components/ui/button";
import { PhoneInput } from "@auth/components/phone-input/PhoneInput";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/components/ui/form";
import { Input } from "@shared/components/ui/input";
import { Checkbox } from "@shared/components/ui/checkbox";
import { Label } from "@shared/components/ui/label";
import { ContractorPersonalInfoSchema } from "@auth/utils/validation";
import { ContractorPersonalInfo } from "@auth/types/contractor";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import {
  REGISTRATION_STEPS,
  STEP_CONFIG,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  FILE_UPLOAD_MESSAGES,
  TERMS_TEXT,
} from "@auth/constants/contractorRegistration";
import { FileUpload } from "@/features/auth/components/common/FileUpload";
import Link from "next/link";
import { useContractorRegistrationStore } from "@auth/store/contractorRegistrationStore";
import { useContractorRegistration } from "@auth/hooks/useContractorRegistration";

const ContractorPersonalInfoForm: React.FC = () => {
  const store = useContractorRegistrationStore();
  const { handlePersonalInfoSubmit, goToPreviousStep } =
    useContractorRegistration();

  const authMethod = store.authMethod!;
  const isLoading = store.isLoading;
  const onSubmit = handlePersonalInfoSubmit;
  const onBack = goToPreviousStep;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authorizationForm, setAuthorizationForm] = useState<File | null>(null);
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);

  const form = useForm<ContractorPersonalInfo>({
    resolver: zodResolver(ContractorPersonalInfoSchema),
    defaultValues: {
      companyName: "",
      commercialRegistrationNumber: "",
      authorizedPersonName: "",
      authorizedPersonMobileNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      authorizationForm: undefined, // Handled by useState
      companyLogo: undefined, // Handled by useState
    },
    shouldUnregister: true,
  });

  // Set pre-filled values from store when component mounts
  React.useEffect(() => {
    if (authMethod === "thirdParty" && store.personalInfo) {
      if (store.personalInfo.companyName) {
        form.setValue("companyName", store.personalInfo.companyName);
      }
      if (store.personalInfo.authorizedPersonName) {
        form.setValue(
          "authorizedPersonName",
          store.personalInfo.authorizedPersonName
        );
      }
      if (store.personalInfo.email) {
        form.setValue("email", store.personalInfo.email);
      }
    }
  }, [authMethod, store.personalInfo, form]);

  const handleSubmit = async (values: ContractorPersonalInfo) => {
    console.log("Form values before submit:", values);
    const formData = {
      ...values,
      authorizationForm: authorizationForm!,
      companyLogo: companyLogo || undefined,
    };

    const result = await onSubmit(formData);

    if (!result.success) {
      console.log("Form submission failed:", result.error);
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    if (strength <= 2) return { text: "Weak", color: "text-red-500" };
    if (strength <= 4) return { text: "Medium", color: "text-yellow-500" };
    return { text: "Strong", color: "text-green-500" };
  };

  const passwordStrength = getPasswordStrength(form.watch("password") || "");

  const getStepNumber = () => STEP_CONFIG.personalInfo.stepNumber;

  const getTitle = () => {
    switch (authMethod) {
      case "email":
        return "Contractor Email Registration";
      case "phone":
        return "Contractor Phone Registration";
      case "thirdParty":
        return "Complete Your Contractor Profile";
      default:
        return "Contractor Information";
    }
  };

  const getDescription = () => {
    switch (authMethod) {
      case "email":
        return "Create your contractor account with email address";
      case "phone":
        return "Create your contractor account with phone number";
      case "thirdParty":
        return "Please provide additional information to complete your contractor profile";
      default:
        return "Enter your contractor details to continue";
    }
  };

  const providerInfo =
    authMethod === "thirdParty"
      ? { name: "Google", color: "text-blue-600", icon: "🔍" }
      : null;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-transparent shadow-none border-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-1"
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm text-muted-foreground">
              Step {getStepNumber()} of {REGISTRATION_STEPS.length}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            {providerInfo && (
              <span className={providerInfo.color}>{providerInfo.icon}</span>
            )}
            {getTitle()}
          </CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Company Name */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.companyName}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Commercial Registration Number */}
              <FormField
                control={form.control}
                name="commercialRegistrationNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {FORM_LABELS.commercialRegistrationNumber}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Authorized Person Name */}
              <FormField
                control={form.control}
                name="authorizedPersonName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.authorizedPersonName}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Authorized Person Mobile Number */}
              <FormField
                control={form.control}
                name="authorizedPersonMobileNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {FORM_LABELS.authorizedPersonMobileNumber}
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email - only email / thirdParty */}
              {authMethod === "email" && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FORM_LABELS.email}</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={FORM_PLACEHOLDERS.email}
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Passwords - only email / phone */}
              {(authMethod === "email" || authMethod === "phone") && (
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{FORM_LABELS.password}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              {...field}
                              disabled={isLoading}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute end-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isLoading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <div className={`text-xs ${passwordStrength.color}`}>
                          {passwordStrength.text}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{FORM_LABELS.confirmPassword}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              {...field}
                              disabled={isLoading}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute end-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              disabled={isLoading}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {/* Authorization Form Upload */}
              <div className="space-y-2">
                <Label>{FILE_UPLOAD_MESSAGES.authorizationForm.title}</Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) => setAuthorizationForm(file as File | null)}
                />
              </div>

              {/* Company Logo Upload */}
              <div className="space-y-2">
                <Label>{FILE_UPLOAD_MESSAGES.companyLogo.title}</Label>
                <FileUpload
                  accept={["image/jpeg", "image/png"]}
                  maxSizeMB={5}
                  onChange={(file) => setCompanyLogo(file as File | null)}
                />
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Continue"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractorPersonalInfoForm;
