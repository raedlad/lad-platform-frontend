"use client";

import React from "react";
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
import { EngineeringOfficePersonalInfoSchema } from "@auth/utils/validation";
import { EngineeringOfficePersonalInfo } from "@auth/types/engineeringOffice";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import {
  REGISTRATION_STEPS,
  STEP_CONFIG,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  TERMS_TEXT,
} from "@auth/constants/engineeringOfficeRegistration";
import Link from "next/link";
import { useAuthStore } from "@auth/store/authStore";
import { useEngineeringOfficeRegistration } from "@/features/auth/flows/engineering-office/useEngineeringOfficeRegistration";
import { useEngineeringOfficeRegistrationStore } from "@auth/store/engineeringOfficeRegistrationStore";
import { GetPasswordStrength } from "../../utils/getPasswordStrength";

const EngineeringOfficePersonalInfoForm: React.FC = () => {
  const store = useAuthStore();
  const { handlePersonalInfoSubmit } = useEngineeringOfficeRegistration();
  const engineeringOfficeStore = useEngineeringOfficeRegistrationStore();

  const authMethod = store.authMethod!;
  const isLoading = store.isLoading;
  const onSubmit = handlePersonalInfoSubmit;

  const {
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
  } = engineeringOfficeStore;

  const form = useForm<EngineeringOfficePersonalInfo>({
    resolver: zodResolver(EngineeringOfficePersonalInfoSchema),
    defaultValues: {
      officeName: "",
      professionalLicenseNumber: "",
      authorizedPersonName: "",
      authorizedPersonMobileNumber: "",
      email: "",
      password: "",
      confirmPassword: "",

      agreeToTerms: false,
    },
    shouldUnregister: true,
  });

  // Set pre-filled values from store when component mounts
  React.useEffect(() => {
    if (authMethod === "thirdParty" && store.roleData.personalInfo) {
      if (store.roleData.personalInfo.officeName) {
        form.setValue("officeName", store.roleData.personalInfo.officeName);
      }
      if (store.roleData.personalInfo.authorizedPersonName) {
        form.setValue(
          "authorizedPersonName",
          store.roleData.personalInfo.authorizedPersonName
        );
      }
      if (store.roleData.personalInfo.email) {
        form.setValue("email", store.roleData.personalInfo.email);
      }
    }
  }, [authMethod, store.roleData.personalInfo, form]);

  const handleSubmit = async (values: EngineeringOfficePersonalInfo) => {
    console.log("Form values before submit:", values);
    const result = await onSubmit(values);

    if (!result.success) {
      console.log("Form submission failed:", result.error);
    }
  };

  const passwordStrength = GetPasswordStrength(form.watch("password") || "");

  const getTitle = () => {
    switch (authMethod) {
      case "email":
        return "Engineering Office Email Registration";
      case "phone":
        return "Engineering Office Phone Registration";
      case "thirdParty":
        return "Complete Your Engineering Office Profile";
      default:
        return "Engineering Office Information";
    }
  };

  const getDescription = () => {
    switch (authMethod) {
      case "email":
        return "Create your engineering office account with email address";
      case "phone":
        return "Create your engineering office account with phone number";
      case "thirdParty":
        return "Please provide additional information to complete your engineering office profile";
      default:
        return "Enter your engineering office details to continue";
    }
  };

  const providerInfo =
    authMethod === "thirdParty"
      ? { name: "Google", color: "text-blue-600", icon: "🔍" }
      : null;

  return (
    <div className="w-full flex items-center justify-center">
      <Card className="w-full max-w-md bg-transparent shadow-none border-none">
        <CardHeader>
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
              {/* Office Name */}
              <FormField
                control={form.control}
                name="officeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.officeName}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Professional License Number */}
              <FormField
                control={form.control}
                name="professionalLicenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {FORM_LABELS.professionalLicenseNumber}
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

              {/* Email */}
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

              {/* Passwords - only email / phone */}
              {(authMethod === "email" || authMethod === "phone") && (
                <>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{FORM_LABELS.password} </FormLabel>
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
                        <FormLabel>{FORM_LABELS.confirmPassword} </FormLabel>
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

              {/* Terms and Privacy */}
              <FormField
                control={form.control}
                name="agreeToTerms"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <div className="space-y-1">
                      <FormLabel className="flex flex-wrap">
                        <span>
                          {TERMS_TEXT.terms}{" "}
                          <Link
                            href="#"
                            className="underline text-p-6 hover:text-p-5"
                          >
                            {TERMS_TEXT.termsLink}
                          </Link>{" "}
                          {TERMS_TEXT.termsCong}{" "}
                          <Link
                            href="#"
                            className="underline text-p-5 hover:text-p-5"
                          >
                            {TERMS_TEXT.privacyLink}
                          </Link>
                        </span>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

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

export default EngineeringOfficePersonalInfoForm;
