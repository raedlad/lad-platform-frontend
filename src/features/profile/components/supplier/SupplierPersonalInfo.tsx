"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  UserRound,
  FileText,
  CheckCircle,
  Building2,
  Briefcase,
  Mail,
  Phone,
  Upload,
  X,
  Image,
} from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { CountrySelection } from "@/shared/components/ui/CoutrySelect";
import { StateSelection } from "@/shared/components/ui/StateSelect";
import { CitySelection } from "@/shared/components/ui/CitySelect";
import { PhoneInput } from "@/features/auth/components/phone-input/PhoneInput";

import { SupplierProfilePersonalInfo } from "@/features/profile/types/supplier";
import { LocationSelectionState } from "@/features/profile/types/api";
import { createProfileValidationSchemas } from "@/features/profile/utils/validation";
import { usePersonalInfoStore } from "@/features/profile/store/personalInfoStore";
import { useGetCountries, useGetStates } from "@/shared/hooks/globalHooks";
import { cn } from "@/lib/utils";
import { E164Number } from "libphonenumber-js";

export const SupplierPersonalInfo = () => {
  const tSupplier = useTranslations("profile.supplier.personalInfo");
  const tCommon = useTranslations("common");
  const store = usePersonalInfoStore();
  const { countries } = useGetCountries();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    supplierPersonalInfo,
    handleSupplierPersonalInfoSubmit,
    setSupplierPersonalInfo,
    handleSupplierProfileFetch,
    isLoading,
    error,
  } = store;

  const [locationState, setLocationState] = useState<LocationSelectionState>({
    selectedCountryCode: null,
    selectedStateCode: null,
    selectedStateId: null,
    selectedCountryId: null,
  });

  const { states } = useGetStates(locationState.selectedCountryCode);
  const t = useTranslations();
  const validationSchema = useMemo(() => {
    const { SupplierPersonalInfoProfileSchema } =
      createProfileValidationSchemas(t);
    return SupplierPersonalInfoProfileSchema;
  }, [t]);

  const form = useForm<SupplierProfilePersonalInfo>({
    resolver: zodResolver(validationSchema) as any,
    defaultValues: {
      company_name: "",
      commercial_registration_number: "",
      authorized_person_name: "",
      authorized_person_phone: "",
      representative_email: "",
      country_id: null,
      city_id: null,
      state_id: null,
      delegation_form: null,
      avatar: null,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  // Fetch profile data on component mount if not available
  useEffect(() => {
    if (!supplierPersonalInfo && !isLoading && !error) {
      handleSupplierProfileFetch();
    }
  }, [supplierPersonalInfo, isLoading, error, handleSupplierProfileFetch]);

  // Initialize form with existing data
  useEffect(() => {
    if (!supplierPersonalInfo || !countries) return;

    const formData: SupplierProfilePersonalInfo = {
      company_name: supplierPersonalInfo.company_name || "",
      commercial_registration_number:
        supplierPersonalInfo.commercial_registration_number || "",
      authorized_person_name: supplierPersonalInfo.authorized_person_name || "",
      authorized_person_phone:
        supplierPersonalInfo.authorized_person_phone || "",
      representative_email: supplierPersonalInfo.representative_email || "",
      country_id: supplierPersonalInfo.country_id || null,
      city_id: supplierPersonalInfo.city_id || null,
      state_id: supplierPersonalInfo.state_id || null,
      delegation_form: supplierPersonalInfo.delegation_form || null,
      avatar: supplierPersonalInfo.avatar || null,
    };

    form.reset(formData);

    // Set location state based on existing data
    if (supplierPersonalInfo.country_id) {
      const country = countries.find(
        (c) => c.id === supplierPersonalInfo.country_id
      );
      if (country) {
        setLocationState((prev) => ({
          ...prev,
          selectedCountryCode: country.iso2,
          selectedCountryId: country.id,
        }));
      }
    }
  }, [supplierPersonalInfo, countries, form]);

  const handleCountryChange = useCallback(
    (countryCode: string) => {
      const country = countries?.find((c) => c.iso2 === countryCode);

      setLocationState((prev) => ({
        ...prev,
        selectedCountryCode: countryCode,
        selectedCountryId: country?.id || null,
        selectedStateCode: null,
        selectedStateId: null,
      }));

      form.setValue("country_id", country?.id || null);
    },
    [countries, form]
  );

  const handleStateChange = useCallback(
    (stateId: string) => {
      if (stateId) {
        const stateIdNumber = Number(stateId);
        const state = states?.find((s) => s.id === stateIdNumber);

        setLocationState((prev) => ({
          ...prev,
          selectedStateId: stateIdNumber,
          selectedStateCode: stateId,
        }));

        form.setValue("state_id", stateIdNumber);
      } else {
        setLocationState((prev) => ({
          ...prev,
          selectedStateId: null,
          selectedStateCode: null,
        }));

        form.setValue("state_id", null);
      }

      form.setValue("city_id", null);
    },
    [states, form]
  );

  const hasChanged = useMemo(() => {
    if (!supplierPersonalInfo) return true; // Allow changes if no existing data
    const currentValues = form.getValues();

    // Check text fields
    const textFieldsChanged =
      currentValues.company_name !==
        (supplierPersonalInfo.company_name || "") ||
      currentValues.commercial_registration_number !==
        (supplierPersonalInfo.commercial_registration_number || "") ||
      currentValues.authorized_person_name !==
        (supplierPersonalInfo.authorized_person_name || "") ||
      currentValues.authorized_person_phone !==
        (supplierPersonalInfo.authorized_person_phone || "") ||
      currentValues.representative_email !==
        (supplierPersonalInfo.representative_email || "");

    // Check location fields
    const locationChanged =
      locationState.selectedCountryId !== supplierPersonalInfo.country_id ||
      locationState.selectedStateId !== supplierPersonalInfo.state_id ||
      currentValues.city_id !== supplierPersonalInfo.city_id;

    // Check if files have changed
    const delegationFormChanged =
      (currentValues.delegation_form &&
        !supplierPersonalInfo.delegation_form) ||
      (!currentValues.delegation_form &&
        supplierPersonalInfo.delegation_form) ||
      (currentValues.delegation_form &&
        supplierPersonalInfo.delegation_form &&
        (currentValues.delegation_form.name !==
          supplierPersonalInfo.delegation_form.name ||
          currentValues.delegation_form.size !==
            supplierPersonalInfo.delegation_form.size));

    const avatarChanged =
      (currentValues.avatar && !supplierPersonalInfo.avatar) ||
      (!currentValues.avatar && supplierPersonalInfo.avatar) ||
      (currentValues.avatar &&
        supplierPersonalInfo.avatar &&
        (currentValues.avatar.name !== supplierPersonalInfo.avatar.name ||
          currentValues.avatar.size !== supplierPersonalInfo.avatar.size));

    return (
      textFieldsChanged ||
      locationChanged ||
      delegationFormChanged ||
      avatarChanged
    );
  }, [form, supplierPersonalInfo, locationState]);

  if (isLoading && !supplierPersonalInfo) {
    return (
      <div
        className={cn(
          "space-y-4 sm:space-y-6 flex items-center justify-center"
        )}
      >
        <div className="w-full form-container max-w-md sm:min-w-xs">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-20 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("space-y-4 sm:space-y-6 flex items-center justify-center")}
    >
      <div className="w-full form-container max-w-md sm:min-w-xs">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(async (data) => {
              // Trigger validation to show field errors
              const isValid = await form.trigger();
              if (!isValid) {
                return; // Stop submission if validation fails
              }

              // Check if data has actually changed before making API call
              if (!hasChanged) {
                toast(tSupplier("noChanges"), {
                  duration: 2000,
                  position: "top-right",
                  icon: "ℹ️",
                });
                return;
              }

              const apiData: SupplierProfilePersonalInfo = {
                company_name: data.company_name.trim(),
                commercial_registration_number:
                  data.commercial_registration_number.trim(),
                authorized_person_name: data.authorized_person_name.trim(),
                authorized_person_phone: data.authorized_person_phone.trim(),
                representative_email: data.representative_email.trim(),
                country_id: locationState.selectedCountryId,
                city_id: data.city_id,
                state_id: locationState.selectedStateId,
                delegation_form: data.delegation_form,
                avatar: data.avatar,
              };

              try {
                const result = await handleSupplierPersonalInfoSubmit(apiData);
                if (result?.success) {
                  toast.success(tSupplier("success"), {
                    duration: 3000,
                    position: "top-right",
                  });
                } else {
                  toast.error(result?.message || tSupplier("error"), {
                    duration: 4000,
                    position: "top-right",
                  });
                }
              } catch (error) {
                console.error(
                  "Error submitting supplier personal info:",
                  error
                );
                toast.error(tSupplier("error"), {
                  duration: 4000,
                  position: "top-right",
                });
              }
            })}
            className="form-section space-y-6"
          >
            {/* Company Information Section */}
            <div className="space-y-4">
              <div className="w-full flex flex-col sm:flex-row items-start gap-4">
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem className="space-y-0.5 flex-1 w-full">
                      <div className="flex items-center gap-2">
                        <Building2 className="text-design-main p-1" />
                        <FormLabel>
                          {tSupplier("companyName")}{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          inputMode="text"
                          disabled={isLoading}
                          autoFocus={true}
                          {...field}
                          value={field.value ?? ""}
                          ref={inputRef}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="commercial_registration_number"
                  render={({ field }) => (
                    <FormItem className="space-y-0.5 flex-1 w-full">
                      <div className="flex items-center gap-2">
                        <FileText className="text-design-main p-1" />
                        <FormLabel>
                          {tSupplier("commercialRegistrationNumber")}{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          inputMode="text"
                          disabled={isLoading}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Authorized Person Section */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="authorized_person_name"
                render={({ field }) => (
                  <FormItem className="space-y-0.5 w-full">
                    <div className="flex items-center gap-2">
                      <UserRound className="text-design-main p-1" />
                      <FormLabel>
                        {tSupplier("authorizedPersonName")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                    </div>
                    <FormControl className="relative">
                      <Input
                        inputMode="text"
                        disabled={isLoading}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <div className="w-full flex flex-col sm:flex-row items-start gap-4">
                <FormField
                  control={form.control}
                  name="authorized_person_phone"
                  render={({ field }) => (
                    <FormItem className="space-y-0.5 flex-1 w-full">
                      <div className="flex items-center gap-2">
                        <Phone className="text-design-main p-1" />
                        <FormLabel>
                          {tSupplier("phoneNumber")}{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          inputMode="tel"
                          disabled={isLoading}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="representative_email"
                  render={({ field }) => (
                    <FormItem className="space-y-0.5 flex-1 w-full">
                      <div className="flex items-center gap-2">
                        <Mail className="text-design-main p-1" />
                        <FormLabel>
                          {tSupplier("email")}{" "}
                          <span className="text-red-500">*</span>
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Input
                          inputMode="email"
                          disabled={isLoading}
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="country_id"
                render={({ field }) => (
                  <FormItem className="space-y-0.5 w-full">
                    <FormControl>
                      <CountrySelection
                        selectedCountry={
                          locationState.selectedCountryCode || ""
                        }
                        onCountryChange={(value) => {
                          handleCountryChange(value);
                          const country = countries?.find(
                            (c) => c.iso2 === value
                          );
                          field.onChange(country?.id || null);
                        }}
                        disabled={isLoading}
                        placeholder={tCommon("select.country")}
                        label={tSupplier("country")}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state_id"
                render={({ field }) => (
                  <FormItem className="space-y-0.5 w-full">
                    <FormControl>
                      <StateSelection
                        countryCode={locationState.selectedCountryCode}
                        selectedState={
                          locationState.selectedStateId?.toString() || ""
                        }
                        onStateChange={(value) => {
                          handleStateChange(value);
                          field.onChange(value ? Number(value) : null);
                        }}
                        disabled={isLoading}
                        placeholder={tCommon("select.state")}
                        label={tSupplier("state")}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city_id"
                render={({ field }) => (
                  <FormItem className="space-y-0.5 w-full">
                    <FormControl>
                      <CitySelection
                        stateCode={locationState.selectedStateCode}
                        selectedCity={field.value?.toString() || ""}
                        onCityChange={(value) => {
                          field.onChange(value ? Number(value) : null);
                        }}
                        disabled={isLoading}
                        placeholder={tCommon("select.city")}
                        label={tSupplier("city")}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="delegation_form"
                render={({ field }) => (
                  <FormItem className="space-y-0.5 w-full">
                    <div className="flex items-center gap-2">
                      <FileText className="text-design-main p-1" />
                      <FormLabel>
                        {tSupplier("delegationForm")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                    </div>
                    <FormControl>
                      <div className="space-y-2">
                        <div
                          className={cn(
                            "border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer",
                            "hover:bg-muted/50 hover:border-muted-foreground/50",
                            field.value
                              ? "border-design-main"
                              : "border-muted-foreground/25",
                            isLoading && "opacity-50 cursor-not-allowed"
                          )}
                          onClick={() => {
                            if (!isLoading) {
                              document
                                .getElementById("delegation-form-upload")
                                ?.click();
                            }
                          }}
                        >
                          <input
                            id="delegation-form-upload"
                            type="file"
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                            className="hidden"
                            disabled={isLoading}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Validate file size (8MB max)
                                if (file.size > 8 * 1024 * 1024) {
                                  form.setError("delegation_form", {
                                    message: tCommon("fileErrors.maxSize", {
                                      maxSizeMB: "8",
                                    }),
                                  });
                                  return;
                                }
                                // Validate file type
                                const allowedTypes = [
                                  "application/pdf",
                                  "application/msword",
                                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                                  "image/jpeg",
                                  "image/jpg",
                                  "image/png",
                                  "image/webp",
                                ];
                                if (!allowedTypes.includes(file.type)) {
                                  form.setError("delegation_form", {
                                    message: tCommon("fileErrors.invalidFile"),
                                  });
                                  return;
                                }
                                field.onChange(file);
                                form.clearErrors("delegation_form");
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
                                  {(field.value.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB
                                </p>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    field.onChange(null);
                                  }}
                                  className="h-6 px-2 text-xs"
                                  disabled={isLoading}
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  {tCommon("actions.remove")}
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <p className="text-sm font-medium">
                                  {tCommon("actions.upload")}{" "}
                                  {tSupplier("delegationForm")}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  PDF, DOC, DOCX, JPG, JPEG, PNG, WEBP (max 8MB)
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

              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem className="space-y-0.5 w-full">
                    <div className="flex items-center gap-2">
                      <Image className="text-design-main p-1" />
                      <FormLabel>
                        {tSupplier("companyLogo")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                    </div>
                    <FormControl>
                      <div className="space-y-2">
                        <div
                          className={cn(
                            "border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer",
                            "hover:bg-muted/50 hover:border-muted-foreground/50",
                            field.value
                              ? "border-design-main"
                              : "border-muted-foreground/25",
                            isLoading && "opacity-50 cursor-not-allowed"
                          )}
                          onClick={() => {
                            if (!isLoading) {
                              document.getElementById("avatar-upload")?.click();
                            }
                          }}
                        >
                          <input
                            id="avatar-upload"
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp,.svg"
                            className="hidden"
                            disabled={isLoading}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                // Validate file size (4MB max)
                                if (file.size > 4 * 1024 * 1024) {
                                  form.setError("avatar", {
                                    message: tCommon("fileErrors.maxSize", {
                                      maxSizeMB: "4",
                                    }),
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
                                  form.setError("avatar", {
                                    message: tCommon("fileErrors.invalidFile"),
                                  });
                                  return;
                                }
                                field.onChange(file);
                                form.clearErrors("avatar");
                              }
                            }}
                          />
                          <div className="flex flex-col items-center gap-2 text-center">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                              <Image className="w-4 h-4 text-muted-foreground" />
                            </div>
                            {field.value ? (
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-green-700">
                                  {field.value.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(field.value.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB
                                </p>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    field.onChange(null);
                                  }}
                                  className="h-6 px-2 text-xs"
                                  disabled={isLoading}
                                >
                                  <X className="w-3 h-3 mr-1" />
                                  {tCommon("actions.remove")}
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <p className="text-sm font-medium">
                                  {tCommon("actions.upload")}{" "}
                                  {tSupplier("companyLogo")}
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
            </div>

            {error && !supplierPersonalInfo && (
              <div className="m-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm mb-2">{error}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSupplierProfileFetch()}
                  disabled={isLoading}
                  className="text-red-700 border-red-300 hover:bg-red-100"
                >
                  {isLoading
                    ? tCommon("actions.retrying")
                    : tCommon("actions.retry")}
                </Button>
              </div>
            )}

            {error && supplierPersonalInfo && (
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
              disabled={isLoading || !hasChanged}
            >
              {isLoading ? tCommon("actions.saving") : tCommon("actions.save")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SupplierPersonalInfo;
