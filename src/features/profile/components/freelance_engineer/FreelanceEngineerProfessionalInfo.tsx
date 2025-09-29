"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useGetCountries } from "@/shared/hooks/globalHooks";
import { useEngineeringTypes } from "@/features/profile/hooks/useEngineeringTypes";
import { useExperienceYearsRanges } from "@/features/profile/hooks/useExperienceYearsRanges";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Input } from "@/shared/components/ui/input";
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
import { FreelanceEngineerProfessionalInfoType } from "../../types/freelanceEngineer";
import { personalInfoApi } from "../../services/personalInfoApi";
import { handleApiError } from "./utils/formUtils";
import {
  Specialization,
  GeographicalCoverage,
  Experience,
  ValidationErrors,
} from "./types/sections";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

// Section Components
import { SpecializationsSection } from "./sections/SpecializationsSection";
import { GeographicalCoverageSection } from "./sections/GeographicalCoverageSection";
import { ExperiencesSection } from "./sections/ExperiencesSection";

const FreelanceEngineerProfessionalInfo = () => {
  const t = useTranslations("");
  const { FreelanceEngineerProfessionalInfoSchema } =
    createProfileValidationSchemas(t);

  const tFreelanceEngineer = useTranslations(
    "profile.freelanceEngineer.professionalInfo"
  );
  const tCommon = useTranslations("common");
  const { countries } = useGetCountries();
  const { engineeringTypes, isLoading: engineeringTypesLoading } =
    useEngineeringTypes();
  const { experienceYearsRanges, isLoading: experienceYearsRangesLoading } =
    useExperienceYearsRanges();

  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [geographicalCoverage, setGeographicalCoverage] = useState<
    GeographicalCoverage[]
  >([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track initial state for better change detection
  const [initialState, setInitialState] = useState({
    experience_years_range_id: undefined as number | undefined,
    is_associated_with_office: false,
    associated_office_name: "",
    specializations: [] as Specialization[],
    geographical_coverage: [] as GeographicalCoverage[],
    experiences: [] as Experience[],
  });

  const form = useForm<FreelanceEngineerProfessionalInfoType>({
    resolver: zodResolver(FreelanceEngineerProfessionalInfoSchema),
    defaultValues: {
      experience_years_range_id: undefined,
      is_associated_with_office: false,
      associated_office_name: "",
      specializations: [],
      geographical_coverage: [],
      experiences: [],
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

  useEffect(() => {
    form.setValue("experiences", experiences, {
      shouldValidate: false,
    });
  }, [experiences, form]);

  // Watch form values to track changes
  const watchedValues = form.watch();

  // Function to clear form errors
  const clearFormErrors = (fieldName: string) => {
    form.clearErrors(fieldName as keyof FreelanceEngineerProfessionalInfoType);
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
      watchedValues.is_associated_with_office !==
        initialState.is_associated_with_office ||
      watchedValues.associated_office_name !==
        initialState.associated_office_name;

    // Check if specializations have been added, removed, or modified
    const specializationsChanged = !arraysEqual(
      specializations,
      initialState.specializations,
      (spec, initialSpec) =>
        spec.engineering_specialization_id ===
          initialSpec.engineering_specialization_id &&
        spec.other_specialization === initialSpec.other_specialization &&
        spec.specialization_notes === initialSpec.specialization_notes &&
        spec.is_primary_specialization ===
          initialSpec.is_primary_specialization &&
        spec.expertise_level === initialSpec.expertise_level
    );

    // Check if geographical coverage has been added, removed, or modified
    const geographicalCoverageChanged = !arraysEqual(
      geographicalCoverage,
      initialState.geographical_coverage,
      (coverage, initialCoverage) =>
        coverage.city_id === initialCoverage.city_id &&
        coverage.notes === initialCoverage.notes
    );

    // Check if experiences have been added, removed, or modified
    const experiencesChanged = !arraysEqual(
      experiences,
      initialState.experiences,
      (exp, initialExp) =>
        exp.engineering_specialization_id ===
          initialExp.engineering_specialization_id &&
        exp.other_specialization === initialExp.other_specialization
    );

    return (
      formFieldsChanged ||
      specializationsChanged ||
      geographicalCoverageChanged ||
      experiencesChanged
    );
  }, [
    watchedValues,
    specializations,
    geographicalCoverage,
    experiences,
    initialState,
  ]);

  const onSubmit = async (data: FreelanceEngineerProfessionalInfoType) => {
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

    const formData = {
      experience_years_range_id: data.experience_years_range_id,
      is_associated_with_office: data.is_associated_with_office,
      associated_office_name: data.associated_office_name,
      specializations: specializations || [],
      geographical_coverage: geographicalCoverage || [],
      experiences: experiences || [],
    };

    // Validate using Zod schema
    const validationResult =
      FreelanceEngineerProfessionalInfoSchema.safeParse(formData);

    if (!validationResult.success) {
      // Convert Zod errors to our validation errors format
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((error) => {
        const path = error.path.join(".");
        errors[path] = error.message;
      });

      setValidationErrors(errors);

      // Also set form errors
      validationResult.error.issues.forEach((error) => {
        const path = error.path.join(".");
        form.setError(path as keyof FreelanceEngineerProfessionalInfoType, {
          message: error.message,
        });
      });

      toast.error(tFreelanceEngineer("errors.validationFailed"), {
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

      // Call the API to update full specializations
      const response =
        await personalInfoApi.updateFreelanceEngineerFullSpecializations(
          formData
        );

      if (!response.success) {
        throw new Error(
          response.message || tFreelanceEngineer("errors.updateFailed")
        );
      }

      // Clear validation errors only after successful submission
      setValidationErrors({});

      // Update initial state to current state after successful submission
      setInitialState({
        experience_years_range_id: watchedValues.experience_years_range_id,
        is_associated_with_office:
          watchedValues.is_associated_with_office ?? false,
        associated_office_name: watchedValues.associated_office_name ?? "",
        specializations: [...specializations],
        geographical_coverage: [...geographicalCoverage],
        experiences: [...experiences],
      });

      toast.success(tFreelanceEngineer("success.updateSuccess"), {
        style: {
          borderRadius: "10px",
          background: "#f0fdf4",
          color: "#16a34a",
        },
      });
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        tFreelanceEngineer("errors.updateFailed")
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

  if (engineeringTypesLoading || experienceYearsRangesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-design-main mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {tFreelanceEngineer("loading")}
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
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 sm:space-y-8"
            >
              {/* Basic Information Section */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  {tFreelanceEngineer("basicInformation")}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="experience_years_range_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {tFreelanceEngineer("experienceYearsRange")}
                        </FormLabel>
                        <FormControl>
                          <Select
                            disabled={isLoading}
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                            value={field.value?.toString() || ""}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={tFreelanceEngineer(
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
                    name="is_associated_with_office"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            {tFreelanceEngineer("isAssociatedWithOffice")}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {watchedValues.is_associated_with_office && (
                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="associated_office_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {tFreelanceEngineer("associatedOfficeName")}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              disabled={isLoading}
                              placeholder={tFreelanceEngineer(
                                "placeholders.enterOfficeName"
                              )}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </div>

              <SpecializationsSection
                control={form.control}
                engineeringTypes={engineeringTypes}
                specializations={specializations}
                setSpecializations={setSpecializations}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                clearFormErrors={clearFormErrors}
                isLoading={isLoading}
              />

              <GeographicalCoverageSection
                control={form.control}
                geographicalCoverage={geographicalCoverage}
                setGeographicalCoverage={setGeographicalCoverage}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                clearFormErrors={clearFormErrors}
                isLoading={isLoading}
              />

              <ExperiencesSection
                control={form.control}
                engineeringTypes={engineeringTypes}
                experiences={experiences}
                setExperiences={setExperiences}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                clearFormErrors={clearFormErrors}
                isLoading={isLoading}
              />

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-border">
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
                      {tFreelanceEngineer("saving")}
                    </div>
                  ) : (
                    tFreelanceEngineer("saveChanges")
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

export default FreelanceEngineerProfessionalInfo;
