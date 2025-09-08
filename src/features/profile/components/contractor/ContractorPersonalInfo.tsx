"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Phone, Mail, UserRound, Pencil, Check } from "lucide-react";
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
import { createProfileValidationSchemas } from "@/features/profile/utils/validation";
import { useTranslations } from "next-intl";
import { usePersonalInfoStore } from "@/features/profile/store/personalInfoStore";
import { ContractorProfilePersonalInfo } from "@/features/profile/types/contractor";
import { ContractorPersonalInfoApiData } from "@/features/profile/services/personalInfoApi";
import LocationSelect from "@/features/profile/components/common/LocationSelect";
import { Upload, X, FileText, Image } from "lucide-react";

export const ContractorPersonalInfo = () => {
  const t = useTranslations();
  const store = usePersonalInfoStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    contractorPersonalInfo,
    handleContractorPersonalInfoSubmit,
    setContractorPersonalInfo,
    isLoading,
    error,
    editing,
    setEditing,
    selectedCountry,
    selectedState,
    selectedCity,
    setSelectedCountry,
    setSelectedState,
    setSelectedCity,
    countries,
    states,
    cities,
  } = store;
  const ContractorPersonalInfoProfileSchema = useMemo(() => {
    const { ContractorPersonalInfoProfileSchema } =
      createProfileValidationSchemas(t);
    return ContractorPersonalInfoProfileSchema;
  }, [t]);

  const form = useForm<ContractorProfilePersonalInfo>({
    resolver: zodResolver(ContractorPersonalInfoProfileSchema),
    defaultValues: contractorPersonalInfo ?? {
      companyName: "",
      authorizedPersonName: "",
      authorizedPersonPhoneNumber: "",
      representativeEmail: "",
      commercialRegistrationNumber: "",
      delegationForm: undefined,
      companyLogo: undefined,
      country: "",
      state: "",
      city: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((values) => {
      if (values) {
        setContractorPersonalInfo(values as ContractorProfilePersonalInfo);
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, setContractorPersonalInfo]);

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

  // Transform form data to match API expectations
  const transformFormDataForAPI = (
    formData: ContractorProfilePersonalInfo
  ): ContractorPersonalInfoApiData => {
    const selectedCountryData = countries?.find(
      (country) => country.iso2 === selectedCountry
    );
    const selectedStateData = states?.find(
      (state) => state.id.toString() === selectedState
    );
    const selectedCityData = cities?.find(
      (city) => city.id.toString() === selectedCity
    );

    return {
      company_name: formData.companyName,
      commercial_registration_number: formData.commercialRegistrationNumber,
      authorized_person_name: formData.authorizedPersonName,
      authorized_person_phone: formData.authorizedPersonPhoneNumber,
      representative_email: formData.representativeEmail || "",
      country_id: selectedCountryData?.id || null,
      state_id: selectedStateData?.id || null,
      city_id: selectedCityData?.id || null,
      delegation_form: formData.delegationForm,
      avatar: formData.companyLogo,
    };
  };

  // Handle form submission with transformed data
  const handleFormSubmit = async (formData: ContractorProfilePersonalInfo) => {
    console.log("Form data before transformation:", formData);
    const transformedData = transformFormDataForAPI(formData);
    console.log("Transformed data for API:", transformedData);
    await handleContractorPersonalInfoSubmit(transformedData);
  };
  return (
    <div className={cn("space-y-4 sm:space-y-6")}>
      <div className="w-full form-container max-w-md sm:min-w-xs">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="form-section"
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
            {/* Company Name */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex  items-center gap-2">
                    <UserRound className="text-muted-foreground/50 p-1" />
                    <FormLabel>
                      {t("profile.contractor.personalInfo.companyName")}
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
            {/* Authorized Person Name */}
            <FormField
              control={form.control}
              name="authorizedPersonName"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex  items-center gap-2">
                    <UserRound className="text-muted-foreground/50 p-1" />
                    <FormLabel>
                      {t(
                        "profile.contractor.personalInfo.authorizedPersonName"
                      )}
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

            {/* Representative Email */}
            <FormField
              control={form.control}
              name="representativeEmail"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex  items-center gap-2">
                    <Mail className="text-muted-foreground/50 p-1" />
                    <FormLabel>
                      {t("profile.contractor.personalInfo.representativeEmail")}{" "}
                      *
                    </FormLabel>
                  </div>
                  <FormControl className="relative">
                    <Input
                      dir="ltr"
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
                      {t(
                        "profile.contractor.personalInfo.authorizedPersonPhoneNumber"
                      )}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <PhoneInput
                      inputMode="tel"
                      disabled={isLoading || !editing}
                      value={field.value}
                      onChange={field.onChange}
                      smartCaret={true}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Commercial Registration Number */}
            <FormField
              control={form.control}
              name="commercialRegistrationNumber"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex  items-center gap-2">
                    <UserRound className="text-muted-foreground/50 p-1" />
                    <FormLabel>
                      {t(
                        "profile.contractor.personalInfo.commercialRegistrationNumber"
                      )}
                    </FormLabel>
                  </div>
                  <FormControl className="relative">
                    <Input
                      inputMode="numeric"
                      dir="ltr"
                      className="placeholder:text-center"
                      disabled={isLoading || !editing}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            {/* Location Select */}
            <LocationSelect
              selectedCountry={selectedCountry || undefined}
              selectedState={selectedState || undefined}
              selectedCity={selectedCity || undefined}
              onCountryChange={(countryCode) => {
                setSelectedCountry(countryCode);
                // Store the country code in form for display, but we'll use ID for API
                form.setValue("country", countryCode);
              }}
              onStateChange={(stateCode) => {
                setSelectedState(stateCode);
                // Store the state code in form for display, but we'll use ID for API
                form.setValue("state", stateCode);
              }}
              onCityChange={(cityCode) => {
                setSelectedCity(cityCode);
                // Store the city code in form for display, but we'll use ID for API
                form.setValue("city", cityCode);
              }}
              disabled={isLoading || !editing}
            />
            {/* Delegation Form Upload */}
            <FormField
              control={form.control}
              name="delegationForm"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <FileText className="text-muted-foreground/50 p-1" />
                    <FormLabel>
                      {t("profile.contractor.personalInfo.delegationForm")} *
                    </FormLabel>
                  </div>
                  <FormControl>
                    <div className="space-y-2">
                      <div
                        className={cn(
                          "border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer",
                          "hover:bg-muted/50 hover:border-muted-foreground/50",
                          field.value
                            ? "border-green-500 bg-green-50/50"
                            : "border-muted-foreground/25",
                          (isLoading || !editing) &&
                            "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => {
                          if (!isLoading && editing) {
                            document
                              .getElementById("delegation-form-upload")
                              ?.click();
                          }
                        }}
                      >
                        <input
                          id="delegation-form-upload"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.webp"
                          className="hidden"
                          disabled={isLoading || !editing}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Validate file size (8MB max)
                              if (file.size > 8 * 1024 * 1024) {
                                form.setError("delegationForm", {
                                  message: "File size must be less than 8MB",
                                });
                                return;
                              }
                              // Validate file type
                              const allowedTypes = [
                                "application/pdf",
                                "image/jpeg",
                                "image/jpg",
                                "image/png",
                                "image/webp",
                              ];
                              if (!allowedTypes.includes(file.type)) {
                                form.setError("delegationForm", {
                                  message:
                                    "Only PDF, JPG, JPEG, PNG, WEBP files are allowed",
                                });
                                return;
                              }
                              field.onChange(file);
                              form.clearErrors("delegationForm");
                            }
                          }}
                        />
                        <div className="flex flex-col items-center gap-2 text-center">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <Upload className="w-4 h-4 text-muted-foreground" />
                          </div>
                          {field.value ? (
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-green-700">
                                {field.value.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(field.value.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  field.onChange(undefined);
                                }}
                                className="h-6 px-2 text-xs"
                                disabled={isLoading || !editing}
                              >
                                <X className="w-3 h-3 mr-1" />
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-sm font-medium">
                                Click to upload delegation form
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PDF, JPG, JPEG, PNG, WEBP (max 8MB)
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            {/* Company Logo Upload */}
            <FormField
              control={form.control}
              name="companyLogo"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Image className="text-muted-foreground/50 p-1" />
                    <FormLabel>
                      {t("profile.contractor.personalInfo.companyLogo")} *
                    </FormLabel>
                  </div>
                  <FormControl>
                    <div className="space-y-2">
                      <div
                        className={cn(
                          "border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer",
                          "hover:bg-muted/50 hover:border-muted-foreground/50",
                          field.value
                            ? "border-green-500 bg-green-50/50"
                            : "border-muted-foreground/25",
                          (isLoading || !editing) &&
                            "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => {
                          if (!isLoading && editing) {
                            document
                              .getElementById("company-logo-upload")
                              ?.click();
                          }
                        }}
                      >
                        <input
                          id="company-logo-upload"
                          type="file"
                          accept=".jpg,.jpeg,.png,.webp,.svg"
                          className="hidden"
                          disabled={isLoading || !editing}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Validate file size (4MB max)
                              if (file.size > 4 * 1024 * 1024) {
                                form.setError("companyLogo", {
                                  message: "File size must be less than 4MB",
                                });
                                return;
                              }
                              // Validate file type
                              const allowedTypes = [
                                "image/jpeg",
                                "image/jpg",
                                "image/png",
                                "image/webp",
                                "image/svg+xml",
                              ];
                              if (!allowedTypes.includes(file.type)) {
                                form.setError("companyLogo", {
                                  message:
                                    "Only JPG, JPEG, PNG, WEBP, SVG files are allowed",
                                });
                                return;
                              }
                              field.onChange(file);
                              form.clearErrors("companyLogo");
                            }
                          }}
                        />
                        <div className="flex flex-col items-center gap-2 text-center">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <Upload className="w-4 h-4 text-muted-foreground" />
                          </div>
                          {field.value ? (
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-green-700">
                                {field.value.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(field.value.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  field.onChange(undefined);
                                }}
                                className="h-6 px-2 text-xs"
                                disabled={isLoading || !editing}
                              >
                                <X className="w-3 h-3 mr-1" />
                                Remove
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-sm font-medium">
                                Click to upload company logo
                              </p>
                              <p className="text-xs text-muted-foreground">
                                JPG, JPEG, PNG, WEBP, SVG (max 4MB)
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
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

export default ContractorPersonalInfo;
