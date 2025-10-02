"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Plus, Trash2, Upload, X, FileText } from "lucide-react";
import toast from "react-hot-toast";

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

import { useGetCountries } from "@/shared/hooks/globalHooks";
import { useExperienceYearsRanges } from "@/features/profile/hooks/useExperienceYearsRanges";
import {
  useWorkFields,
  WorkField as WorkFieldOption,
} from "@/features/profile/hooks/useWorkFields";
import { createProfileValidationSchemas } from "@/features/profile/utils/validation";
import { personalInfoApi } from "@/features/profile/services/personalInfoApi";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";

// Import section components
import { SupplierGeographicalCoverageSection } from "./sections/GeographicalCoverageSection";
import { SupplierWorkFieldsSection } from "./sections/WorkFieldsSection";

// Types
interface WorkField {
  work_field_id: string;
  field_specific_notes?: string;
}

interface GeographicalCoverage {
  city_id: string;
  covers_all_areas: boolean;
  specific_areas?: string[];
  priority?: "high" | "medium" | "low";
  notes?: string;
}

interface SupplierProfessionalInfoFormData {
  experience_years_range_id: number;
  has_government_accreditation: boolean;
  classification_file?: File;
  work_fields: WorkField[];
  geographical_coverage: GeographicalCoverage[];
}

interface SupplierProfileData {
  personal_info?: {
    company_name?: string;
    commercial_registration_number?: string;
    authorized_person_name?: string;
    authorized_person_phone?: string;
    representative_email?: string;
    country_id?: number | null;
    city_id?: number | null;
    state_id?: number | null;
  };
  professional_info?: {
    experience_years_range_id?: number;
    has_government_accreditation?: boolean;
    work_fields?: WorkField[];
    geographical_coverage?: GeographicalCoverage[];
  };
}

