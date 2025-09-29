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
import { Phone, Mail, UserRound, FileText, Upload, X } from "lucide-react";
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
import { CountrySelection } from "@/shared/components/ui/CoutrySelect";
import { StateSelection } from "@/shared/components/ui/StateSelect";
import { CitySelection } from "@/shared/components/ui/CitySelect";
import { PhoneInput } from "@/features/auth/components/phone-input/PhoneInput";

import { ContractorProfilePersonalInfo } from "@/features/profile/types/contractor";
import { LocationSelectionState } from "@/features/profile/types/api";
import { ContractorPersonalInfoApiData } from "@/features/profile/services/personalInfoApi";
import { createProfileValidationSchemas } from "@/features/profile/utils/validation";
import { usePersonalInfoStore } from "@/features/profile/store/personalInfoStore";
import { useGetCountries, useGetStates } from "@/shared/hooks/globalHooks";
import { cn } from "@/lib/utils";
import { E164Number } from "libphonenumber-js";

export const ContractorPersonalInfo = () => {
  const tContractor = useTranslations("profile.contractor.personalInfo");
  const tCommon = useTranslations("common");
  const store = usePersonalInfoStore();
  const { countries } = useGetCountries();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    contractorPersonalInfo,
    handleContractorPersonalInfoSubmit,
    setContractorPersonalInfo,
    handleContractorProfileFetch,
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
    const { ContractorPersonalInfoProfileSchema } =
      createProfileValidationSchemas(t);
    return ContractorPersonalInfoProfileSchema;
  }, [t]);

  const form = useForm<ContractorProfilePersonalInfo>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      company_name: "",
      authorized_person_name: "",
      authorized_person_phone: "",
      representative_email: "",
      commercial_registration_number: "",
      delegation_form: undefined,
      country_id: "",
      state_id: "",
      city_id: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Fetch profile data on component mount if not available
  useEffect(() => {
    if (!contractorPersonalInfo && !isLoading) {
      handleContractorProfileFetch();
    }
  }, [contractorPersonalInfo, isLoading, handleContractorProfileFetch]);

  // Initialize form with existing data
  useEffect(() => {
    if (!contractorPersonalInfo || !countries) return;

    const formData: ContractorProfilePersonalInfo = {
      company_name: contractorPersonalInfo.company_name || "",
      authorized_person_name:
        contractorPersonalInfo.authorized_person_name || "",
      authorized_person_phone:
        contractorPersonalInfo.authorized_person_phone || "",
      representative_email: contractorPersonalInfo.representative_email || "",
      commercial_registration_number:
        contractorPersonalInfo.commercial_registration_number || "",
      delegation_form: contractorPersonalInfo.delegation_form || undefined,
      country_id: contractorPersonalInfo.country_id || "",
      state_id: contractorPersonalInfo.state_id || "",
      city_id: contractorPersonalInfo.city_id || "",
    };

    form.reset(formData);

    // Set location state based on existing data
    if (contractorPersonalInfo.country_id) {
      const country = countries.find(
        (c) => c.iso2 === contractorPersonalInfo.country_id
      );
      if (country) {
        setLocationState((prev) => ({
          ...prev,
          selectedCountryCode: country.iso2,
          selectedCountryId: country.id,
        }));
      }
    }
  }, [contractorPersonalInfo, countries, form]);

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

      form.setValue("country_id", countryCode);
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

        form.setValue("state_id", stateId);
      } else {
        setLocationState((prev) => ({
          ...prev,
          selectedStateId: null,
          selectedStateCode: null,
        }));

        form.setValue("state_id", "");
      }

      form.setValue("city_id", "");
    },
    [states, form]
  );

  const hasChanged = useMemo(() => {
    if (!contractorPersonalInfo) return false;
    const currentValues = form.getValues();

    // Check if any text fields have changed
    const textFieldsChanged =
      currentValues.company_name !==
        (contractorPersonalInfo.company_name || "") ||
      currentValues.authorized_person_name !==
        (contractorPersonalInfo.authorized_person_name || "") ||
      currentValues.authorized_person_phone !==
        (contractorPersonalInfo.authorized_person_phone || "") ||
      currentValues.representative_email !==
        (contractorPersonalInfo.representative_email || "") ||
      currentValues.commercial_registration_number !==
        (contractorPersonalInfo.commercial_registration_number || "");

    // Check location fields - compare with locationState instead of form values
    const locationChanged =
      locationState.selectedCountryId?.toString() !==
        (contractorPersonalInfo.country_id || "") ||
      locationState.selectedStateId?.toString() !==
        (contractorPersonalInfo.state_id || "") ||
      currentValues.city_id !== (contractorPersonalInfo.city_id || "");

    // Check if delegation form has changed (compare file names and sizes)
    const delegationFormChanged =
      (currentValues.delegation_form &&
        !contractorPersonalInfo.delegation_form) ||
      (!currentValues.delegation_form &&
        contractorPersonalInfo.delegation_form) ||
      (currentValues.delegation_form &&
        contractorPersonalInfo.delegation_form &&
        (currentValues.delegation_form.name !==
          contractorPersonalInfo.delegation_form.name ||
          currentValues.delegation_form.size !==
            contractorPersonalInfo.delegation_form.size));

    return textFieldsChanged || locationChanged || delegationFormChanged;
  }, [form, contractorPersonalInfo, locationState]);

  if (isLoading && !contractorPersonalInfo) {
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
              // Check if data has actually changed before making API call
              if (!hasChanged) {
                toast(tCommon("actions.noChanges"), {
                  duration: 2000,
                  position: "top-right",
                  icon: "ℹ️",
                });
                return;
              }

              const apiData: ContractorPersonalInfoApiData = {
                company_name: data.company_name,
                commercial_registration_number:
                  data.commercial_registration_number,
                authorized_person_name: data.authorized_person_name,
                authorized_person_phone: data.authorized_person_phone,
                representative_email: data.representative_email,
                country_id: locationState.selectedCountryId || null,
                state_id: locationState.selectedStateId || null,
                city_id: null, // Will be handled by location selection
                delegation_form: data.delegation_form,
              };

              try {
                await handleContractorPersonalInfoSubmit(apiData);

                // Only update the store after successful API call
                setContractorPersonalInfo(data);
                toast.success(tCommon("actions.save"), {
                  duration: 3000,
                  position: "top-right",
                });
              } catch (error) {
                toast.error(tCommon("actions.error"), {
                  duration: 4000,
                  position: "top-right",
                });
              }
            })}
            className="form-section"
          >
            <div className="w-full flex items-start gap-4">
              <FormField
                control={form.control}
                name="company_name"
                render={({ field }) => (
                  <FormItem className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <UserRound className="text-muted-foreground/50 p-1" />
                      <FormLabel>{tContractor("companyName")}</FormLabel>
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
                name="authorized_person_name"
                render={({ field }) => (
                  <FormItem className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <UserRound className="text-muted-foreground/50 p-1" />
                      <FormLabel>
                        {tContractor("authorizedPersonName")}
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Input
                        inputMode="text"
                        disabled={isLoading}
                        {...field}
                        value={field.value ?? ""}
                        ref={inputRef}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="representative_email"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Mail className="text-muted-foreground/50 p-1" />
                    <FormLabel>
                      {tContractor("representativeEmail")} *
                    </FormLabel>
                  </div>
                  <FormControl className="relative">
                    <Input
                      dir="ltr"
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

            <FormField
              control={form.control}
              name="authorized_person_phone"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Phone className="text-muted-foreground/50 p-1" />
                    <FormLabel>
                      {tContractor("authorizedPersonPhoneNumber")}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <PhoneInput
                      inputMode="tel"
                      disabled={isLoading}
                      value={field.value as E164Number}
                      onChange={field.onChange}
                      smartCaret={true}
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
                <FormItem className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <UserRound className="text-muted-foreground/50 p-1" />
                    <FormLabel>
                      {tContractor("commercialRegistrationNumber")}
                    </FormLabel>
                  </div>
                  <FormControl className="relative">
                    <Input
                      inputMode="numeric"
                      dir="ltr"
                      className="placeholder:text-center"
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
              name="country_id"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormControl>
                    <CountrySelection
                      selectedCountry={
                        locationState.selectedCountryId?.toString() || ""
                      }
                      onCountryChange={(value) => {
                        handleCountryChange(value);
                        field.onChange(value);
                      }}
                      disabled={isLoading}
                      placeholder={tCommon("select.country")}
                      label={tContractor("country")}
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
                <FormItem className="space-y-0.5">
                  <FormControl>
                    <StateSelection
                      countryCode={locationState.selectedCountryCode}
                      selectedState={
                        locationState.selectedStateId?.toString() || ""
                      }
                      onStateChange={(value) => {
                        handleStateChange(value);
                        field.onChange(value);
                      }}
                      disabled={isLoading}
                      placeholder={tCommon("select.state")}
                      label={tContractor("state")}
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
                <FormItem className="space-y-0.5">
                  <FormControl>
                    <CitySelection
                      stateCode={locationState.selectedStateCode}
                      selectedCity={field.value?.toString() || ""}
                      onCityChange={(value) => {
                        field.onChange(value);
                      }}
                      disabled={isLoading}
                      placeholder={tCommon("select.city")}
                      label={tContractor("city")}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="delegation_form"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <FileText className="text-muted-foreground/50 p-1" />
                    <FormLabel>{tContractor("delegationForm")} *</FormLabel>
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
                          accept=".pdf,.doc,.docx"
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
                                {tContractor("delegationForm")}
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

export default ContractorPersonalInfo;
