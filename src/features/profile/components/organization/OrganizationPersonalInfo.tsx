"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Phone,
  Mail,
  UserRound,
  Pencil,
  Check,
  X,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PhoneInput } from "@/features/auth/components/phone-input/PhoneInput";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { OrganizationProfilePersonalInfo } from "@/features/profile/types/organization";
import { createProfileValidationSchemas } from "@/features/profile/utils/validation";
import { useTranslations } from "next-intl";
import { usePersonalInfoStore } from "@/features/profile/store/personalInfoStore";
import { E164Number } from "libphonenumber-js";

export const OrganizationPersonalInfo = () => {
  const t = useTranslations();
  const store = usePersonalInfoStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    organizationPersonalInfo,
    handleOrganizationPersonalInfoSubmit,
    setOrganizationPersonalInfo,
    isLoading,
    error,
    editing,
    setEditing,
  } = store;
  const OrganizationPersonalInfoProfileSchema = useMemo(() => {
    const { OrganizationPersonalInfoProfileSchema } =
      createProfileValidationSchemas(t);
    return OrganizationPersonalInfoProfileSchema;
  }, [t]);

  const form = useForm<OrganizationProfilePersonalInfo>({
    resolver: zodResolver(OrganizationPersonalInfoProfileSchema),
    defaultValues: organizationPersonalInfo ?? {
      organizationName: "",
      authorizedPersonName: "",
      organizationEmail: "",
      authorizedPersonPhoneNumber: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values) {
        setOrganizationPersonalInfo(values as OrganizationProfilePersonalInfo);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setOrganizationPersonalInfo]);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);
  const handleEdit = () => {
    setEditing(true);
    inputRef.current?.focus();
  };
  const handleCancel = () => {
    setEditing(false);
    inputRef.current?.blur();
  };
  return (
    <div className={cn("space-y-4 sm:space-y-6")}>
      <div className="w-full form-container max-w-md sm:min-w-xs">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleOrganizationPersonalInfoSubmit)}
            className="form-section "
          >
            <div className="flex justify-end">
              {!editing && (
                <Button type="button" onClick={handleEdit}>
                  <Pencil className="w-4 h-4" />
                </Button>
              )}
              {editing && (
                <Button type="button" onClick={handleCancel}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex  items-center gap-2">
                    <Building2 className="text-muted-foreground/50 p-1" />
                    <FormLabel>
                      {t("profile.organization.personalInfo.organizationName")}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Input
                      inputMode="text"
                      disabled={isLoading || !editing}
                      autoFocus={true}
                      {...field}
                      ref={inputRef}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="authorizedPersonName"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex  items-center gap-2">
                    <UserRound className="text-muted-foreground/50 p-1" />
                    <FormLabel>
                      {t(
                        "profile.organization.personalInfo.authorizedPersonName"
                      )}
                    </FormLabel>
                  </div>
                  <FormControl className="relative">
                    <Input
                      inputMode="text"
                      className="placeholder:text-center"
                      disabled={isLoading || !editing}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            {/* Email */}
            <FormField
              control={form.control}
              name="organizationEmail"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex  items-center gap-2">
                    <Mail className="text-muted-foreground/50 p-1" />
                    <FormLabel>
                      {t("profile.organization.personalInfo.email")}
                    </FormLabel>
                  </div>
                  <FormControl className="relative">
                    <Input
                      inputMode="email"
                      disabled={isLoading || !editing}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="authorizedPersonPhoneNumber"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex  items-center gap-2">
                    <Phone className="text-muted-foreground/50 p-1" />
                    <FormLabel>
                      {t("profile.organization.personalInfo.phoneNumber")}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <PhoneInput
                      inputMode="tel"
                      disabled={isLoading || !editing}
                      value={field.value as E164Number}
                      onChange={field.onChange}
                      smartCaret={true}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {error && (
              <div className="m-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className={cn(
                "btn-full-width",
                isLoading && "cursor-not-allowed bg-gray-300"
              )}
              disabled={isLoading || !editing}
            >
              {isLoading
                ? t("common.actions.saving")
                : t("common.actions.save")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default OrganizationPersonalInfo;