export const SupplierProfessionalInfo = () => {
  const tSupplier = useTranslations("profile.supplier.professionalInfo");
  const tCommon = useTranslations("common");
  const t = useTranslations();

  // Hooks
  const { countries } = useGetCountries();
  const { experienceYearsRanges, isLoading: experienceYearsRangesLoading } =
    useExperienceYearsRanges();
  const {
    workFields,
    isLoading: workFieldsLoading,
    error: workFieldsError,
  } = useWorkFields();

  // State
  const [workFieldsList, setWorkFieldsList] = useState<WorkField[]>([]);
  const [geographicalCoverage, setGeographicalCoverage] = useState<
    GeographicalCoverage[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [supplierProfile, setSupplierProfile] =
    useState<SupplierProfileData | null>(null);

  // Validation schema
  const validationSchema = useMemo(() => {
    const { SupplierProfessionalInfoSchema } =
      createProfileValidationSchemas(t);
    return SupplierProfessionalInfoSchema;
  }, [t]);

  // Form setup
  const form = useForm<SupplierProfessionalInfoFormData>({
    // resolver: zodResolver(validationSchema), // Temporarily disabled
    defaultValues: {
      experience_years_range_id: 0,
      has_government_accreditation: false,
      work_fields: [],
      geographical_coverage: [],
    },
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const watchedValues = form.watch();

  // Initial state for change detection
  const [initialState, setInitialState] = useState({
    experience_years_range_id: 0,
    has_government_accreditation: false,
    workFields: [] as WorkField[],
    geographical_coverage: [] as GeographicalCoverage[],
  });

  // Load supplier profile data
  useEffect(() => {
    const loadSupplierProfile = async () => {
      try {
        setIsDataLoading(true);
        const response = await personalInfoApi.fetchSupplierProfile();
        if (response.success && response.data) {
          // Cast the response data to our expected type
          const profileData = response.data as unknown as SupplierProfileData;
          setSupplierProfile(profileData);
        }
      } catch (error) {
        setError("Failed to load profile data");
      } finally {
        setIsDataLoading(false);
      }
    };

    loadSupplierProfile();
  }, []);

  // Initialize form with existing data
  useEffect(() => {
    if (!supplierProfile || !experienceYearsRanges.length) return;

    const professionalInfo = supplierProfile.professional_info;
    if (!professionalInfo) return;

    // Reset form with existing data
    form.reset({
      experience_years_range_id:
        professionalInfo.experience_years_range_id || 0,
      has_government_accreditation:
        professionalInfo.has_government_accreditation || false,
      work_fields: professionalInfo.work_fields || [],
      geographical_coverage: professionalInfo.geographical_coverage || [],
    });

    // Set work fields
    if (
      professionalInfo.work_fields &&
      Array.isArray(professionalInfo.work_fields)
    ) {
      const workFieldsWithStringIds = professionalInfo.work_fields.map(
        (field) => ({
          ...field,
          work_field_id: field.work_field_id.toString(),
        })
      );
      setWorkFieldsList(workFieldsWithStringIds);
      form.setValue("work_fields", workFieldsWithStringIds);
    }

    // Set geographical coverage
    if (
      professionalInfo.geographical_coverage &&
      Array.isArray(professionalInfo.geographical_coverage)
    ) {
      // Convert to the expected format (remove country_code and state_id)
      const convertedCoverage = professionalInfo.geographical_coverage.map(
        (coverage) => ({
          city_id: coverage.city_id,
          covers_all_areas: coverage.covers_all_areas,
          specific_areas: coverage.specific_areas,
          priority: coverage.priority,
          notes: coverage.notes,
        })
      );
      setGeographicalCoverage(convertedCoverage);
      form.setValue("geographical_coverage", convertedCoverage);
    }

    // Set initial state for change detection
    setInitialState({
      experience_years_range_id:
        professionalInfo.experience_years_range_id || 0,
      has_government_accreditation:
        professionalInfo.has_government_accreditation || false,
      workFields: professionalInfo.work_fields || [],
      geographical_coverage: professionalInfo.geographical_coverage || [],
    });
  }, [supplierProfile, experienceYearsRanges, form]);

  // Change detection
  const hasChanged = useMemo(() => {
    const formFieldsChanged =
      watchedValues.experience_years_range_id !==
        initialState.experience_years_range_id ||
      watchedValues.has_government_accreditation !==
        initialState.has_government_accreditation ||
      watchedValues.classification_file !== undefined;

    const workFieldsChanged =
      JSON.stringify(workFieldsList) !==
      JSON.stringify(initialState.workFields);
    const geographicalCoverageChanged =
      JSON.stringify(geographicalCoverage) !==
      JSON.stringify(initialState.geographical_coverage);

    return (
      formFieldsChanged || workFieldsChanged || geographicalCoverageChanged
    );
  }, [watchedValues, workFieldsList, geographicalCoverage, initialState]);

  // Form submission
  const onSubmit = async (data: any) => {
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

    // Trigger validation before submission
    await form.trigger();

    // Create FormData for file upload
    const formData = new FormData();

    // Add required fields
    if (data.experience_years_range_id) {
      formData.append(
        "experience_years_range_id",
        data.experience_years_range_id.toString()
      );
    }
    formData.append(
      "has_government_accreditation",
      data.has_government_accreditation.toString()
    );

    // Add classification file if present
    if (data.classification_file instanceof File) {
      formData.append("classification_file", data.classification_file);
    }

    // Add work fields
    workFieldsList.forEach((workField, index) => {
      formData.append(
        `work_fields[${index}][work_field_id]`,
        workField.work_field_id
      );
      if (workField.field_specific_notes) {
        formData.append(
          `work_fields[${index}][field_specific_notes]`,
          workField.field_specific_notes
        );
      }
    });

    // Add geographical coverage
    geographicalCoverage.forEach((coverage, index) => {
      formData.append(
        `geographical_coverage[${index}][city_id]`,
        coverage.city_id
      );
      formData.append(
        `geographical_coverage[${index}][covers_all_areas]`,
        coverage.covers_all_areas.toString()
      );
      if (coverage.specific_areas && coverage.specific_areas.length > 0) {
        coverage.specific_areas.forEach((area, areaIndex) => {
          formData.append(
            `geographical_coverage[${index}][specific_areas][${areaIndex}]`,
            area
          );
        });
      }
      if (coverage.priority) {
        formData.append(
          `geographical_coverage[${index}][priority]`,
          coverage.priority
        );
      }
      if (coverage.notes) {
        formData.append(
          `geographical_coverage[${index}][notes]`,
          coverage.notes
        );
      }
    });

    // Validate using Zod schema
    const validationData = {
      experience_years_range_id: data.experience_years_range_id,
      has_government_accreditation: data.has_government_accreditation,
      classification_file: data.classification_file,
      work_fields: workFieldsList,
      geographical_coverage: geographicalCoverage.filter(
        (coverage) => coverage && coverage.city_id
      ),
    };

    const validationResult = validationSchema.safeParse(validationData);

    if (!validationResult.success) {
      validationResult.error.issues.forEach((error: any) => {
        const path = error.path.join(".");
        form.setError(path as any, { message: error.message });
      });

      toast.error(tSupplier("errors.validationFailed"), {
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

      // Call the API to update supplier professional info
      const response = await personalInfoApi.updateSupplierProfessionalInfo(
        formData
      );

      if (!response.success) {
        throw new Error(response.message || tSupplier("errors.updateFailed"));
      }

      setInitialState({
        experience_years_range_id: watchedValues.experience_years_range_id,
        has_government_accreditation:
          watchedValues.has_government_accreditation,
        workFields: [...workFieldsList],
        geographical_coverage: [...geographicalCoverage],
      });

      toast.success(tSupplier("success.updateSuccess"), {
        style: {
          borderRadius: "10px",
          background: "#f0fdf4",
          color: "#16a34a",
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : tSupplier("errors.updateFailed");
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

  if (experienceYearsRangesLoading || workFieldsLoading || isDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-design-main mx-auto mb-4"></div>
          <p className="text-muted-foreground">{tSupplier("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl">
          <Form {...form}>
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit, (errors) => {
                  console.log("❌ Validation errors:", errors);
                })}
                className="space-y-8"
              >
                {/* Basic Information Section */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-6">
                    {tSupplier("basicInformation")}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="experience_years_range_id"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel>
                            {tSupplier("experienceYearsRange")}
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
                                  placeholder={tSupplier(
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

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="has_government_accreditation"
                        checked={watchedValues.has_government_accreditation}
                        onCheckedChange={(checked) =>
                          form.setValue(
                            "has_government_accreditation",
                            checked as boolean
                          )
                        }
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="has_government_accreditation"
                        className="text-sm font-medium text-foreground"
                      >
                        {tSupplier("hasGovernmentAccreditation")}
                      </label>
                    </div>
                  </div>

                  {/* Classification File Upload */}
                  <div className="mt-6">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="text-design-main p-1" />
                      <label className="text-sm font-medium text-foreground">
                        {tSupplier("classificationFile")}
                      </label>
                    </div>
                    <div
                      className={cn(
                        "border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer border-design-main/50",
                        "hover:bg-muted/50 hover:border-design-main",
                        watchedValues.classification_file
                          ? "border-design-main"
                          : "border-design-main/50",
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
                            if (file.size > 8 * 1024 * 1024) {
                              form.setError("classification_file", {
                                message: tCommon("fileErrors.maxSize", {
                                  maxSizeMB: "8",
                                }),
                              });
                              return;
                            }
                            const allowedTypes = [
                              "application/pdf",
                              "image/jpeg",
                              "image/jpg",
                              "image/png",
                              "image/webp",
                            ];
                            if (!allowedTypes.includes(file.type)) {
                              form.setError("classification_file", {
                                message: tCommon("fileErrors.invalidFile"),
                              });
                              return;
                            }
                            form.setValue("classification_file", file);
                          }
                        }}
                      />
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <Upload className="w-4 h-4 text-muted-foreground" />
                        </div>
                        {watchedValues.classification_file ? (
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-green-700">
                              {watchedValues.classification_file instanceof File
                                ? watchedValues.classification_file.name
                                : watchedValues.classification_file}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(watchedValues.classification_file instanceof
                              File
                                ? watchedValues.classification_file.size
                                : 0 / 1024 / 1024
                              ).toFixed(2)}{" "}
                              MB
                            </p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
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
                              {tSupplier("classificationFile")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PDF, DOC, DOCX, JPG, JPEG, PNG, WEBP (max 8MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="classification_file"
                      render={() => (
                        <FormItem>
                          <FormMessage className="text-xs text-destructive mt-1" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Work Fields Section */}
                <SupplierWorkFieldsSection
                  workFields={workFieldsList}
                  setWorkFields={setWorkFieldsList}
                  availableWorkFields={workFields}
                  isLoading={isLoading}
                />

                {/* Geographical Coverage Section */}
                <SupplierGeographicalCoverageSection
                  geographicalCoverage={geographicalCoverage}
                  setGeographicalCoverage={setGeographicalCoverage}
                  isLoading={isLoading}
                />

                {(error || workFieldsError) && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-destructive text-sm">
                      {error || workFieldsError}
                    </p>
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
                        {tSupplier("saving")}
                      </div>
                    ) : (
                      tSupplier("saveChanges")
                    )}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SupplierProfessionalInfo;
