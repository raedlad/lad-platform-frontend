"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Plus, Trash2, Upload, X, FileText, MapPin } from "lucide-react";
import toast from "react-hot-toast";

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

import { useGetCountries } from "@/shared/hooks/globalHooks";
import { useExperienceYearsRanges } from "@/features/profile/hooks/useExperienceYearsRanges";
// import { useWorkFields } from "@/features/profile/hooks/useWorkFields";
import { createProfileValidationSchemas } from "@/features/profile/utils/validation";
import { personalInfoApi } from "@/features/profile/services/personalInfoApi";
import { cn } from "@/lib/utils";

// Types
interface WorkField {
  work_field_id: number;
  field_specific_notes?: string;
}

interface GeographicalCoverage {
  city_id: number;
  covers_all_areas: boolean;
  specific_areas?: string[];
  priority?: "high" | "medium" | "low";
  notes?: string;
}

interface ValidationErrors {
  [key: string]: string;
}

interface SupplierProfessionalInfoFormData {
  experience_years_range_id: number;
  has_government_accreditation: boolean;
  classification_file?: File;
  work_fields: WorkField[];
  geographical_coverage: GeographicalCoverage[];
}

interface WorkFieldOption {
  id: number;
  name: string;
  name_en: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
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
    delegation_form?: File | null;
    avatar?: File | null;
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
  // Mock work fields for now - replace with useWorkFields when TypeScript issue is resolved
  const workFields: WorkFieldOption[] = [
    {
      id: 1,
      name: "Construction",
      name_en: "Construction",
      description: "Construction work",
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 2,
      name: "Engineering",
      name_en: "Engineering",
      description: "Engineering work",
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
    {
      id: 3,
      name: "Consulting",
      name_en: "Consulting",
      description: "Consulting work",
      is_active: true,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    },
  ];
  const workFieldsLoading = false;

  // State
  const [workFieldsList, setWorkFieldsList] = useState<WorkField[]>([]);
  const [geographicalCoverage, setGeographicalCoverage] = useState<
    GeographicalCoverage[]
  >([]);
  const [classificationFile, setClassificationFile] = useState<File | null>(
    null
  );
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );
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
    resolver: zodResolver(validationSchema),
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
        console.error("Error loading supplier profile:", error);
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
      setWorkFieldsList(professionalInfo.work_fields);
    }

    // Set geographical coverage
    if (
      professionalInfo.geographical_coverage &&
      Array.isArray(professionalInfo.geographical_coverage)
    ) {
      setGeographicalCoverage(professionalInfo.geographical_coverage);
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

  // Clear form errors helper
  const clearFormErrors = (fieldName: string) => {
    const newErrors = { ...validationErrors };
    delete newErrors[fieldName];
    setValidationErrors(newErrors);
  };

  // Add work field
  const addWorkField = () => {
    const newWorkField: WorkField = {
      work_field_id: 0,
      field_specific_notes: "",
    };
    setWorkFieldsList([...workFieldsList, newWorkField]);
  };

  // Remove work field
  const removeWorkField = (index: number) => {
    const updatedWorkFields = workFieldsList.filter((_, i) => i !== index);
    setWorkFieldsList(updatedWorkFields);
  };

  // Update work field
  const updateWorkField = (
    index: number,
    field: keyof WorkField,
    value: string | number
  ) => {
    const updatedWorkFields = workFieldsList.map((workField, i) =>
      i === index ? { ...workField, [field]: value } : workField
    );
    setWorkFieldsList(updatedWorkFields);
    clearFormErrors(`work_fields.${index}.${field}`);
  };

  // Add geographical coverage
  const addGeographicalCoverage = () => {
    const newCoverage: GeographicalCoverage = {
      city_id: 0,
      covers_all_areas: false,
      specific_areas: [],
      priority: "medium",
      notes: "",
    };
    setGeographicalCoverage([...geographicalCoverage, newCoverage]);
  };

  // Remove geographical coverage
  const removeGeographicalCoverage = (index: number) => {
    const updatedCoverage = geographicalCoverage.filter((_, i) => i !== index);
    setGeographicalCoverage(updatedCoverage);
  };

  // Update geographical coverage
  const updateGeographicalCoverage = (
    index: number,
    field: keyof GeographicalCoverage,
    value: string | number | boolean | string[] | "high" | "medium" | "low"
  ) => {
    const updatedCoverage = geographicalCoverage.map((coverage, i) =>
      i === index ? { ...coverage, [field]: value } : coverage
    );
    setGeographicalCoverage(updatedCoverage);
    clearFormErrors(`geographical_coverage.${index}.${field}`);
  };

  // Change detection
  const hasChanged = useMemo(() => {
    const formFieldsChanged =
      watchedValues.experience_years_range_id !==
        initialState.experience_years_range_id ||
      watchedValues.has_government_accreditation !==
        initialState.has_government_accreditation ||
      classificationFile !== null;

    const workFieldsChanged =
      JSON.stringify(workFieldsList) !==
      JSON.stringify(initialState.workFields);
    const geographicalCoverageChanged =
      JSON.stringify(geographicalCoverage) !==
      JSON.stringify(initialState.geographical_coverage);

    return (
      formFieldsChanged || workFieldsChanged || geographicalCoverageChanged
    );
  }, [
    watchedValues,
    workFieldsList,
    geographicalCoverage,
    initialState,
    classificationFile,
  ]);

  // Form submission
  const onSubmit = async (data: SupplierProfessionalInfoFormData) => {
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
    formData.append(
      "has_government_accreditation",
      data.has_government_accreditation.toString()
    );

    // Add classification file if present
    if (classificationFile) {
      formData.append("classification_file", classificationFile);
    }

    // Add work fields
    workFieldsList.forEach((workField, index) => {
      formData.append(
        `work_fields[${index}][work_field_id]`,
        workField.work_field_id.toString()
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
        coverage.city_id.toString()
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
      classification_file: classificationFile,
      work_fields: workFieldsList,
      geographical_coverage: geographicalCoverage,
    };

    const validationResult = validationSchema.safeParse(validationData);

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((error: any) => {
        const path = error.path.join(".");
        errors[path] = error.message;
      });

      setValidationErrors(errors);
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

      setValidationErrors({});
      setInitialState({
        experience_years_range_id: watchedValues.experience_years_range_id,
        has_government_accreditation:
          watchedValues.has_government_accreditation,
        workFields: [...workFieldsList],
        geographical_coverage: [...geographicalCoverage],
      });

      setClassificationFile(null);

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                    <FileText className="text-muted-foreground/50 p-1" />
                    <label className="text-sm font-medium text-foreground">
                      {tSupplier("classificationFile")}
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
                            {tSupplier("classificationFile")}
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
              </div>

              {/* Work Fields Section */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {tSupplier("workFields")}
                    <span className="text-red-500 ml-1">*</span>
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addWorkField}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {tSupplier("addWorkField")}
                  </Button>
                </div>

                {validationErrors.work_fields && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-destructive text-sm">
                      {validationErrors.work_fields}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {workFieldsList.map((workField, index) => (
                    <div
                      key={index}
                      className="p-4 border border-border rounded-lg bg-gray-50/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-foreground">
                          {tSupplier("workField")} {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeWorkField(index)}
                          disabled={isLoading}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            {tSupplier("workFieldType")}
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Select
                            disabled={isLoading}
                            value={workField.work_field_id.toString()}
                            onValueChange={(value) =>
                              updateWorkField(
                                index,
                                "work_field_id",
                                parseInt(value)
                              )
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue
                                placeholder={tSupplier(
                                  "placeholders.selectWorkField"
                                )}
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {workFields.map((field: WorkFieldOption) => (
                                <SelectItem
                                  key={field.id}
                                  value={field.id.toString()}
                                >
                                  {field.name_en || field.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {validationErrors[
                            `work_fields.${index}.work_field_id`
                          ] && (
                            <p className="text-destructive text-xs mt-1">
                              {
                                validationErrors[
                                  `work_fields.${index}.work_field_id`
                                ]
                              }
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            {tSupplier("fieldSpecificNotes")}
                          </label>
                          <Input
                            value={workField.field_specific_notes || ""}
                            onChange={(e) =>
                              updateWorkField(
                                index,
                                "field_specific_notes",
                                e.target.value
                              )
                            }
                            disabled={isLoading}
                            placeholder={tSupplier(
                              "placeholders.enterFieldNotes"
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {workFieldsList.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>{tSupplier("noWorkFields")}</p>
                  </div>
                )}
              </div>

              {/* Geographical Coverage Section */}
              <div className="bg-card rounded-lg border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {tSupplier("geographicalCoverage")}
                    <span className="text-red-500 ml-1">*</span>
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addGeographicalCoverage}
                    disabled={isLoading}
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {tSupplier("addCoverage")}
                  </Button>
                </div>

                {validationErrors.geographical_coverage && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-destructive text-sm">
                      {validationErrors.geographical_coverage}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {geographicalCoverage.map((coverage, index) => (
                    <div
                      key={index}
                      className="p-4 border border-border rounded-lg bg-gray-50/50"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-design-main" />
                          <h4 className="text-sm font-medium text-foreground">
                            {tSupplier("coverage")} {index + 1}
                          </h4>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeGeographicalCoverage(index)}
                          disabled={isLoading}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            {tSupplier("city")}
                            <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Input
                            type="number"
                            value={coverage.city_id || ""}
                            onChange={(e) =>
                              updateGeographicalCoverage(
                                index,
                                "city_id",
                                parseInt(e.target.value) || 0
                              )
                            }
                            disabled={isLoading}
                            placeholder={tSupplier("placeholders.enterCityId")}
                          />
                          {validationErrors[
                            `geographical_coverage.${index}.city_id`
                          ] && (
                            <p className="text-destructive text-xs mt-1">
                              {
                                validationErrors[
                                  `geographical_coverage.${index}.city_id`
                                ]
                              }
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`covers_all_areas_${index}`}
                            checked={coverage.covers_all_areas}
                            onCheckedChange={(checked) =>
                              updateGeographicalCoverage(
                                index,
                                "covers_all_areas",
                                checked
                              )
                            }
                            disabled={isLoading}
                          />
                          <label
                            htmlFor={`covers_all_areas_${index}`}
                            className="text-sm font-medium text-foreground"
                          >
                            {tSupplier("coversAllAreas")}
                          </label>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            {tSupplier("priority")}
                          </label>
                          <Select
                            disabled={isLoading}
                            value={coverage.priority || "medium"}
                            onValueChange={(value) =>
                              updateGeographicalCoverage(
                                index,
                                "priority",
                                value as "high" | "medium" | "low"
                              )
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="high">
                                {tSupplier("priorities.high")}
                              </SelectItem>
                              <SelectItem value="medium">
                                {tSupplier("priorities.medium")}
                              </SelectItem>
                              <SelectItem value="low">
                                {tSupplier("priorities.low")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-foreground mb-2 block">
                            {tSupplier("notes")}
                          </label>
                          <Input
                            value={coverage.notes || ""}
                            onChange={(e) =>
                              updateGeographicalCoverage(
                                index,
                                "notes",
                                e.target.value
                              )
                            }
                            disabled={isLoading}
                            placeholder={tSupplier("placeholders.enterNotes")}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {geographicalCoverage.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>{tSupplier("noGeographicalCoverage")}</p>
                  </div>
                )}
              </div>

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
                      {tSupplier("saving")}
                    </div>
                  ) : (
                    tSupplier("saveChanges")
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

export default SupplierProfessionalInfo;
