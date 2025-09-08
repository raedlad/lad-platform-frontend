"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
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
import { Eye, EyeOff, CheckCircle, AlertCircle, Lock } from "lucide-react";
import Link from "next/link";
import {
  getPasswordStrength,
  getPasswordStrengthText,
  getPasswordStrengthColor,
} from "@/features/auth/utils/getPasswordStrength";
import { createValidationSchemas } from "@/features/auth/utils/validation";

interface NewPasswordFormProps {
  onSubmit: (password: string) => void;
  isLoading?: boolean;
  isSuccess?: boolean;
  error?: string;
  token?: string;
}

const NewPasswordForm = ({
  onSubmit,
  isLoading = false,
  isSuccess = false,
  error,
  token,
}: NewPasswordFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const t = useTranslations();
  const authT = useTranslations("auth");
  const { NewPasswordSchema } = createValidationSchemas(t);
  type NewPasswordFormData = z.infer<typeof NewPasswordSchema>;

  const form = useForm<NewPasswordFormData>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = form.watch("password");
  const passwordStrength = getPasswordStrength(password || "");

  const handleSubmit = (data: NewPasswordFormData) => {
    if (!token) {
      form.setError("root", { message: "Reset token is missing or expired" });
      return;
    }
    onSubmit(data.password);
  };

  if (isSuccess) {
    return (
      <div className="flex-center">
        <Card className="container-narrow bg-transparent">
          <CardHeader>
            <div className="success-icon-container">
              <CheckCircle className="icon-lg text-green-600" />
            </div>
            <CardTitle className="heading-section">
              {authT("newPassword.success")}
            </CardTitle>
            <CardDescription>
              {authT("newPassword.successDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="btn-full-width">
              <Link href="/login">{authT("newPassword.continueToLogin")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full flex-center">
      <Card className="container-narrow bg-transparent shadow-none  border-none">
        <CardHeader>
          <div className="w-16 h-16 bg-p-5/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="icon-lg text-p-5" />
          </div>
          <CardTitle className="heading-section">
            {authT("newPassword.title")}
          </CardTitle>
          <CardDescription>{authT("newPassword.description")}</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="form-section"
            >
              {error && (
                <div className="flex items-start gap-3 p-4 border border-red-200 bg-red-50 rounded-lg">
                  <AlertCircle className="icon-flex-shrink text-red-600" />
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              )}

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{authT("newPassword.newPassword")}</FormLabel>
                    <FormControl>
                      <div className="input-password-container">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          disabled={isLoading}
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
                      {getPasswordStrengthText(passwordStrength, authT)}
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
                      {authT("newPassword.confirmNewPassword")}
                    </FormLabel>
                    <FormControl>
                      <div className="input-password-container">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          disabled={isLoading}
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

              <Button
                type="submit"
                className="btn-full-width"
                disabled={isLoading}
              >
                {isLoading
                  ? authT("newPassword.updatingPassword")
                  : authT("newPassword.updatePassword")}
              </Button>

              {/* Password Requirements */}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* <div className="text-center mt-6">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm"
        >
          {t("passwordReset.backToLogin")}
        </Link>
      </div> */}
    </div>
  );
};

export default NewPasswordForm;
