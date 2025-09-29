"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Plus, Trash2, Star, MapPin, Upload, X, FileText } from "lucide-react";
import { useGetCountries } from "@/shared/hooks/globalHooks";
import { useEngineeringTypes } from "@/features/profile/hooks/useEngineeringTypes";
import { useExperienceYearsRanges } from "@/features/profile/hooks/useExperienceYearsRanges";
import { useStaffSizeRanges } from "@/features/profile/hooks/useStaffSizeRanges";
import { useAnnualProjectsRanges } from "@/features/profile/hooks/useAnnualProjectsRanges";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
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

import { createProfileValidationSchemas } from "../../utils/validation";
import { EngineeringOfficeProfileProfessionalInfo } from "../../types/engineeringOffice";
import { personalInfoApi } from "../../services/personalInfoApi";
import { handleApiError } from "../freelance_engineer/utils/formUtils";
import {
  EngineeringOfficeSpecialization,
  EngineeringOfficeGeographicalCoverage,
  ValidationErrors,
} from "./types/sections";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

// Section Components
import { EngineeringOfficeSpecializationsSection } from "./sections/SpecializationsSection";
import { EngineeringOfficeGeographicalCoverageSection } from "./sections/GeographicalCoverageSection";

const EngineeringOfficeProfessionalInfo = () => {
  const t = useTranslations("");
  const { EngineeringOfficeProfessionalInfoSchema } =
    createProfileValidationSchemas(t);

  const tEngineeringOffice = useTranslations(
    "profile.engineeringOffice.professionalInfo"
  );
  const tCommon = useTranslations("common");
  const { countries } = useGetCountries();
  const { engineeringTypes, isLoading: engineeringTypesLoading } =
    useEngineeringTypes();
  const { experienceYearsRanges, isLoading: experienceYearsRangesLoading } =
    useExperienceYearsRanges();
  const { staffSizeRanges, isLoading: staffSizeRangesLoading } =
    useStaffSizeRanges();
  const { annualProjectsRanges, isLoading: annualProjectsRangesLoading } =
    useAnnualProjectsRanges();

  const [specializations, setSpecializations] = useState<
    EngineeringOfficeSpecialization[]
  >([]);
  const [geographicalCoverage, setGeographicalCoverage] = useState<
    EngineeringOfficeGeographicalCoverage[]
  >([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [classificationFile, setClassificationFile] = useState<File | null>(
    null
  );

  // Track initial state for better change detection
  const [initialState, setInitialState] = useState({
    experience_years_range_id: undefined as number | undefined,
    staff_size_range_id: undefined as number | undefined,
    annual_projects_range_id: undefined as number | undefined,
    has_government_accreditation: false,
    custom_name: "",
    description: "",
    expiry_date: "",
    specializations: [] as EngineeringOfficeSpecialization[],
    geographical_coverage: [] as EngineeringOfficeGeographicalCoverage[],
  });

  const form = useForm({
    resolver: zodResolver(EngineeringOfficeProfessionalInfoSchema),
    defaultValues: {
      experience_years_range_id: undefined,
      staff_size_range_id: undefined,
      annual_projects_range_id: undefined,
      has_government_accreditation: false,
      classification_file: null,
      custom_name: "",
      description: "",
      expiry_date: "",
      specializations: [],
      geographical_coverage: [],
    },
  });

  // Sync local state with form state whenever arrays change
  useEffect(() => {
    form.setValue("specializations", specializations, {
      shouldValidate: false,
    });
  }, [specializations, form]);

  useEffect(() => {
    form.setValue("geographical_coverage", geographicalCoverage, {
      shouldValidate: false,
    });
  }, [geographicalCoverage, form]);

  // Watch form values to track changes
  const watchedValues = form.watch();

  // Function to clear form errors
  const clearFormErrors = (fieldName: string) => {
    form.clearErrors(fieldName as any);
  };

  // Helper function to compare arrays deeply
  const arraysEqual = <T,>(
    a: T[],
    b: T[],
    compareFn?: (itemA: T, itemB: T) => boolean
  ): boolean => {
    if (a.length !== b.length) return false;
    if (compareFn) {
      return a.every((itemA, index) => compareFn(itemA, b[index]));
    }
    return a.every(
      (itemA, index) => JSON.stringify(itemA) === JSON.stringify(b[index])
    );
  };

  // Track if form has changed
  const hasChanged = useMemo(() => {
    // Check if any form fields have changed from initial state
    const formFieldsChanged =
      watchedValues.experience_years_range_id !==
        initialState.experience_years_range_id ||
      watchedValues.staff_size_range_id !== initialState.staff_size_range_id ||
      watchedValues.annual_projects_range_id !==
        initialState.annual_projects_range_id ||
      watchedValues.has_government_accreditation !==
        initialState.has_government_accreditation ||
      watchedValues.custom_name !== initialState.custom_name ||
      watchedValues.description !== initialState.description ||
      watchedValues.expiry_date !== initialState.expiry_date ||
      classificationFile !== null;

    // Check if specializations have been added, removed, or modified
    const specializationsChanged = !arraysEqual(
      specializations,
      initialState.specializations,
      (spec, initialSpec) =>
        spec.engineering_specialization_id ===
          initialSpec.engineering_specialization_id &&
        (spec.other_specialization || "") ===
          (initialSpec.other_specialization || "") &&
        (spec.specialization_notes || "") ===
          (initialSpec.specialization_notes || "") &&
        (spec.is_primary_specialization || false) ===
          (initialSpec.is_primary_specialization || false) &&
        (spec.expertise_level || "beginner") ===
          (initialSpec.expertise_level || "beginner")
    );

    // Check if geographical coverage has been added, removed, or modified
    const geographicalCoverageChanged = !arraysEqual(
      geographicalCoverage,
      initialState.geographical_coverage,
      (coverage, initialCoverage) =>
        coverage.country_code === initialCoverage.country_code &&
        coverage.state_id === initialCoverage.state_id &&
        coverage.city_id === initialCoverage.city_id &&
        (coverage.notes || "") === (initialCoverage.notes || "")
    );

    return (
      formFieldsChanged || specializationsChanged || geographicalCoverageChanged
    );
  }, [
    watchedValues,
    specializations,
    geographicalCoverage,
    initialState,
    classificationFile,
  ]);

  const onSubmit = async (data: any) => {
    // Prevent submission if no changes have been made
    if (!hasChanged) {
      toast(tCommon("actions.noChanges"), {
        icon: "ℹ️",
        style: {
          borderRadius: "10px",
          background: "#f0f9ff",
          color: "#0c4a6e",
        },
      });
      return;
    }

    // Create FormData for file upload
    const formData = new FormData();

    // Add required fields
    if (data.experience_years_range_id) {
      formData.append(
        "experience_years_range_id",
        data.experience_years_range_id.toString()
      );
    }
    if (data.staff_size_range_id) {
      formData.append(
        "staff_size_range_id",
        data.staff_size_range_id.toString()
      );
    }
    if (data.annual_projects_range_id) {
      formData.append(
        "annual_projects_range_id",
        data.annual_projects_range_id.toString()
      );
    }

    formData.append(
      "has_government_accreditation",
      data.has_government_accreditation.toString()
    );

    // Add classification file if present
    if (classificationFile) {
      formData.append("classification_file", classificationFile);
    }

    // Add optional fields
    if (data.custom_name) {
      formData.append("custom_name", data.custom_name);
    }
    if (data.description) {
      formData.append("description", data.description);
    }
    if (data.expiry_date) {
      formData.append("expiry_date", data.expiry_date);
    }

    // Add specializations (API expects: specialization_id, specialization_notes, is_primary_specialization)
    specializations.forEach((spec, index) => {
      formData.append(
        `specializations[${index}][specialization_id]`,
        spec.engineering_specialization_id.toString()
      );
      if (spec.specialization_notes) {
        formData.append(
          `specializations[${index}][specialization_notes]`,
          spec.specialization_notes
        );
      }
      if (spec.is_primary_specialization !== undefined) {
        formData.append(
          `specializations[${index}][is_primary_specialization]`,
          spec.is_primary_specialization.toString()
        );
      }
      // Note: other_specialization/expertise_level not expected by API → omitted
    });

    // Add geographical coverage (API expects: city_id, covers_all_areas, specific_areas?, priority?, notes?)
    geographicalCoverage.forEach((coverage, index) => {
      formData.append(
        `geographical_coverage[${index}][city_id]`,
        coverage.city_id.toString()
      );
      // Default to false unless UI supports toggling this
      formData.append(
        `geographical_coverage[${index}][covers_all_areas]`,
        "false"
      );
      if (coverage.notes) {
        formData.append(
          `geographical_coverage[${index}][notes]`,
          coverage.notes
        );
      }
      // specific_areas and priority are optional and not present in UI → omitted
    });

    // Validate using Zod schema
    const validationData = {
      experience_years_range_id: data.experience_years_range_id,
      staff_size_range_id: data.staff_size_range_id,
      annual_projects_range_id: data.annual_projects_range_id,
      has_government_accreditation: data.has_government_accreditation,
      classification_file: classificationFile,
      custom_name: data.custom_name,
      description: data.description,
      expiry_date: data.expiry_date,
      specializations: specializations || [],
      geographical_coverage: geographicalCoverage || [],
    };

    const validationResult =
      EngineeringOfficeProfessionalInfoSchema.safeParse(validationData);

    if (!validationResult.success) {
      // Convert Zod errors to our validation errors format
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((error: any) => {
        const path = error.path.join(".");
        errors[path] = error.message;
      });

      setValidationErrors(errors);

      // Also set form errors
      validationResult.error.issues.forEach((error: any) => {
        const path = error.path.join(".");
        form.setError(path as any, { message: error.message });
      });

      toast.error(tEngineeringOffice("errors.validationFailed"), {
        style: {
          borderRadius: "10px",
          background: "#fef2f2",
          color: "#dc2626",
        },
      });
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Call the API to update engineering office professional info
      const response =
        await personalInfoApi.updateEngineeringOfficeProfessionalInfo(formData);

      if (!response.success) {
        throw new Error(
          response.message || tEngineeringOffice("errors.updateFailed")
        );
      }

      // Clear validation errors only after successful submission
      setValidationErrors({});

      // Update initial state to current state after successful submission
      setInitialState({
        experience_years_range_id: watchedValues.experience_years_range_id,
        staff_size_range_id: watchedValues.staff_size_range_id,
        annual_projects_range_id: watchedValues.annual_projects_range_id,
        has_government_accreditation:
          watchedValues.has_government_accreditation ?? false,
        custom_name: watchedValues.custom_name ?? "",
        description: watchedValues.description ?? "",
        expiry_date: watchedValues.expiry_date ?? "",
        specializations: [...specializations],
        geographical_coverage: [...geographicalCoverage],
      });

      // Reset file input
      setClassificationFile(null);

      toast.success(tEngineeringOffice("success.updateSuccess"), {
        style: {
          borderRadius: "10px",
          background: "#f0fdf4",
          color: "#16a34a",
        },
      });
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        tEngineeringOffice("errors.updateFailed")
      );
      setError(errorMessage);
      toast.error(errorMessage, {
        style: {
          borderRadius: "10px",
          background: "#fef2f2",
          color: "#dc2626",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (
    engineeringTypesLoading ||
    experienceYearsRangesLoading ||
    staffSizeRangesLoading ||
    annualProjectsRangesLoading
  ) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-design-main mx-auto mb-4"></div>
          <p className="text-muted-foreground ">
            {tEngineeringOffice("loading")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information Section */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  {tEngineeringOffice("basicInformation")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="experience_years_range_id"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>
                          {tEngineeringOffice("experienceYearsRange")}
                        </FormLabel>
                        <FormControl>
                          <Select
                            disabled={isLoading}
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                            value={field.value?.toString() || ""}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={tEngineeringOffice(
                                  "placeholders.selectExperienceRange"
                                )}
                              />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="staff_size_range_id"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>
                          {tEngineeringOffice("staffSizeRange")}
                        </FormLabel>
                        <FormControl>
                          <Select
                            disabled={isLoading}
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                            value={field.value?.toString() || ""}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={tEngineeringOffice(
                                  "placeholders.selectStaffSizeRange"
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {staffSizeRanges.map((range) => (
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="annual_projects_range_id"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>
                          {tEngineeringOffice("annualProjectsRange")}
                        </FormLabel>
                        <FormControl>
                          <Select
                            disabled={isLoading}
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                            value={field.value?.toString() || ""}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={tEngineeringOffice(
                                  "placeholders.selectAnnualProjectsRange"
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {annualProjectsRanges.map((range) => (
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="has_government_accreditation"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            {tEngineeringOffice("hasGovernmentAccreditation")}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Classification File Upload */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="text-muted-foreground/50 p-1" />
                    <label className="text-sm font-medium text-foreground">
                      {tEngineeringOffice("classificationFile")}
                    </label>
                  </div>
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer",
                      "hover:bg-muted/50 hover:border-muted-foreground/50",
                      classificationFile
                        ? "border-design-main"
                        : "border-muted-foreground/25",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                    onClick={() => {
                      if (!isLoading) {
                        document
                          .getElementById("classification-file-upload")
                          ?.click();
                      }
                    }}
                  >
                    <input
                      id="classification-file-upload"
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                      disabled={isLoading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          // Validate file size (8MB max)
                          if (file.size > 8 * 1024 * 1024) {
                            setValidationErrors({
                              ...validationErrors,
                              classification_file: tCommon(
                                "fileErrors.maxSize",
                                {
                                  maxSizeMB: "8",
                                }
                              ),
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
                            setValidationErrors({
                              ...validationErrors,
                              classification_file: tCommon(
                                "fileErrors.invalidFile"
                              ),
                            });
                            return;
                          }
                          setClassificationFile(file);
                          form.setValue("classification_file", file);
                          // Clear validation error
                          const newErrors = { ...validationErrors };
                          delete newErrors.classification_file;
                          setValidationErrors(newErrors);
                        }
                      }}
                    />
                    <div className="flex flex-col items-center gap-2 text-center">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Upload className="w-4 h-4 text-muted-foreground" />
                      </div>
                      {classificationFile ? (
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-green-700">
                            {classificationFile.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(classificationFile.size / 1024 / 1024).toFixed(2)}{" "}
                            MB
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setClassificationFile(null);
                              form.setValue("classification_file", undefined);
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
                            {tEngineeringOffice("classificationFile")}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF, DOC, DOCX, JPG, JPEG, PNG, WEBP (max 8MB)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {validationErrors.classification_file && (
                    <p className="text-destructive text-xs mt-1">
                      {validationErrors.classification_file}
                    </p>
                  )}
                </div>

                {/* Optional Fields */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="custom_name"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>
                          {tEngineeringOffice("customName")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isLoading}
                            placeholder={tEngineeringOffice(
                              "placeholders.enterCustomName"
                            )}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="expiry_date"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>
                          {tEngineeringOffice("expiryDate")}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} type="date" disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-8">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel>
                          {tEngineeringOffice("descriptionText")}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            disabled={isLoading}
                            placeholder={tEngineeringOffice(
                              "placeholders.enterDescription"
                            )}
                            rows={4}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <EngineeringOfficeSpecializationsSection
                control={form.control}
                engineeringTypes={engineeringTypes}
                specializations={specializations}
                setSpecializations={setSpecializations}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                clearFormErrors={clearFormErrors}
                isLoading={isLoading}
              />

              <EngineeringOfficeGeographicalCoverageSection
                control={form.control}
                geographicalCoverage={geographicalCoverage}
                setGeographicalCoverage={setGeographicalCoverage}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                clearFormErrors={clearFormErrors}
                isLoading={isLoading}
              />

              {error && (
                <div className="p-4 bg-destructive/10  border border-destructive/20  rounded-lg">
                  <p className="text-destructive dark:text-red-400 text-sm">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-border ">
                <Button
                  type="submit"
                  className={cn(
                    "px-6 sm:px-8 py-3 bg-design-main hover:bg-design-main-dark text-white font-medium rounded-lg shadow-sm transition-all duration-200 min-w-[140px] w-full sm:w-auto",
                    (!hasChanged || isLoading) &&
                      "cursor-not-allowed bg-muted hover:bg-muted"
                  )}
                  disabled={!hasChanged || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {tEngineeringOffice("saving")}
                    </div>
                  ) : (
                    tEngineeringOffice("saveChanges")
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EngineeringOfficeProfessionalInfo;
