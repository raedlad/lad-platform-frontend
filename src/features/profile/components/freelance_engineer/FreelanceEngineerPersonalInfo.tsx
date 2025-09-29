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
import { CountrySelection } from "@/shared/components/ui/CoutrySelect";
import { StateSelection } from "@/shared/components/ui/StateSelect";
import { CitySelection } from "@/shared/components/ui/CitySelect";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { FreelanceEngineerProfilePersonalInfo } from "@/features/profile/types/freelanceEngineer";
import { LocationSelectionState } from "@/features/profile/types/api";
import { createProfileValidationSchemas } from "@/features/profile/utils/validation";
import { usePersonalInfoStore } from "@/features/profile/store/personalInfoStore";
import { useGetCountries, useGetStates } from "@/shared/hooks/globalHooks";
import { useEngineeringTypes } from "@/features/profile/hooks/useEngineeringTypes";
import { useExperienceYearsRanges } from "@/features/profile/hooks/useExperienceYearsRanges";
import { cn } from "@/lib/utils";

export const FreelanceEngineerPersonalInfo = () => {
  const tFreelanceEngineer = useTranslations(
    "profile.freelanceEngineer.personalInfo"
  );
  const tCommon = useTranslations("common");
  const store = usePersonalInfoStore();
  const { countries } = useGetCountries();
  const { engineeringTypes, isLoading: engineeringTypesLoading } =
    useEngineeringTypes();
  const { experienceYearsRanges, isLoading: experienceYearsRangesLoading } =
    useExperienceYearsRanges();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    freelanceEngineerPersonalInfo,
    handleFreelanceEngineerPersonalInfoSubmit,
    setFreelanceEngineerPersonalInfo,
    handleFreelanceEngineerProfileFetch,
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
  const t = useTranslations("");
  const validationSchema = useMemo(() => {
    const { FreelanceEngineerPersonalInfoProfileSchema } =
      createProfileValidationSchemas(t);
    return FreelanceEngineerPersonalInfoProfileSchema;
  }, [t]);

  const form = useForm<FreelanceEngineerProfilePersonalInfo>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      full_name: "",
      national_id: "",
      engineers_association_number: "",
      about_me: "",
      engineering_type_id: 0,
      experience_years_range_id: 0,
      is_associated_with_office: false,
      associated_office_name: "",
      country_id: 0,
      state_id: 0,
      city_id: 0,
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  // Fetch profile data on component mount if not available
  useEffect(() => {
    if (!freelanceEngineerPersonalInfo && !isLoading) {
      handleFreelanceEngineerProfileFetch();
    }
  }, [
    freelanceEngineerPersonalInfo,
    isLoading,
    handleFreelanceEngineerProfileFetch,
  ]);

  // Initialize form with existing data
  useEffect(() => {
    if (!freelanceEngineerPersonalInfo || !countries) return;

    const formData: FreelanceEngineerProfilePersonalInfo = {
      full_name: freelanceEngineerPersonalInfo.full_name || "",
      national_id: freelanceEngineerPersonalInfo.national_id || "",
      engineers_association_number:
        freelanceEngineerPersonalInfo.engineers_association_number || "",
      about_me: freelanceEngineerPersonalInfo.about_me || "",
      engineering_type_id:
        freelanceEngineerPersonalInfo.engineering_type_id || 0,
      experience_years_range_id:
        freelanceEngineerPersonalInfo.experience_years_range_id || 0,
      is_associated_with_office:
        freelanceEngineerPersonalInfo.is_associated_with_office || false,
      associated_office_name:
        freelanceEngineerPersonalInfo.associated_office_name || "",
      country_id: freelanceEngineerPersonalInfo.country_id || 0,
      state_id: freelanceEngineerPersonalInfo.state_id || 0,
      city_id: freelanceEngineerPersonalInfo.city_id || 0,
    };

    form.reset(formData);

    // Set location state based on existing data
    if (freelanceEngineerPersonalInfo.country_id) {
      const country = countries.find(
        (c) => c.id === Number(freelanceEngineerPersonalInfo.country_id)
      );
      if (country) {
        setLocationState((prev) => ({
          ...prev,
          selectedCountryCode: country.iso2,
          selectedCountryId: country.id,
        }));
      }
    }

    if (freelanceEngineerPersonalInfo.state_id) {
      setLocationState((prev) => ({
        ...prev,
        selectedStateId: Number(freelanceEngineerPersonalInfo.state_id),
        selectedStateCode:
          freelanceEngineerPersonalInfo.state_id?.toString() || null,
      }));
    }
  }, [freelanceEngineerPersonalInfo, countries, form]);

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

      form.setValue("country_id", country?.id || 0);
      form.setValue("state_id", 0);
      form.setValue("city_id", 0);
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

        form.setValue("state_id", 0);
      }

      form.setValue("city_id", 0);
    },
    [states, form]
  );

  const hasChanged = useMemo(() => {
    if (!freelanceEngineerPersonalInfo) return false;
    const currentValues = form.getValues();

    // Check text fields
    const textFieldsChanged =
      currentValues.full_name !==
        (freelanceEngineerPersonalInfo.full_name || "") ||
      currentValues.national_id !==
        (freelanceEngineerPersonalInfo.national_id || "") ||
      currentValues.engineers_association_number !==
        (freelanceEngineerPersonalInfo.engineers_association_number || "") ||
      currentValues.about_me !==
        (freelanceEngineerPersonalInfo.about_me || "") ||
      currentValues.engineering_type_id !==
        freelanceEngineerPersonalInfo.engineering_type_id ||
      currentValues.experience_years_range_id !==
        freelanceEngineerPersonalInfo.experience_years_range_id ||
      currentValues.is_associated_with_office !==
        freelanceEngineerPersonalInfo.is_associated_with_office ||
      currentValues.associated_office_name !==
        (freelanceEngineerPersonalInfo.associated_office_name || "");

    // Check location fields
    const locationChanged =
      locationState.selectedCountryId !==
        freelanceEngineerPersonalInfo.country_id ||
      locationState.selectedStateId !==
        freelanceEngineerPersonalInfo.state_id ||
      currentValues.city_id !== freelanceEngineerPersonalInfo.city_id;

    return textFieldsChanged || locationChanged;
  }, [form, freelanceEngineerPersonalInfo, locationState]);

  if (isLoading && !freelanceEngineerPersonalInfo) {
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

            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 flex items-center justify-center">
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

              const apiData: FreelanceEngineerProfilePersonalInfo = {
                full_name: data.full_name,
                national_id: data.national_id,
                engineers_association_number: data.engineers_association_number,
                about_me: data.about_me,
                engineering_type_id: data.engineering_type_id,
                experience_years_range_id: data.experience_years_range_id,
                is_associated_with_office: data.is_associated_with_office,
                associated_office_name: data.associated_office_name,
                country_id: locationState.selectedCountryId || 0,
                state_id: locationState.selectedStateId || 0,
                city_id: data.city_id,
              };

              try {
                const result = await handleFreelanceEngineerPersonalInfoSubmit(
                  apiData
                );
                if (result.success) {
                  toast.success(tCommon("actions.save"), {
                    duration: 3000,
                    position: "top-right",
                  });
                } else {
                  toast.error(result.message || tCommon("actions.error"), {
                    duration: 4000,
                    position: "top-right",
                  });
                }
              } catch (error: unknown) {
                console.error("Error submitting personal info:", error);
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
                name="full_name"
                render={({ field }) => (
                  <FormItem className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <UserRound className="text-design-main p-1" />
                      <FormLabel>
                        {tFreelanceEngineer("fullName")}{" "}
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
                name="national_id"
                render={({ field }) => (
                  <FormItem className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="text-design-main p-1" />
                      <FormLabel>
                        {tFreelanceEngineer("nationalId")}{" "}
                        <span className="text-red-500">*</span>
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
              name="engineers_association_number"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-design-main p-1" />
                    <FormLabel>
                      {tFreelanceEngineer("engineersAssociationNumber")}{" "}
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

            <FormField
              control={form.control}
              name="engineering_type_id"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-design-main p-1" />
                    <FormLabel>
                      {tFreelanceEngineer("engineeringType")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                  </div>
                  <FormControl className="relative">
                    <Select
                      disabled={isLoading || engineeringTypesLoading}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString() || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select engineering type" />
                      </SelectTrigger>
                      <SelectContent>
                        {engineeringTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name_en || type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="experience_years_range_id"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Briefcase className="text-design-main p-1" />
                    <FormLabel>
                      {tFreelanceEngineer("experienceYearsRange")}{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                  </div>
                  <FormControl className="relative">
                    <Select
                      disabled={isLoading || experienceYearsRangesLoading}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString() || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience range" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceYearsRanges.map((range) => (
                          <SelectItem
                            key={range.id}
                            value={range.id.toString()}
                          >
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_associated_with_office"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        // Clear office name and validation errors when unchecked
                        if (!checked) {
                          form.setValue("associated_office_name", "");
                          form.clearErrors("associated_office_name");
                        }
                      }}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="flex items-center gap-2">
                      <CheckCircle className="text-design-main p-1" />
                      {tFreelanceEngineer("isAssociatedWithOffice")}{" "}
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />

            {form.watch("is_associated_with_office") && (
              <FormField
                control={form.control}
                name="associated_office_name"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Building2 className="text-design-main p-1" />
                      <FormLabel>
                        {tFreelanceEngineer("associatedOfficeName")}{" "}
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
            )}

            <FormField
              control={form.control}
              name="country_id"
              render={({ field }) => (
                <FormItem className="space-y-0.5">
                  <FormControl>
                    <CountrySelection
                      selectedCountry={locationState.selectedCountryCode || ""}
                      onCountryChange={(value) => {
                        handleCountryChange(value);
                        const country = countries?.find(
                          (c) => c.iso2 === value
                        );
                        field.onChange(country?.id || 0);
                      }}
                      disabled={isLoading}
                      placeholder={tCommon("select.country")}
                      label={`${tFreelanceEngineer("country")} *`}
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
                        field.onChange(value ? Number(value) : 0);
                      }}
                      disabled={isLoading}
                      placeholder={tCommon("select.state")}
                      label={`${tFreelanceEngineer("state")} *`}
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
                        field.onChange(value ? Number(value) : 0);
                      }}
                      disabled={isLoading}
                      placeholder={tCommon("select.city")}
                      label={`${tFreelanceEngineer("city")} *`}
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
                    <UserRound className="text-design-main p-1" />
                    <FormLabel>{tFreelanceEngineer("aboutMe")}</FormLabel>
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
              {isLoading ? tCommon("actions.saving") : tCommon("actions.save")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default FreelanceEngineerPersonalInfo;
