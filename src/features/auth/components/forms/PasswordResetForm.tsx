"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Lock,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { twMerge } from "tailwind-merge";

// Validation schema that accepts either email or phone
const passwordResetSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Email or phone number is required")
    .refine((value) => {
      // Check if it's a valid email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      // Check if it's a valid phone (simple check for digits and common phone chars)
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      return emailRegex.test(value) || phoneRegex.test(value);
    }, "Please enter a valid email address or phone number"),
});

type PasswordResetFormData = z.infer<typeof passwordResetSchema>;

interface PasswordResetFormProps {
  onSubmit: (data: { contact: string; type: "email" | "phone" }) => void;
  isLoading?: boolean;
  isSuccess?: boolean;
  error?: string;
  successData?: { contact: string; type: "email" | "phone" };
}

const PasswordResetForm = ({
  onSubmit,
  isLoading = false,
  isSuccess = false,
  error,
  successData,
}: PasswordResetFormProps) => {
  const t = useTranslations("auth");
  const commonT = useTranslations("common");

  const form = useForm<PasswordResetFormData>({
    resolver: zodResolver(passwordResetSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      emailOrPhone: "",
    },
  });

  const detectContactType = (value: string): "email" | "phone" => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? "email" : "phone";
  };

  const handleSubmit = (data: PasswordResetFormData) => {
    const contact = data.emailOrPhone.trim();
    const type = detectContactType(contact);
    onSubmit({ contact, type });
  };

  if (isSuccess && successData) {
    const isEmail = successData.type === "email";
    const contactMethod = isEmail ? "email" : "SMS";
    const checkInstruction = isEmail
      ? "Check your email inbox"
      : "Check your messages";
    const actionInstruction = isEmail
      ? "Click the reset link in the email"
      : "Follow the instructions in the message";

    return (
      <div className="container-narrow">
        <div className="card-elevated">
          <div className="header-centered-padded">
            <div className="success-icon-container">
              <CheckCircle className="icon-lg text-p-5" />
            </div>
            <h2 className="heading-section text-n-9">
              {isEmail ? t("passwordReset.emailSent") : "Check Your Messages"}
            </h2>
            <p className="text-n-6 text-base">
              We've sent a password reset {isEmail ? "link" : "code"} to{" "}
              <strong>{successData.contact}</strong> via {contactMethod}
            </p>
          </div>
          <div className="space-y-4">
            <div className="info-box">
              <div className="info-box-content">
                {isEmail ? (
                  <Mail className="icon-flex-shrink text-blue-600" />
                ) : (
                  <Phone className="icon-flex-shrink text-blue-600" />
                )}
                <div className="info-box-text">
                  <p className="info-box-title">
                    {t("passwordReset.whatNext")}
                  </p>
                  <ul className="info-box-list">
                    <li>• {checkInstruction}</li>
                    <li>• {actionInstruction}</li>
                    <li>• Create a new password</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="text-center-spaced">
              <p className="text-sm text-n-6">
                Didn't receive the {isEmail ? "email" : "message"}?
                {isEmail && " Check your spam folder or"}
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="btn-full-width"
              >
                {t("passwordReset.tryAgain")}
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center-mt">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-n-6 hover:text-n-9 transition-colors"
          >
            <ArrowLeft className="size-4" />
            {t("passwordReset.backToLogin")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-narrow ">
      <div className="">
        <div className="header-centered-padded">
          <div className="w-16 h-16 bg-p-5/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="size-8 text-p-5" />
          </div>
          <h2 className="heading-section text-n-9 mb-2">
            {t("passwordReset.title")}
          </h2>
          <p className="text-n-6 text-base">{t("passwordReset.description")}</p>
        </div>

        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="form-container"
            >
              {error && (
                <div className="flex items-start gap-3 p-4 border border-red-200 bg-red-50 rounded-lg">
                  <AlertCircle className="icon-flex-shrink text-red-600" />
                  <div className="text-sm text-red-800">{error}</div>
                </div>
              )}

              <FormField
                control={form.control}
                name="emailOrPhone"
                render={({ field }) => (
                  <FormItem className="form-field-group">
                    <FormLabel>
                      {t("passwordReset.emailOrPhoneLabel")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input {...field} dir="ltr" disabled={isLoading} />
                      </div>
                    </FormControl>
                    <FormMessage className="form-message-min-height" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="btn-full-width"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-n-4 border-t-n-1 rounded-full animate-spin" />
                    {t("passwordReset.sendingResetCode")}
                  </div>
                ) : (
                  t("passwordReset.sendResetCode")
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <div className="text-center-mt">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-p-7 hover:text-p-5 transition-colors"
        >
          <ArrowLeft className="icon-sm rtl:rotate-180" />
          {t("passwordReset.backToLogin")}
        </Link>
      </div>
    </div>
  );
};

export default PasswordResetForm;
