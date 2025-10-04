"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import GoogleAuthButton from "../common/GoogleAuthButton";
import { useGoogleAuth } from "@/features/auth/hooks";
import AppleAuthButton from "../common/AppleAuthButton";
import { Input } from "@/shared/components/ui/input";
import {
  Form,
  FormMessage,
  FormItem,
  FormControl,
  FormLabel,
  FormField,
} from "@/shared/components/ui/form";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { authApi } from "@auth/services/authApi";
import { tokenStorage } from "@auth/utils/tokenStorage";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  emailOrPhone: z
    .string()
    .email("Please enter a valid email address")
    .or(z.string().min(1, "Phone number is required")),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onError }) => {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signInWithGoogle } = useGoogleAuth();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const handleSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Determine if input is email or phone
      const isEmail = data.emailOrPhone.includes("@");
      const loginData = {
        email: isEmail ? data.emailOrPhone : undefined,
        phoneNumber: !isEmail ? data.emailOrPhone : undefined,
        password: data.password,
      };

      console.log("Login attempt with:", loginData);

      const result = await authApi.login(loginData);

      if (result.success && result.data) {
        // Store tokens and user data
        if (result.data.response.extra.tokens && result.data.response) {
          tokenStorage.storeTokens(
            result.data.response.extra.tokens,
            result.data.response
          );
        }

        // Check if verification is required
        if (result.data.response.account_overview.verification_required) {
          // Determine what type of verification is needed
          const user = result.data.response;
          const verificationStatus =
            user?.account_overview?.verification_status;

          let verificationType = "email";
          let contactInfo = user?.email;

          // Check if phone verification is required and not verified
          if (
            verificationStatus?.verification_required === true &&
            verificationStatus?.phone_verified === false
          ) {
            verificationType = "phone";
            contactInfo = user?.phone;
          }
          // Check if email verification is required and not verified
          else if (
            verificationStatus?.verification_required === true &&
            verificationStatus?.email_verified === false
          ) {
            verificationType = "email";
            contactInfo = user?.email;
          }

          if (contactInfo) {
            // Redirect to verification page with specific contact info and type
            router.push(
              `/verify-otp?contact=${contactInfo}&type=${verificationType}`
            );
          } else {
            // Fallback to general verification page
            router.push("/verify-otp");
          }
        } else {
          // No verification required, redirect to dashboard
          router.push(`/dashboard/${result.data.response.user_type}`);
        }

        onSuccess?.();
      } else {
        throw new Error(result.message || "Login failed");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t("errors.loginFailed");
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  function handleGoogleSignUp(): void {
    signInWithGoogle();
  }

  function handleAppleSignUp(): void {
    console.log("Apple Sign Up");
  }

  return (
    <div className="min-h-[93vh] w-full py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md p-2 flex flex-col gap-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-n-7">{t("subtitle")}</p>
        </div>

        <div className="space-y-4">
          {/* Social Login Buttons */}
          <div className="space-y-3 flex flex-col items-center justify-center">
            <GoogleAuthButton handleGoogleSignUp={handleGoogleSignUp} />
            <AppleAuthButton handleAppleSignUp={handleAppleSignUp} />
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className=" px-2 text-n-6">{tCommon("ui.or")}</span>
            </div>
          </div>

          {/* Email + Password */}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                console.log("❌ Validation errors:", errors);
              })}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="emailOrPhone"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      {t("personalInfo.email")} {tCommon("ui.or")}{" "}
                      {t("personalInfo.phoneNumber")}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} dir="ltr" />
                    </FormControl>
                    <FormMessage className="min-h-5" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("personalInfo.password")}</FormLabel>
                    <FormControl>
                      <div className="relative">
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
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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

                    {/* Forgot Password link */}
                    <div className="flex justify-end mt-1 text-design-main">
                      <Link
                        href="/forgot-password"
                        className="text-xs text-design-main hover:underline hover:text-p-5"
                      >
                        {t("forgotPassword")}
                      </Link>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Error Display */}
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("loading") : t("login")}
              </Button>
            </form>
          </Form>

          {/* Already have account? / Create account */}
          <div className="text-center text-sm">
            <p className="text-n-6">
              {t("noAccount")}{" "}
              <Link
                href="/signup"
                className="font-medium text-design-main hover:underline hover:text-p-5"
              >
                {t("createAccount")}
              </Link>
            </p>
          </div>

          {/* Terms and Privacy */}
          <p className="text-xs text-center text-n-6">
            {t("terms.text")}{" "}
            <a href="#" className="underline text-design-main hover:text-p-5">
              {t("terms.termsLink")}
            </a>{" "}
            {t("terms.and")}{" "}
            <a href="#" className="underline text-design-main hover:text-p-5">
              {t("terms.privacyLink")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
