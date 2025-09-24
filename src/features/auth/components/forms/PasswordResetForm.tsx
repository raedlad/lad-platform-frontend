"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
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
import { createValidationSchemas } from "@/features/auth/utils/validation";
import { z } from "zod";
// Validation schema that accepts either email or phone

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
  const authT = useTranslations("auth");
  const t = useTranslations();
  const { passwordResetSchema } = createValidationSchemas(t);
  const form = useForm<z.infer<typeof passwordResetSchema>>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      emailOrPhone: "",
    },
  });

  const detectContactType = (value: string): "email" | "phone" => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? "email" : "phone";
  };

  const handleSubmit = (data: z.infer<typeof passwordResetSchema>) => {
    const contact = data.emailOrPhone.trim();
    const type = detectContactType(contact);
    onSubmit({ contact, type });
  };

  if (isSuccess && successData) {
    const isEmail = successData.type === "email";
    const contactMethod = isEmail ? "email" : "SMS";
    const checkInstruction = isEmail
      ? authT("passwordReset.checkEmail")
      : authT("passwordReset.checkMessages");
    const actionInstruction = isEmail
      ? authT("passwordReset.clickResetLink")
      : authT("passwordReset.followInstructions");

    return (
      <div className="container-narrow">
        <div className="card-elevated dark:bg-gradient-to-br dark:from-gray-800 dark:to-gray-900/50">
          <div className="header-centered-padded">
            <div className="success-icon-container dark:bg-green-900/20">
              <CheckCircle className="icon-lg text-p-5 dark:text-green-400" />
            </div>
            <h2 className="heading-section text-n-9 dark:text-gray-100">
              {isEmail
                ? authT("passwordReset.emailSent")
                : authT("passwordReset.checkMessages")}
            </h2>
            <p className="text-n-6 text-base dark:text-gray-300">
              {authT("passwordReset.sentPasswordReset")}{" "}
              {isEmail ? "link" : "code"} to{" "}
              <strong className="dark:text-gray-100">
                {successData.contact}
              </strong>{" "}
              via {contactMethod}
            </p>
          </div>
          <div className="space-y-4">
            <div className="info-box dark:bg-blue-900/20 dark:border-blue-700">
              <div className="info-box-content">
                {isEmail ? (
                  <Mail className="icon-flex-shrink text-blue-600 dark:text-blue-400" />
                ) : (
                  <Phone className="icon-flex-shrink text-blue-600 dark:text-blue-400" />
                )}
                <div className="info-box-text dark:text-blue-200">
                  <p className="info-box-title dark:text-blue-100">
                    {authT("passwordReset.whatNext")}
                  </p>
                  <ul className="info-box-list dark:text-blue-300">
                    <li>• {checkInstruction}</li>
                    <li>• {actionInstruction}</li>
                    <li>• {authT("passwordReset.createNewPassword")}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="text-center-spaced">
              <p className="text-sm text-n-6 dark:text-gray-300">
                {authT("passwordReset.didNotReceive")}{" "}
                {isEmail ? "email" : "message"}?
                {isEmail && " Check your spam folder or"}
              </p>
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="btn-full-width dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {authT("passwordReset.tryAgain")}
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center-mt">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-n-6 hover:text-n-9 transition-colors dark:text-gray-300 dark:hover:text-gray-100"
          >
            <ArrowLeft className="size-4" />
            {authT("passwordReset.backToLogin")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-narrow ">
      <div className="">
        <div className="header-centered-padded">
          <div className="w-16 h-16 bg-p-5/10 dark:bg-p-5/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="size-8 text-p-5 dark:text-p-4" />
          </div>
          <h2 className="heading-section text-n-9 dark:text-gray-100 mb-2">
            {authT("passwordReset.title")}
          </h2>
          <p className="text-n-6 text-base dark:text-gray-300">
            {authT("passwordReset.description")}
          </p>
        </div>

        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="form-container"
            >
              {error && (
                <div className="flex items-start gap-3 p-4 border border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 rounded-lg">
                  <AlertCircle className="icon-flex-shrink text-red-600 dark:text-red-400" />
                  <div className="text-sm text-red-800 dark:text-red-200">
                    {error}
                  </div>
                </div>
              )}

              <FormField
                control={form.control}
                name="emailOrPhone"
                render={({ field }) => (
                  <FormItem className="form-field-group">
                    <FormLabel className="dark:text-gray-200">
                      {authT("passwordReset.emailOrPhoneLabel")}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          dir="ltr"
                          disabled={isLoading}
                          className="dark:text-gray-100 dark:placeholder-gray-400"
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="form-message-min-height dark:text-red-400" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="btn-full-width dark:bg-p-6 dark:hover:bg-p-7 dark:text-white"
                disabled={isLoading || !form.formState.isValid}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-n-4 border-t-n-1 dark:border-gray-400 dark:border-t-gray-100 rounded-full animate-spin" />
                    {authT("passwordReset.sendingResetCode")}
                  </div>
                ) : (
                  authT("passwordReset.sendResetCode")
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>

      <div className="text-center-mt">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-p-7 hover:text-p-5 transition-colors dark:text-gray-300 dark:hover:text-gray-100"
        >
          <ArrowLeft className="icon-sm rtl:rotate-180" />
          {authT("passwordReset.backToLogin")}
        </Link>
      </div>
    </div>
  );
};

export default PasswordResetForm;
