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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { EngineeringOfficeProfilePersonalInfo } from "@/features/profile/types/engineeringOffice";
import { LocationSelectionState } from "@/features/profile/types/api";
import { createProfileValidationSchemas } from "@/features/profile/utils/validation";
import { usePersonalInfoStore } from "@/features/profile/store/personalInfoStore";
import { useGetCountries, useGetStates } from "@/shared/hooks/globalHooks";
import { useEngineeringTypes } from "@/features/profile/hooks/useEngineeringTypes";
import { cn } from "@/lib/utils";

export const EngineeringOfficePersonalInfo = () => {
  const tEngineeringOffice = useTranslations(
    "profile.engineeringOffice.personalInfo"
  );
  const tCommon = useTranslations("common");
  const store = usePersonalInfoStore();
  const { countries } = useGetCountries();
  const { engineeringTypes, isLoading: engineeringTypesLoading } =
    useEngineeringTypes();
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    engineeringOfficePersonalInfo,
    handleEngineeringOfficePersonalInfoSubmit,
    setEngineeringOfficePersonalInfo,
    handleEngineeringOfficeProfileFetch,
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
    const { EngineeringOfficePersonalInfoProfileSchema } =
      createProfileValidationSchemas(t);
    return EngineeringOfficePersonalInfoProfileSchema;
  }, [t]);

  const form = useForm<EngineeringOfficeProfilePersonalInfo>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      country_id: null,
      city_id: null,
      state_id: null,
      engineering_type_id: null,
      office_name: "",
      license_number: "",
      authorized_person_name: "",
      authorized_person_phone: "",
      representative_email: "",
      about_us: "",
      delegation_form: null,
    },
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  // Fetch profile data on component mount if not available
  useEffect(() => {
    if (!engineeringOfficePersonalInfo && !isLoading && !error) {
      handleEngineeringOfficeProfileFetch();
    }
  }, [
    engineeringOfficePersonalInfo,
    isLoading,
    error,
    handleEngineeringOfficeProfileFetch,
  ]);

  // Initialize form with existing data
  useEffect(() => {
    if (!engineeringOfficePersonalInfo || !countries) return;

    const formData: EngineeringOfficeProfilePersonalInfo = {
      country_id: engineeringOfficePersonalInfo.country_id,
      city_id: engineeringOfficePersonalInfo.city_id,
      state_id: engineeringOfficePersonalInfo.state_id,
      engineering_type_id: engineeringOfficePersonalInfo.engineering_type_id,
      office_name: engineeringOfficePersonalInfo.office_name || "",
      license_number: engineeringOfficePersonalInfo.license_number || "",
      authorized_person_name:
        engineeringOfficePersonalInfo.authorized_person_name || "",
      authorized_person_phone:
        engineeringOfficePersonalInfo.authorized_person_phone || "",
      representative_email:
        engineeringOfficePersonalInfo.representative_email || "",
      about_us: engineeringOfficePersonalInfo.about_us || "",
      delegation_form: engineeringOfficePersonalInfo.delegation_form,
    };

    form.reset(formData);

    // Set location state based on existing data
    if (engineeringOfficePersonalInfo.country_id) {
      const country = countries.find(
        (c) => c.id === Number(engineeringOfficePersonalInfo.country_id)
      );
      if (country) {
        setLocationState((prev) => ({
          ...prev,
          selectedCountryCode: country.iso2,
          selectedCountryId: country.id,
        }));
      }
    }

    if (engineeringOfficePersonalInfo.state_id) {
      setLocationState((prev) => ({
        ...prev,
        selectedStateId: Number(engineeringOfficePersonalInfo.state_id),
        selectedStateCode:
          engineeringOfficePersonalInfo.state_id?.toString() || null,
      }));
    }
  }, [engineeringOfficePersonalInfo, countries, form]);

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
    if (!engineeringOfficePersonalInfo) return true; // Allow changes if no existing data
    const currentValues = form.getValues();

    // Check text fields
    const textFieldsChanged =
      currentValues.office_name !==
        (engineeringOfficePersonalInfo.office_name || "") ||
      currentValues.license_number !==
        (engineeringOfficePersonalInfo.license_number || "") ||
      currentValues.authorized_person_name !==
        (engineeringOfficePersonalInfo.authorized_person_name || "") ||
      currentValues.authorized_person_phone !==
        (engineeringOfficePersonalInfo.authorized_person_phone || "") ||
      currentValues.representative_email !==
        (engineeringOfficePersonalInfo.representative_email || "") ||
      currentValues.about_us !==
        (engineeringOfficePersonalInfo.about_us || "") ||
      currentValues.engineering_type_id !==
        engineeringOfficePersonalInfo.engineering_type_id;

    // Check location fields
    const locationChanged =
      locationState.selectedCountryId !==
        engineeringOfficePersonalInfo.country_id ||
      locationState.selectedStateId !==
        engineeringOfficePersonalInfo.state_id ||
      currentValues.city_id !== engineeringOfficePersonalInfo.city_id;

    // Check file field - only compare if both exist
    const fileChanged =
      currentValues.delegation_form !== null &&
      currentValues.delegation_form !==
        engineeringOfficePersonalInfo.delegation_form;

    return textFieldsChanged || locationChanged || fileChanged;
  }, [form, engineeringOfficePersonalInfo, locationState]);

  if (isLoading && !engineeringOfficePersonalInfo && !error) {
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
              // Trigger validation to show field errors
              const isValid = await form.trigger();
              if (!isValid) {
                return;
              }
              // Check if data has actually changed before making API call
              if (!hasChanged) {
                toast(tEngineeringOffice("noChanges"), {
                  duration: 2000,
                  position: "top-right",
                  icon: "ℹ️",
                });
                return;
              }

              const apiData: EngineeringOfficeProfilePersonalInfo = {
                country_id: locationState.selectedCountryId,
                city_id: data.city_id,
                state_id: locationState.selectedStateId,
                engineering_type_id: data.engineering_type_id,
                office_name: data.office_name.trim(),
                license_number: data.license_number.trim(),
                authorized_person_name: data.authorized_person_name.trim(),
                authorized_person_phone: data.authorized_person_phone.trim(),
                representative_email: data.representative_email.trim(),
                about_us: data.about_us.trim(),
                delegation_form: data.delegation_form,
              };

              try {
                const result = await handleEngineeringOfficePersonalInfoSubmit(
                  apiData
                );
                if (result?.success) {
                  toast.success(tEngineeringOffice("success"), {
                    duration: 3000,
                    position: "top-right",
                  });
                } else {
                  toast.error(result?.message || tCommon("actions.error"), {
                    duration: 4000,
                    position: "top-right",
                  });
                }
              } catch (error: unknown) {
                console.error("Submission error:", error);
                const errorMessage = error && typeof error === 'object' && 'message' in error 
                  ? (error as { message: string }).message 
                  : tCommon("actions.error");
                toast.error(errorMessage, {
                  duration: 4000,
                  position: "top-right",
                });
              }
            })}
            className="form-section space-y-6"
          >
            <div className="w-full flex items-start gap-4">
              <FormField
                control={form.control}
                name="office_name"
                render={({ field }) => (
                  <FormItem className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="text-design-main p-1" />
                      <FormLabel>
                        {tEngineeringOffice("officeName")}{" "}
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
                name="license_number"
                render={({ field }) => (
                  <FormItem className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="text-design-main p-1" />
                      <FormLabel>
                        {tEngineeringOffice("professionalLicenseNumber")}{" "}
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

            {/* Authorized Person Section */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="authorized_person_name"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <UserRound className="text-design-main p-1" />
                      <FormLabel>
                        {tEngineeringOffice("authorizedPersonName")}{" "}
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

              <div className="w-full flex items-start gap-4">
                <FormField
                  control={form.control}
                  name="authorized_person_phone"
                  render={({ field }) => (
                    <FormItem className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-2">
                        <Phone className="text-design-main p-1" />
                        <FormLabel>
                          {tEngineeringOffice("phoneNumber")}{" "}
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
                    <FormItem className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-2">
                        <Mail className="text-design-main p-1" />
                        <FormLabel>
                          {tEngineeringOffice("email")}{" "}
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

            {/* Engineering Type Section */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="engineering_type_id"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Briefcase className="text-design-main p-1" />
                      <FormLabel>
                        {tEngineeringOffice("engineeringType")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                    </div>
                    <FormControl>
                      <Select
                        disabled={isLoading || engineeringTypesLoading}
                        onValueChange={(value) =>
                          field.onChange(parseInt(value))
                        }
                        value={field.value?.toString() || ""}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={tEngineeringOffice("engineeringType")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {engineeringTypes.map((type) => (
                            <SelectItem
                              key={type.id}
                              value={type.id.toString()}
                            >
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
            </div>

            {/* Location Section */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="country_id"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
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
                        label={`${tEngineeringOffice("country")} *`}
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
                        placeholder={tCommon("select.state")}
                        label={`${tEngineeringOffice("state")} *`}
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
                        placeholder={tCommon("select.city")}
                        label={`${tEngineeringOffice("city")} *`}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* About Us Section */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="about_us"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <UserRound className="text-design-main p-1" />
                      <FormLabel>
                        {tEngineeringOffice("aboutUs")}{" "}
                        <span className="text-red-500">*</span>
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
            </div>

            {/* Delegation Form Section */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="delegation_form"
                render={({ field }) => (
                  <FormItem className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <FileText className="text-design-main p-1" />
                      <FormLabel>
                        {tEngineeringOffice("delegationForm")}{" "}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                    </div>
                    <FormControl>
                      <div className="space-y-2">
                        <div
                          className={cn(
                            "border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer",
                            "hover:bg-muted/50 hover:border-design-main",
                            field.value
                              ? "border-design-main"
                              : "border-border",
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
                            <div className="w-8 h-8 rounded-full bg-design-main/10 flex items-center justify-center">
                              <Upload className="w-4 h-4 text-design-main" />
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
                                  {tEngineeringOffice("delegationForm")}
                                </p>
                                <p className="text-xs text-design-main">
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
            </div>

            {error && !engineeringOfficePersonalInfo && (
              <div className="m-2 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm mb-2">{error}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleEngineeringOfficeProfileFetch()}
                  disabled={isLoading}
                  className="text-red-700 border-red-300 hover:bg-red-100"
                >
                  {isLoading
                    ? tCommon("actions.retrying")
                    : tCommon("actions.retry")}
                </Button>
              </div>
            )}

            {error && engineeringOfficePersonalInfo && (
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

export default EngineeringOfficePersonalInfo;
