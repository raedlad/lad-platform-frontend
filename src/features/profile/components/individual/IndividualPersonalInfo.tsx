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
import { IdCard, MapPin, MessageSquare, UserRound } from "lucide-react";
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

import { IndividualProfilePersonalInfo } from "@/features/profile/types/individual";
import {
  IndividualPersonalInfoApiData,
  IndividualPersonalInfoFormData,
  LocationSelectionState,
} from "@/features/profile/types/api";
import { createProfileValidationSchemas } from "@/features/profile/utils/validation";
import { usePersonalInfoStore } from "@/features/profile/store/personalInfoStore";
import { useGetCountries, useGetStates } from "@/shared/hooks/globalHooks";
import { cn } from "@/lib/utils";

export const IndividualPersonalInfo = () => {
  const t = useTranslations();
  const store = usePersonalInfoStore();
  const { countries } = useGetCountries();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    individualPersonalInfo,
    handleIndividualPersonalInfoSubmit,
    setIndividualPersonalInfo,
    handleIndividualProfileFetch,
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

  const validationSchema = useMemo(() => {
    const { IndividualProfilePersonalInfoSchema } =
      createProfileValidationSchemas(t);
    return IndividualProfilePersonalInfoSchema;
  }, [t]);

  const form = useForm<IndividualPersonalInfoFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      country_id: null,
      city_id: null,
      state_id: null,
      national_id: "",
      detailed_address: "",
      about_me: "",
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Fetch profile data on component mount if not available
  useEffect(() => {
    if (!individualPersonalInfo && !isLoading) {
      handleIndividualProfileFetch();
    }
  }, [individualPersonalInfo, isLoading, handleIndividualProfileFetch]);

  // Initialize form with existing data
  useEffect(() => {
    if (!individualPersonalInfo || !countries) return;

    const formData: IndividualPersonalInfoFormData = {
      first_name: individualPersonalInfo.first_name || "",
      last_name: individualPersonalInfo.last_name || "",
      country_id: individualPersonalInfo.country_id
        ? Number(individualPersonalInfo.country_id)
        : null,
      city_id: individualPersonalInfo.city_id
        ? Number(individualPersonalInfo.city_id)
        : null,
      state_id: individualPersonalInfo.state_id
        ? Number(individualPersonalInfo.state_id)
        : null,
      national_id: individualPersonalInfo.national_id || "",
      detailed_address: individualPersonalInfo.detailed_address || "",
      about_me: individualPersonalInfo.about_me || "",
    };

    form.reset(formData);

    // Set location state based on existing data
    if (individualPersonalInfo.country_id) {
      const country = countries.find(
        (c) => c.id === Number(individualPersonalInfo.country_id)
      );
      if (country) {
        setLocationState((prev) => ({
          ...prev,
          selectedCountryCode: country.iso2,
          selectedCountryId: country.id,
        }));
      }
    }

    if (individualPersonalInfo.state_id) {
      setLocationState((prev) => ({
        ...prev,
        selectedStateId: Number(individualPersonalInfo.state_id),
        selectedStateCode: individualPersonalInfo.state_id?.toString() || null,
      }));
    }
  }, [individualPersonalInfo, countries, form]);

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
      form.setValue("state_id", null);
      form.setValue("city_id", null);
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
    if (!individualPersonalInfo) return false;
    const currentValues = form.getValues();
    return (
      currentValues.first_name !== (individualPersonalInfo.first_name || "") ||
      currentValues.last_name !== (individualPersonalInfo.last_name || "") ||
      currentValues.country_id !== individualPersonalInfo.country_id ||
      currentValues.state_id !== individualPersonalInfo.state_id ||
      currentValues.city_id !== individualPersonalInfo.city_id ||
      currentValues.national_id !== (individualPersonalInfo.national_id || "") ||
      currentValues.detailed_address !==
        (individualPersonalInfo.detailed_address || "") ||
      currentValues.about_me !== (individualPersonalInfo.about_me || "")
    );
  }, [form, individualPersonalInfo]);

  if (isLoading && !individualPersonalInfo) {
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
                toast(t("profile.individual.personalInfo.noChanges"), {
                  duration: 2000,
                  position: "top-right",
                  icon: "ℹ️",
                });
                return;
              }

              const apiData: IndividualPersonalInfoApiData = {
                first_name: data.first_name,
                last_name: data.last_name,
                country_id: data.country_id,
                state_id: data.state_id,
                city_id: data.city_id,
                national_id: data.national_id,
                detailed_address: data.detailed_address,
                about_me: data.about_me,
              };

              try {
                const result = await handleIndividualPersonalInfoSubmit(
                  apiData
                );

                if (result.success) {
                  // Only update the store after successful API call
                  setIndividualPersonalInfo(data);
                  toast.success(t("profile.individual.personalInfo.success"), {
                    duration: 3000,
                    position: "top-right",
                  });
                } else {
                  toast.error(result.message || t("common.actions.error"), {
                    duration: 4000,
                    position: "top-right",
                  });
                }
              } catch (error) {
                toast.error(t("common.actions.error"), {
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
                name="first_name"
                render={({ field }) => (
                  <FormItem className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <UserRound className="text-muted-foreground/50 p-1" />
                      <FormLabel>
                        {t("profile.individual.personalInfo.firstName")}
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
                name="last_name"
                render={({ field }) => (
                  <FormItem className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <UserRound className="text-muted-foreground/50 p-1" />
                      <FormLabel>
                        {t("profile.individual.personalInfo.lastName")}
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
              name="national_id"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex  items-center gap-2">
                    <IdCard className="text-muted-foreground/50 p-1" />
                    <FormLabel>
                      {t("profile.individual.personalInfo.nationalId")}
                    </FormLabel>
                  </div>
                  <FormControl className="relative">
                    <Input
                      dir="ltr"
                      inputMode="numeric"
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
                        const country = countries?.find(
                          (c) => c.iso2 === value
                        );
                        field.onChange(country?.id || null);
                      }}
                      disabled={isLoading}
                      placeholder={t("common.select.country")}
                      label={t("profile.individual.personalInfo.country")}
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
                        field.onChange(value ? Number(value) : null);
                      }}
                      disabled={isLoading}
                      placeholder={t("common.select.state")}
                      label={t("profile.individual.personalInfo.state")}
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
                        field.onChange(value ? Number(value) : null);
                      }}
                      disabled={isLoading}
                      placeholder={t("common.select.city")}
                      label={t("profile.individual.personalInfo.city")}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="detailed_address"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-muted-foreground/50 p-1" />
                    <FormLabel>
                      {t("profile.individual.personalInfo.detailedAddress")}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Textarea
                      rows={3}
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

            <FormField
              control={form.control}
              name="about_me"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="text-muted-foreground/50 p-1" />
                    <FormLabel>
                      {t("profile.individual.personalInfo.aboutMe")}
                    </FormLabel>
                  </div>
                  <FormControl>
                    <Textarea
                      inputMode="text"
                      rows={3}
                      disabled={isLoading}
                      {...field}
                      value={field.value ?? ""}
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
              disabled={isLoading || !hasChanged}
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

export default IndividualPersonalInfo;
