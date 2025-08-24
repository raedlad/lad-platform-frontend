import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OTPVerificationSchema,
  OTPVerificationInfo,
} from "@auth/utils/validation";
import { Input } from "@shared/components/ui/input";
import { Button } from "@shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/components/ui/form";
import { useTranslations } from "next-intl";

interface OTPVerificationFormProps {
  onSubmit: (data: OTPVerificationInfo) => void;
  onResendCode: () => void;
  isLoading?: boolean;
  contactInfo: string; // Email or phone number for display
}

const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({
  onSubmit,
  onResendCode,
  isLoading,
  contactInfo,
}) => {
  const t = useTranslations("auth");
  const commonT = useTranslations("common");

  const form = useForm<OTPVerificationInfo>({
    resolver: zodResolver(OTPVerificationSchema),
    defaultValues: {
      otp: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-center text-muted-foreground">
          {t("verification.enterCode")} {contactInfo}.
        </p>
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("verification.title")}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="XXXXXX"
                  {...field}
                  disabled={isLoading}
                  maxLength={6}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? commonT("loading") : t("verification.title")}
        </Button>
        <Button
          type="button"
          variant="link"
          className="w-full"
          onClick={onResendCode}
          disabled={isLoading}
        >
          {t("resendCode")}
        </Button>
      </form>
    </Form>
  );
};

export default OTPVerificationForm;
