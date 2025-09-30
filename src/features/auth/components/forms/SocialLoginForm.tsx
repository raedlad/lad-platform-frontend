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
import { useGoogleAuth } from "@/features/auth/hooks";
import { createValidationSchemas } from "@auth/utils/validation";

import Link from "next/link";
import z from "zod";
import { useTranslations } from "next-intl";
import { E164Number } from "libphonenumber-js";
import { Eye, EyeOff } from "lucide-react";
import {
  getPasswordStrength,
  getPasswordStrengthColor,
  getPasswordStrengthText,
} from "../../utils/getPasswordStrength";

const SocialLoginForm: React.FC<{ role: string; provider: string }> = ({
  role,
  provider,
}) => {
  const store = useAuthStore();
  const { handlePersonalInfoSubmit, getPersonalInfoSchema } =
    useRoleRegistration();
  const t = useTranslations("");
  const commonT = useTranslations("common");
  const authT = useTranslations("auth");
  const isLoading = store.isLoading;

  const onSubmit = handlePersonalInfoSubmit;

  // Get the validation schema from the validation utility
  const validationSchemas = createValidationSchemas(t);
  const socialLoginSchema = validationSchemas.SocialLoginFormSchema;

  const form = useForm<z.infer<typeof socialLoginSchema>>({
    resolver: zodResolver(socialLoginSchema),
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

  // Pre-fill form with third-party data when component mounts
  React.useEffect(() => {
    if (store.roleData.thirdPartyInfo) {
      const data = store.roleData.thirdPartyInfo;
      if (data.firstName) {
        form.setValue("firstName", data.firstName);
      }
      if (data.lastName) {
        form.setValue("lastName", data.lastName);
      }
      if (data.email) {
        form.setValue("email", data.email);
      }
    }
  }, [store.roleData.thirdPartyInfo, form]);

  // Clear errors when user starts typing
  React.useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && store.error) {
        store.clearError();
      }
    });
    return () => subscription.unsubscribe();
  }, [form, store]);

  const handleSubmit = async (values: z.infer<typeof socialLoginSchema>) => {
    store.clearError();

    const result = await onSubmit(values, role);

    if (result.success) {
      // For social login, manually advance to verification step
      store.setCurrentStep("verification");
    }
  };

  return (
    <div className="flex-center">
      <Card className="container-narrow bg-transparent border-none shadow-none">
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="form-section"
            >
              {/* First / Last Name */}
              <div className="form-grid-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="form-item-vertical">
                      <FormLabel>{authT("personalInfo.firstName")}</FormLabel>
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
                      <FormLabel>{authT("personalInfo.lastName")}</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage className="form-message-height" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{authT("personalInfo.email")}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        disabled={true}
                        dir="ltr"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{authT("personalInfo.phoneNumber")}</FormLabel>
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

              {/* Password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{authT("personalInfo.password")}</FormLabel>
                    <FormControl>
                      <div className="input-password-container">
                        <Input
                          type={store.showPassword ? "text" : "password"}
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
                            store.setShowPassword(!store.showPassword)
                          }
                          disabled={isLoading}
                        >
                          {store.showPassword ? (
                            <EyeOff className="icon-sm" />
                          ) : (
                            <Eye className="icon-sm" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <div
                      className={`text-xs ${getPasswordStrengthColor(
                        getPasswordStrength(field.value || "")
                      )}`}
                    >
                      {getPasswordStrengthText(
                        getPasswordStrength(field.value || ""),
                        t
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Confirm Password */}
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {authT("personalInfo.confirmPassword")}
                    </FormLabel>
                    <FormControl>
                      <div className="input-password-container">
                        <Input
                          type={store.showConfirmPassword ? "text" : "password"}
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
                            store.setShowConfirmPassword(
                              !store.showConfirmPassword
                            )
                          }
                          disabled={isLoading}
                        >
                          {store.showConfirmPassword ? (
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

export default SocialLoginForm;
