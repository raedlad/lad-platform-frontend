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

import { useRoleRegistration } from "@auth/flows/useRoleRegistration";
import { useAuthStore } from "@auth/store/authStore";
import { Eye, EyeOff } from "lucide-react";

import Link from "next/link";
import z from "zod";
import {
  getPasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthText,
} from "../../utils/getPasswordStrength";
import { useTranslations } from "next-intl";
import { E164Number } from "libphonenumber-js";

const PersonalInfoForm: React.FC<{ role: string }> = ({ role }) => {
  const store = useAuthStore();
  const { handlePersonalInfoSubmit, getPersonalInfoSchema } =
    useRoleRegistration();
  const t = useTranslations("");
  const commonT = useTranslations("common");
  const authT = useTranslations("auth");
  const authMethod = store.authMethod!;
  const isLoading = store.isLoading;
  //  const onSubmit = handlePersonalInfoSubmit(data, role);
  const onSubmit = handlePersonalInfoSubmit;
  const {
    showPassword,
    showConfirmPassword,
    setShowPassword,
    setShowConfirmPassword,
  } = store;

  const schema = getPersonalInfoSchema();

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

  // Clear errors when user starts typing
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && store.error) {
        store.clearError();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, store]);

  const handleSubmit = async (values: z.infer<typeof schema>) => {
    console.log("Form values before submit:", values);
    // Clear any previous errors when submitting
    store.clearError();

    const result = await onSubmit(values, role);

    if (!result.success) {
      console.log("Form submission failed:", result.error);
    }
  };

  const passwordStrength = getPasswordStrength(form.watch("password") || "");

  const getTitle = () => {
    switch (authMethod) {
      case "email":
        return authT("personalInfo.emailRegistration");
      case "phone":
        return authT("personalInfo.phoneRegistration");
      case "thirdParty":
        return authT("personalInfo.completeProfile");
      default:
        return authT("personalInfo.title");
    }
  };

  const getDescription = () => {
    switch (authMethod) {
      case "email":
        return authT("personalInfo.emailDescription");
      case "phone":
        return authT("personalInfo.phoneDescription");
      case "thirdParty":
        return authT("personalInfo.thirdPartyDescription");
      default:
        return authT("personalInfo.description");
    }
  };

  const providerInfo =
    authMethod === "thirdParty"
      ? { name: "Google", color: "text-blue-600", icon: "🔍" }
      : null;

  return (
    <div className="flex-center">
      <Card className="container-narrow bg-transparent border-none shadow-none">
        <CardHeader>
          <CardTitle className="heading-section gap-2">
            {providerInfo && (
              <span className="text-provider-color">{providerInfo.icon}</span>
            )}
            {getTitle()}
          </CardTitle>
          <CardDescription>{getDescription()}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                console.log("❌ Validation errors:", store.currentRole);
              })}
              className="form-section"
            >
              {/* First / Last Name */}
              <div className="form-grid-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="form-item-vertical">
                      <FormLabel>
                        {authT("personalInfo.firstName")}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage className="form-message-min-height" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="form-item-vertical">
                      <FormLabel>
                        {authT("personalInfo.lastName")}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage className="form-message-height" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email - only email / thirdParty */}
             {authMethod !== "thirdParty" && (
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {authT("personalInfo.email")}{" "}
                        </FormLabel>
                        <FormControl>
                          <Input type="email" {...field} disabled={isLoading} dir="ltr"/>
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
                    <FormLabel>
                      {authT("personalInfo.phoneNumber")}{" "}
                    </FormLabel>
                    <FormControl>
                      <PhoneInput
                        value={field.value as E164Number}
                        onChange={field.onChange}
                        disabled={isLoading}
                        smartCaret={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Passwords - only email / phone */}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {authT("personalInfo.password")}{" "}
                    </FormLabel>
                    <FormControl>
                      <div className="input-password-container">
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                          disabled={isLoading}
                          dir="ltr"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="input-password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="icon-sm" />
                          ) : (
                            <Eye className="icon-sm" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <div
                      className={`text-xs ${getPasswordStrengthColor(
                        passwordStrength
                      )}`}
                    >
                      {getPasswordStrengthText(passwordStrength, t)}
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
                      {authT("personalInfo.confirmPassword")}{" "}
                    </FormLabel>
                    <FormControl>
                      <div className="input-password-container">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          {...field}
                          disabled={isLoading}
                          dir="ltr"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="input-password-toggle"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          disabled={isLoading}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="icon-sm" />
                          ) : (
                            <Eye className="icon-sm" />
                          )}
                        </Button>
                      </div>
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
                    <div className="form-checkbox-content">
                      <FormLabel className="flex flex-wrap">
                        <span>
                          {authT("terms.text")}{" "}
                          <Link href="#" className="link-muted">
                            {authT("terms.termsLink")}
                          </Link>{" "}
                          {authT("terms.and")}{" "}
                          <Link href="#" className="link-alt">
                            {authT("terms.privacyLink")}
                          </Link>
                        </span>
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {/* Error Display */}
              {store.error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{store.error}</p>
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="btn-full-width"
                disabled={isLoading}
              >
                {isLoading
                  ? commonT("actions.loading")
                  : authT("personalInfo.continue")}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalInfoForm;
