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
import { useIndividualRegistration } from "@auth/flows/individual/useIndividualRegistration";
import { useAuthStore } from "@auth/store/authStore";
import { useIndividualRegistrationStore } from "@auth/store/individualRegistrationStore";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import {
  REGISTRATION_STEPS,
  STEP_CONFIG,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  TERMS_TEXT,
} from "@auth/constants/individualRegistration";
import Link from "next/link";
import z from "zod";
import { GetPasswordStrength } from "../../utils/getPasswordStrength";
import { useTranslations } from "next-intl";

const PersonalInfoForm: React.FC = () => {
  const store = useAuthStore();
  const { handlePersonalInfoSubmit, goToPreviousStep, getPersonalInfoSchema } =
    useIndividualRegistration();
  const individualStore = useIndividualRegistrationStore();
  const t = useTranslations("auth");
  const commonT = useTranslations("common");

  const authMethod = store.authMethod!;
  const isLoading = store.isLoading;
  const onSubmit = handlePersonalInfoSubmit;
  const onBack = goToPreviousStep;
  const {
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
  } = individualStore;

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
      nationalId: "",
      agreeToTerms: false,
    },
    shouldUnregister: true,
  });

  // Set pre-filled values from store when component mounts
  React.useEffect(() => {
    if (authMethod === "thirdParty" && store.roleData.thirdPartyInfo) {
      if (store.roleData.thirdPartyInfo.firstName) {
        form.setValue("firstName", store.roleData.thirdPartyInfo.firstName);
      }
      if (store.roleData.thirdPartyInfo.lastName) {
        form.setValue("lastName", store.roleData.thirdPartyInfo.lastName);
      }
      if (store.roleData.thirdPartyInfo.email) {
        form.setValue("email", store.roleData.thirdPartyInfo.email);
      }
    } else {
      // Use default pre-filled data for testing/development
      const defaultData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
      };
      form.setValue("firstName", defaultData.firstName);
      form.setValue("lastName", defaultData.lastName);
      form.setValue("email", defaultData.email);
    }
  }, [authMethod, store.roleData.thirdPartyInfo, form]);

  const handleSubmit = async (values: z.infer<typeof schema>) => {
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
        return t("personalInfo.emailRegistration");
      case "phone":
        return t("personalInfo.phoneRegistration");
      case "thirdParty":
        return t("personalInfo.completeProfile");
      default:
        return t("personalInfo.title");
    }
  };

  const getDescription = () => {
    switch (authMethod) {
      case "email":
        return t("personalInfo.emailDescription");
      case "phone":
        return t("personalInfo.phoneDescription");
      case "thirdParty":
        return t("personalInfo.thirdPartyDescription");
      default:
        return t("personalInfo.description");
    }
  };

  const providerInfo =
    authMethod === "thirdParty"
      ? { name: "Google", color: "text-blue-600", icon: "🔍" }
      : null;

  return (
    <div className=" flex items-center justify-center ">
      <Card className="w-full max-w-md bg-transparent ">
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
                      <FormLabel>{t("personalInfo.firstName")}</FormLabel>
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
                      <FormLabel>{t("personalInfo.lastName")}</FormLabel>
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
                      <FormLabel>{t("personalInfo.email")} </FormLabel>
                      <FormControl>
                        <Input type="email" {...field} disabled={isLoading} />
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
                    <FormLabel>{t("personalInfo.phoneNumber")} </FormLabel>
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
                        <FormLabel>{t("personalInfo.password")} </FormLabel>
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
                        <FormLabel>
                          {t("personalInfo.confirmPassword")}{" "}
                        </FormLabel>
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
              {/* National ID */}
              <FormField
                control={form.control}
                name="nationalId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("personalInfo.nationalId")}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          {t("terms.text")}{" "}
                          <Link
                            href="#"
                            className="underline text-p-6 hover:text-p-5"
                          >
                            {t("terms.termsLink")}
                          </Link>{" "}
                          {t("terms.and")}{" "}
                          <Link
                            href="#"
                            className="underline text-p-5 hover:text-p-5"
                          >
                            {t("terms.privacyLink")}
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
                {isLoading ? commonT("loading") : t("personalInfo.continue")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoForm;
