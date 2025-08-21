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
import { useIndividualRegistration } from "@auth/hooks/useIndividualRegistration";
import { useIndividualRegistrationStore } from "@auth/store/individualRegistrationStore";
import { PersonalInfo } from "@auth/types/individual";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import {
  REGISTRATION_STEPS,
  STEP_CONFIG,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  FILE_UPLOAD_MESSAGES,
  TERMS_TEXT,
} from "@auth/constants/individualRegistration";
import { FileUpload } from "@/features/auth/components/common/FileUpload";
import Link from "next/link";
import z from "zod";

const PersonalInfoForm: React.FC = () => {
  const store = useIndividualRegistrationStore();
  const { handlePersonalInfoSubmit, goToPreviousStep, getPersonalInfoSchema } =
    useIndividualRegistration();

  const authMethod = store.authMethod!;
  const isLoading = store.isLoading;
  const onSubmit = handlePersonalInfoSubmit;
  const onBack = goToPreviousStep;
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [nationalIdFile, setNationalIdFile] = useState<File | null>(null);

  const schema = getPersonalInfoSchema(authMethod);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    shouldUnregister: true,
  });

  // Set pre-filled values from store when component mounts
  React.useEffect(() => {
    if (authMethod === "thirdParty" && store.thirdPartyInfo) {
      if (store.thirdPartyInfo.firstName) {
        form.setValue("firstName", store.thirdPartyInfo.firstName);
      }
      if (store.thirdPartyInfo.lastName) {
        form.setValue("lastName", store.thirdPartyInfo.lastName);
      }
      if (store.thirdPartyInfo.email) {
        form.setValue("email", store.thirdPartyInfo.email);
      }
    } else {
      // Use default pre-filled data for testing/development
      const defaultData = store.getDefaultPreFilledData();
      form.setValue("firstName", defaultData.firstName);
      form.setValue("lastName", defaultData.lastName);
      form.setValue("email", defaultData.email);
    }
  }, [authMethod, store.thirdPartyInfo, store, form]);

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    console.log("Form values before submit:", values);
    const formData = {
      ...values,
      nationalIdFile: nationalIdFile || undefined,
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
        return "Email Registration";
      case "phone":
        return "Phone Registration";
      case "thirdParty":
        return "Complete Your Profile";
      default:
        return "Personal Information";
    }
  };

  const getDescription = () => {
    switch (authMethod) {
      case "email":
        return "Create your account with email address";
      case "phone":
        return "Create your account with phone number";
      case "thirdParty":
        return "Please provide additional information to complete your profile";
      default:
        return "Enter your personal details to continue";
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
              onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                console.log("❌ Validation errors:", errors);
              })}
              className="space-y-4"
            >
              {/* First / Last Name */}
              <div className="grid grid-cols-2 gap-4 items-start">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{FORM_LABELS.firstName}</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage className="min-h-5" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{FORM_LABELS.lastName}</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage className="h-5" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email - only email / thirdParty */}
              {authMethod === "email" && (
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FORM_LABELS.email} </FormLabel>
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

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.phoneNumber} </FormLabel>
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

              {/* National ID Upload */}
              <div className="space-y-2">
                <Label>{FILE_UPLOAD_MESSAGES.title}</Label>

                <FileUpload
                  accept={["application/pdf", "image/jpeg", "image/png"]}
                  maxSizeMB={10}
                  onChange={(file) => setNationalIdFile(file as File | null)}
                />
              </div>

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

export default PersonalInfoForm;
