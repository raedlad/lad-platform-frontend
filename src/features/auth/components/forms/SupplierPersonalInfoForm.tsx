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
import { Label } from "@shared/components/ui/label";
import { SupplierPersonalInfoSchema } from "@auth/utils/validation";
import { SupplierPersonalInfo } from "@auth/types/supplier";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import {
  REGISTRATION_STEPS,
  STEP_CONFIG,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  FILE_UPLOAD_MESSAGES,
} from "@auth/constants/supplierRegistration";
import { FileUpload } from "@/features/auth/components/common/FileUpload";
import { useSupplierRegistrationStore } from "@auth/store/supplierRegistrationStore";
import { useSupplierRegistration } from "@auth/hooks/useSupplierRegistration";

const SupplierPersonalInfoForm: React.FC = () => {
  const store = useSupplierRegistrationStore();
  const { handlePersonalInfoSubmit, goToPreviousStep } =
    useSupplierRegistration();

  const authMethod = store.authMethod!;
  const isLoading = store.isLoading;
  const onSubmit = handlePersonalInfoSubmit;
  const onBack = goToPreviousStep;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [officialAuthorizationLetter, setOfficialAuthorizationLetter] =
    useState<File | null>(null);
  const [establishmentLogo, setEstablishmentLogo] = useState<File | null>(null);

  const form = useForm<SupplierPersonalInfo>({
    resolver: zodResolver(SupplierPersonalInfoSchema),
    defaultValues: {
      commercialEstablishmentName: "",
      commercialRegistrationNumber: "",
      authorizedPersonName: "",
      authorizedPersonMobileNumber: "",
      email: "",
      password: "",
      confirmPassword: "",
      officialAuthorizationLetter: undefined, // Handled by useState
      establishmentLogo: undefined, // Handled by useState
    },
    shouldUnregister: true,
  });

  // Set pre-filled values from store when component mounts
  React.useEffect(() => {
    if (authMethod === "thirdParty" && store.personalInfo) {
      if (store.personalInfo.commercialEstablishmentName) {
        form.setValue(
          "commercialEstablishmentName",
          store.personalInfo.commercialEstablishmentName
        );
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

  const handleSubmit = async (values: SupplierPersonalInfo) => {
    console.log("Form values before submit:", values);
    const formData = {
      ...values,
      officialAuthorizationLetter: officialAuthorizationLetter!,
      establishmentLogo: establishmentLogo || undefined,
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
        return "Supplier Email Registration";
      case "phone":
        return "Supplier Phone Registration";
      case "thirdParty":
        return "Complete Your Supplier Profile";
      default:
        return "Supplier Information";
    }
  };

  const getDescription = () => {
    switch (authMethod) {
      case "email":
        return "Create your supplier account with email address";
      case "phone":
        return "Create your supplier account with phone number";
      case "thirdParty":
        return "Please provide additional information to complete your supplier profile";
      default:
        return "Enter your supplier details to continue";
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
              {/* Commercial Establishment Name */}
              <FormField
                control={form.control}
                name="commercialEstablishmentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {FORM_LABELS.commercialEstablishmentName}
                    </FormLabel>
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

              {/* Official Authorization Letter Upload */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.officialAuthorizationLetter.title}
                </Label>
                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) =>
                    setOfficialAuthorizationLetter(file as File | null)
                  }
                />
                <FormMessage>
                  {form.formState.errors.officialAuthorizationLetter?.message}
                </FormMessage>
              </div>

              {/* Establishment Logo Upload (Optional) */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">
                  {FILE_UPLOAD_MESSAGES.establishmentLogo.title}
                </Label>
                <FileUpload
                  accept={["image/jpeg", "image/png"]}
                  maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                  onChange={(file) => setEstablishmentLogo(file as File | null)}
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

export default SupplierPersonalInfoForm;
