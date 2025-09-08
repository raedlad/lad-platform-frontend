"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { Badge } from "@/shared/components/ui/badge";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  Building,
  Users,
  Award,
  MapPin,
  Briefcase,
  FileText,
  Plus,
  Trash2,
  Upload,
  CheckCircle,
  Pencil,
  X,
} from "lucide-react";
import { useOperationalStore } from "../../store/operationalStore";
import { operationalApi } from "../../services/operationalApi";
import mockOperationalData from "../../constants/mockoOperational.json";
import LocationSelect from "../common/LocationSelect";
import { ContractorOperationalSchema } from "../../utils/validation";
import { cn } from "@/lib/utils";

type ContractorOperationalFormData = z.infer<
  typeof ContractorOperationalSchema
>;

const ContractorOperational = () => {
  const {
    operationalData,
    setOperationalData,
    contractorOperationalData,
    setContractorOperationalData,
    isLoading,
    error,
    setLoading,
    setError,
  } = useOperationalStore();
  const [isEditing, setIsEditing] = useState(false);
  const [workFields, setWorkFields] = useState<
    Array<{ work_field_id: number; years_of_experience_in_field: number }>
  >([]);
  const [geographicalCoverage, setGeographicalCoverage] = useState<
    Array<{
      country_code: string;
      state_id?: string;
      city_id?: string;
      covers_all_areas: boolean;
    }>
  >([]);
  const [contractorCoverage, setContractorCoverage] = useState<
    Array<{
      country_code: string;
      state_id?: string;
      city_id?: string;
      covers_all_areas: boolean;
    }>
  >([]);

  // Load operational data on component mount
  useEffect(() => {
    const loadOperationalData = async () => {
      if (!operationalData) {
        try {
          // Try to fetch from API first, fallback to mock data
          const data = await operationalApi.getOperationalData();
          setOperationalData(data);
        } catch (error) {
          console.warn(
            "Failed to fetch operational data from API, using mock data:",
            error
          );
          setOperationalData(mockOperationalData.response);
        }
      }
    };

    loadOperationalData();
  }, [operationalData, setOperationalData]);

  const form = useForm<ContractorOperationalFormData>({
    resolver: zodResolver(ContractorOperationalSchema),
    defaultValues: {
      executed_project_range_id: 0,
      staff_size_range_id: 0,
      experience_years_range_id: 0,
      annual_projects_range_id: 0,
      classification_level_id: undefined,
      classification_file: undefined,
      has_government_accreditation: false,
      covers_all_regions: false,
      target_project_value_range_ids: [],
      work_fields: [],
      operational_geographical_coverage: [],
      contractor_geographic_coverages: [],
    },
  });

  const onSubmit = async (data: ContractorOperationalFormData) => {
    console.log("Form submission started with data:", data);
    console.log("Work fields:", workFields);
    console.log("Geographical coverage:", geographicalCoverage);
    console.log("Contractor coverage:", contractorCoverage);

    try {
      setLoading(true);
      setError(null);

      // Map the form data to include the current state
      const formData = {
        ...data,
        work_fields: workFields,
        operational_geographical_coverage: geographicalCoverage,
        contractor_geographic_coverages: contractorCoverage,
      };

      console.log("Final form data being sent:", formData);
      await operationalApi.updateFullOperationalProfile(formData);
      setContractorOperationalData(formData);
      setIsEditing(false);
      console.log("API call successful");
      // You could add a success toast here
    } catch (error) {
      console.error("Error updating operational profile:", error);
      setError("Failed to update operational profile. Please try again.");
      // You could add an error toast here
    } finally {
      setLoading(false);
    }
  };

  const addWorkField = () => {
    setWorkFields([
      ...workFields,
      { work_field_id: 0, years_of_experience_in_field: 0 },
    ]);
  };

  const removeWorkField = (index: number) => {
    setWorkFields(workFields.filter((_, i) => i !== index));
  };

  const addGeographicalCoverage = () => {
    setGeographicalCoverage([
      ...geographicalCoverage,
      {
        country_code: "",
        state_id: "",
        city_id: "",
        covers_all_areas: false,
      },
    ]);
  };

  const removeGeographicalCoverage = (index: number) => {
    setGeographicalCoverage(geographicalCoverage.filter((_, i) => i !== index));
  };

  const addContractorCoverage = () => {
    setContractorCoverage([
      ...contractorCoverage,
      {
        country_code: "",
        state_id: "",
        city_id: "",
        covers_all_areas: false,
      },
    ]);
  };

  const removeContractorCoverage = (index: number) => {
    setContractorCoverage(contractorCoverage.filter((_, i) => i !== index));
  };

  if (!operationalData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading operational data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className=" rounded-xl  overflow-hidden">
          <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Operational Information
                </h1>
                <p className="text-gray-600 text-sm">
                  Manage your contractor operational details and capabilities
                </p>
              </div>
              <div className="flex items-center gap-3">
                {!isEditing && (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit Information
                  </Button>
                )}
                {isEditing && (
                  <Button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="p-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Project Information */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Project Information
                        </h3>
                        <p className="text-sm text-gray-600">
                          Details about your project execution capabilities
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="executed_project_range_id"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-500" />
                              Executed Project Value Range
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(parseInt(value))
                              }
                              value={
                                field.value && field.value > 0
                                  ? field.value.toString()
                                  : ""
                              }
                              disabled={isLoading || !isEditing}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg">
                                  <SelectValue placeholder="Select executed project value range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {operationalData.executed_project_value_ranges.map(
                                  (range) => (
                                    <SelectItem
                                      key={range.id}
                                      value={range.id.toString()}
                                    >
                                      {range.label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs text-red-600" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="staff_size_range_id"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-500" />
                              Staff Size Range
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(parseInt(value))
                              }
                              value={
                                field.value && field.value > 0
                                  ? field.value.toString()
                                  : ""
                              }
                              disabled={isLoading || !isEditing}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg">
                                  <SelectValue placeholder="Select staff size range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {operationalData.staff_size_ranges.map(
                                  (range) => (
                                    <SelectItem
                                      key={range.id}
                                      value={range.id.toString()}
                                    >
                                      {range.label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs text-red-600" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="experience_years_range_id"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Award className="h-4 w-4 text-gray-500" />
                              Experience Years Range
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(parseInt(value))
                              }
                              value={
                                field.value && field.value > 0
                                  ? field.value.toString()
                                  : ""
                              }
                              disabled={isLoading || !isEditing}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg">
                                  <SelectValue placeholder="Select experience years range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {operationalData.experience_years_ranges.map(
                                  (range) => (
                                    <SelectItem
                                      key={range.id}
                                      value={range.id.toString()}
                                    >
                                      {range.label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs text-red-600" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="annual_projects_range_id"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-gray-500" />
                              Annual Projects Range
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(parseInt(value))
                              }
                              value={
                                field.value && field.value > 0
                                  ? field.value.toString()
                                  : ""
                              }
                              disabled={isLoading || !isEditing}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg">
                                  <SelectValue placeholder="Select annual projects range" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {operationalData.annual_projects_ranges.map(
                                  (range) => (
                                    <SelectItem
                                      key={range.id}
                                      value={range.id.toString()}
                                    >
                                      {range.label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs text-red-600" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="target_project_value_range_ids"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            Target Project Value Ranges
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormDescription className="text-sm text-gray-600">
                            Select all applicable target project value ranges
                          </FormDescription>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {operationalData.target_project_value_ranges.map(
                              (range) => (
                                <div
                                  key={range.id}
                                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <Checkbox
                                    id={`target-${range.id}`}
                                    checked={
                                      field.value?.includes(range.id) || false
                                    }
                                    onCheckedChange={(checked) => {
                                      const currentValues = field.value || [];
                                      if (checked) {
                                        field.onChange([
                                          ...currentValues,
                                          range.id,
                                        ]);
                                      } else {
                                        field.onChange(
                                          currentValues.filter(
                                            (id) => id !== range.id
                                          )
                                        );
                                      }
                                    }}
                                    disabled={isLoading || !isEditing}
                                    className="border-gray-300"
                                  />
                                  <Label
                                    htmlFor={`target-${range.id}`}
                                    className="text-sm font-medium text-gray-700 cursor-pointer"
                                  >
                                    {range.label}
                                  </Label>
                                </div>
                              )
                            )}
                          </div>
                          <FormMessage className="text-xs text-red-600" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Classification & Accreditation */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Award className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Classification & Accreditation
                        </h3>
                        <p className="text-sm text-gray-600">
                          Your contractor classification and accreditation
                          details
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="classification_level_id"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Award className="h-4 w-4 text-gray-500" />
                              Classification Level
                            </FormLabel>
                            <Select
                              onValueChange={(value) =>
                                field.onChange(parseInt(value))
                              }
                              value={
                                field.value && field.value > 0
                                  ? field.value.toString()
                                  : ""
                              }
                              disabled={isLoading || !isEditing}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg">
                                  <SelectValue placeholder="Select classification level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {operationalData.classification_levels.map(
                                  (level) => (
                                    <SelectItem
                                      key={level.id}
                                      value={level.id.toString()}
                                    >
                                      {level.label}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage className="text-xs text-red-600" />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="classification_file"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Upload className="h-4 w-4 text-gray-500" />
                              Classification File
                            </FormLabel>
                            <FormDescription className="text-sm text-gray-600">
                              Upload your classification certificate (PDF, JPG,
                              JPEG, PNG, WEBP, max 8MB)
                            </FormDescription>
                            <FormControl>
                              <Input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png,.webp"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file && file.size <= 8 * 1024 * 1024) {
                                    // 8MB
                                    field.onChange(file as File);
                                  }
                                }}
                                disabled={isLoading || !isEditing}
                                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                              />
                            </FormControl>
                            <FormMessage className="text-xs text-red-600" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="has_government_accreditation"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-gray-200 rounded-lg">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isLoading || !isEditing}
                                className="border-gray-300"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Has Government Accreditation
                              </FormLabel>
                              <FormDescription className="text-sm text-gray-600">
                                Check if you have government accreditation
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="covers_all_regions"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-gray-200 rounded-lg">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                disabled={isLoading || !isEditing}
                                className="border-gray-300"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-medium text-gray-700">
                                Covers All Regions
                              </FormLabel>
                              <FormDescription className="text-sm text-gray-600">
                                Check if your services cover all regions
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Work Fields */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Briefcase className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Work Fields & Experience
                        </h3>
                        <p className="text-sm text-gray-600">
                          Specify your work fields and years of experience in
                          each
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    {workFields.map((workField, index) => (
                      <div
                        key={index}
                        className="flex items-end gap-4 p-4 border border-gray-200 rounded-lg"
                      >
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-gray-500" />
                              Work Field
                            </Label>
                            <Select
                              value={
                                workField.work_field_id > 0
                                  ? workField.work_field_id.toString()
                                  : ""
                              }
                              onValueChange={(value) => {
                                const updated = [...workFields];
                                updated[index].work_field_id = parseInt(value);
                                setWorkFields(updated);
                              }}
                              disabled={isLoading || !isEditing}
                            >
                              <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg">
                                <SelectValue placeholder="Select work field" />
                              </SelectTrigger>
                              <SelectContent>
                                {operationalData.work_fields.map((field) => (
                                  <SelectItem
                                    key={field.id}
                                    value={field.id.toString()}
                                  >
                                    {field.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                              <Award className="h-4 w-4 text-gray-500" />
                              Years of Experience
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              value={workField.years_of_experience_in_field}
                              onChange={(e) => {
                                const updated = [...workFields];
                                updated[index].years_of_experience_in_field =
                                  parseInt(e.target.value) || 0;
                                setWorkFields(updated);
                              }}
                              disabled={isLoading || !isEditing}
                              className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-lg"
                            />
                          </div>
                        </div>
                        {isEditing && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeWorkField(index)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {isEditing && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addWorkField}
                        className="w-full h-11 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Work Field
                      </Button>
                    )}
                  </div>
                </div>

                {/* Geographical Coverage */}
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200 bg-gray-50/50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <MapPin className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Geographical Coverage
                        </h3>
                        <p className="text-sm text-gray-600">
                          Define your operational and contractor geographical
                          coverage
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">
                        Operational Coverage
                      </h4>
                      {geographicalCoverage.map((coverage, index) => (
                        <div
                          key={index}
                          className="flex items-end gap-4 p-4 border border-gray-200 rounded-lg mb-4"
                        >
                          <div className="flex-1 space-y-4">
                            <LocationSelect
                              selectedCountry={coverage.country_code}
                              selectedState={coverage.state_id}
                              selectedCity={coverage.city_id}
                              onCountryChange={(countryCode) => {
                                const updated = [...geographicalCoverage];
                                updated[index].country_code = countryCode;
                                updated[index].state_id = "";
                                updated[index].city_id = "";
                                setGeographicalCoverage(updated);
                              }}
                              onStateChange={(stateCode) => {
                                const updated = [...geographicalCoverage];
                                updated[index].state_id = stateCode;
                                updated[index].city_id = "";
                                setGeographicalCoverage(updated);
                              }}
                              onCityChange={(cityCode) => {
                                const updated = [...geographicalCoverage];
                                updated[index].city_id = cityCode;
                                setGeographicalCoverage(updated);
                              }}
                              disabled={isLoading || !isEditing}
                            />
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`covers-all-${index}`}
                                checked={coverage.covers_all_areas}
                                onCheckedChange={(checked) => {
                                  const updated = [...geographicalCoverage];
                                  updated[index].covers_all_areas =
                                    checked as boolean;
                                  setGeographicalCoverage(updated);
                                }}
                                disabled={isLoading || !isEditing}
                                className="border-gray-300"
                              />
                              <Label
                                htmlFor={`covers-all-${index}`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Covers All Areas
                              </Label>
                            </div>
                          </div>
                          {isEditing && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeGeographicalCoverage(index)}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addGeographicalCoverage}
                          className="w-full h-11 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Operational Coverage
                        </Button>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">
                        Contractor Geographic Coverage
                      </h4>
                      {contractorCoverage.map((coverage, index) => (
                        <div
                          key={index}
                          className="flex items-end gap-4 p-4 border border-gray-200 rounded-lg mb-4"
                        >
                          <div className="flex-1 space-y-4">
                            <LocationSelect
                              selectedCountry={coverage.country_code}
                              selectedState={coverage.state_id}
                              selectedCity={coverage.city_id}
                              onCountryChange={(countryCode) => {
                                const updated = [...contractorCoverage];
                                updated[index].country_code = countryCode;
                                updated[index].state_id = "";
                                updated[index].city_id = "";
                                setContractorCoverage(updated);
                              }}
                              onStateChange={(stateCode) => {
                                const updated = [...contractorCoverage];
                                updated[index].state_id = stateCode;
                                updated[index].city_id = "";
                                setContractorCoverage(updated);
                              }}
                              onCityChange={(cityCode) => {
                                const updated = [...contractorCoverage];
                                updated[index].city_id = cityCode;
                                setContractorCoverage(updated);
                              }}
                              disabled={isLoading || !isEditing}
                            />
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                id={`contractor-covers-all-${index}`}
                                checked={coverage.covers_all_areas}
                                onCheckedChange={(checked) => {
                                  const updated = [...contractorCoverage];
                                  updated[index].covers_all_areas =
                                    checked as boolean;
                                  setContractorCoverage(updated);
                                }}
                                disabled={isLoading || !isEditing}
                                className="border-gray-300"
                              />
                              <Label
                                htmlFor={`contractor-covers-all-${index}`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Covers All Areas
                              </Label>
                            </div>
                          </div>
                          {isEditing && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeContractorCoverage(index)}
                              className="border-red-200 text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addContractorCoverage}
                          className="w-full h-11 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Contractor Coverage
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {/* Validation Errors Summary */}
                {Object.keys(form.formState.errors).length > 0 && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-yellow-800 text-sm font-medium mb-2">
                      Please fix the following errors:
                    </p>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      {Object.entries(form.formState.errors).map(
                        ([field, error]) => (
                          <li key={field}>
                            • {field}: {error?.message || "Invalid value"}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}

                {isEditing && (
                  <div className="flex justify-end pt-6 border-t border-gray-200">
                    <Button
                      type="submit"
                      className={cn(
                        "px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-all duration-200 min-w-[140px]",
                        isLoading &&
                          "cursor-not-allowed bg-gray-400 hover:bg-gray-400"
                      )}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Saving...
                        </div>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractorOperational;
