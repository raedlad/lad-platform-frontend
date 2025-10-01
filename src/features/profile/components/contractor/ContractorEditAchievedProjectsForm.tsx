"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  Building2,
  Calendar,
  MapPin,
  DollarSign,
  Plus,
  X,
  Image as ImageIcon,
  Upload,
  Save,
  Edit,
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
import { CitySelection } from "@/shared/components/ui/CitySelect";
import { useGetCountries } from "@/shared/hooks/globalHooks";
import { globalApi } from "@/shared/services/globalApi";
import Image from "next/image";
import { useAchievedProjectsStore } from "@/features/profile/store/achievedProjectsStore";
import {
  AchievedProject,
  AchievedProjectFormData,
  UpdateAchievedProjectRequest,
  ProjectImage,
} from "@/features/profile/types/achievedProjects";
import { createAchievedProjectValidationSchemas } from "@/features/profile/utils/achievedProjectsValidation";
import { cn } from "@/lib/utils";

interface ContractorEditAchievedProjectsFormProps {
  project: AchievedProject;
  onSuccess?: (project: AchievedProject) => void;
  onCancel?: () => void;
  className?: string;
}

const ContractorEditAchievedProjectsForm: React.FC<
  ContractorEditAchievedProjectsFormProps
> = ({ project, onSuccess, onCancel, className }) => {
  const t = useTranslations("profile.achievedProjects");
  const tCommon = useTranslations("common");
  const { countries } = useGetCountries();

  const {
    projectTypes: availableProjectTypes,
    isSubmitting,
    updateProject,
    fetchProjectTypes,
  } = useAchievedProjectsStore();

  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null
  );
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [availableStates, setAvailableStates] = useState<
    Array<{ id: number; name: string }>
  >([]);
  const [isLoadingStates, setIsLoadingStates] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [projectFeatures, setProjectFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [projectImages, setProjectImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<ProjectImage[]>([]);
  const [selectedProjectType, setSelectedProjectType] = useState<number | null>(
    null
  );

  // Create validation schema
  const validationSchema = useMemo(() => {
    const { CreateAchievedProjectSchema } =
      createAchievedProjectValidationSchemas(t);
    return CreateAchievedProjectSchema;
  }, [t]);

  const form = useForm<AchievedProjectFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      project_name_ar: "",
      project_name_en: "",
      description_ar: "",
      description_en: "",
      project_type_id: null,
      city_id: null,
      specific_location: "",
      start_date: "",
      end_date: "",
      execution_date: "",
      project_value: null,
      currency: "USD",
      display_order: 0,
      project_features: [],
      challenges_faced: "",
      solutions_provided: "",
      project_images: [],
    },
  });

  // Load project types on mount
  useEffect(() => {
    fetchProjectTypes();
  }, [fetchProjectTypes]);

  // Initialize form with existing project data
  useEffect(() => {
    if (project) {
      // Map the project data to form data
      const formData: AchievedProjectFormData = {
        project_name_ar: project.project_name || "",
        project_name_en: project.project_name || "",
        description_ar: project.description || "",
        description_en: project.description || "",
        project_type_id: project.project_type_id
          ? parseInt(project.project_type_id)
          : null,
        city_id: project.city_id ? parseInt(project.city_id) : null,
        specific_location: project.specific_location || "",
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        execution_date: project.execution_date || "",
        project_value: project.project_value
          ? parseFloat(project.project_value)
          : null,
        currency:
          project.currency && project.currency.length === 3
            ? project.currency
            : "USD",
        display_order: project.display_order || 0,
        project_features: project.project_features || [],
        challenges_faced: project.challenges_faced || "",
        solutions_provided: project.solutions_provided || "",
        project_images: [],
      };

      form.reset(formData);

      // Set local state for features and images
      setProjectFeatures(project.project_features || []);
      setExistingImages(project.project_images || []);

      // Set local state for location
      const cityId = project.city_id ? parseInt(project.city_id) : null;
      setSelectedCityId(cityId);
      setSelectedCountryId(null);
      setSelectedStateId(null);

      // Fetch location info if city is available
      if (cityId && countries.length > 0) {
        setTimeout(() => {
          fetchLocationInfo(cityId);
        }, 100);
      } else if (cityId) {
        // Wait for countries to be loaded
        const checkCountries = () => {
          if (countries.length > 0) {
            fetchLocationInfo(cityId);
          } else {
            setTimeout(checkCountries, 100);
          }
        };
        checkCountries();
      }
    }
  }, [project, form, countries]);

  // Handle project type selection
  const handleProjectTypeChange = (value: string) => {
    const projectTypeId = parseInt(value);
    setSelectedProjectType(projectTypeId);
    form.setValue("project_type_id", projectTypeId);
  };

  // Fetch states when country changes
  const fetchStates = async (countryId: number) => {
    try {
      setIsLoadingStates(true);
      const country = countries.find((c) => c.id === countryId);
      if (country) {
        const response = await globalApi.getStates(country.iso2);
        if (response.success && response.data) {
          setAvailableStates(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      setAvailableStates([]);
    } finally {
      setIsLoadingStates(false);
    }
  };

  // Fetch country and state information based on city
  const fetchLocationInfo = async (cityId: number) => {
    try {
      setIsLoadingLocation(true);

      // Use the direct cities endpoint to get all cities with their country and state info
      const citiesResponse = await globalApi.getAllCities();

      if (citiesResponse.success && citiesResponse.data) {
        const city = citiesResponse.data.find((c) => c.id === cityId);
        if (city) {
          // Find the country and state from the city info
          const country = countries.find((c) => c.id === city.country_id);
          if (country) {
            // Fetch states for this country to get the state info
            try {
              const statesResponse = await globalApi.getStates(country.iso2);
              if (statesResponse.success && statesResponse.data) {
                const state = statesResponse.data.find(
                  (s) => s.id === city.state_id
                );
                if (state) {
                  // Set the form values
                  form.setValue("country_id", city.country_id);
                  form.setValue("state_id", city.state_id);
                  form.setValue("city_id", cityId);

                  // Set local state
                  setSelectedCountryId(city.country_id);
                  setSelectedStateId(city.state_id || null);
                  setSelectedCityId(cityId);
                  setAvailableStates(statesResponse.data);

                  return;
                }
              }
            } catch (stateError) {
              // Continue without setting state info
            }
          }
        }
      }
    } catch (error) {
      // Handle error silently
    } finally {
      setIsLoadingLocation(false);
    }
  };

  // Add project feature
  const addProjectFeature = () => {
    if (newFeature.trim()) {
      const updatedFeatures = [...projectFeatures, newFeature.trim()];
      setProjectFeatures(updatedFeatures);
      form.setValue("project_features", updatedFeatures);
      setNewFeature("");
    }
  };

  // Remove project feature
  const removeProjectFeature = (index: number) => {
    const updatedFeatures = projectFeatures.filter((_, i) => i !== index);
    setProjectFeatures(updatedFeatures);
    form.setValue("project_features", updatedFeatures);
  };

  // Handle image upload
  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;

    const newImages = Array.from(files);
    const updatedImages = [...projectImages, ...newImages];

    // Validate total count
    if (updatedImages.length > 10) {
      toast.error(t("validation.maxImages", { max: 10 }));
      return;
    }

    // Validate file sizes and types
    const invalidFiles = newImages.filter((file) => {
      if (file.size > 8 * 1024 * 1024) {
        toast.error(t("validation.fileSize", { maxSize: "8MB" }));
        return true;
      }
      if (
        !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        )
      ) {
        toast.error(t("validation.fileType", { types: "JPEG, PNG, WebP" }));
        return true;
      }
      return false;
    });

    if (invalidFiles.length === 0) {
      setProjectImages(updatedImages);
      form.setValue("project_images", updatedImages);
    }
  };

  // Remove project image
  const removeProjectImage = (index: number) => {
    const updatedImages = projectImages.filter((_, i) => i !== index);
    setProjectImages(updatedImages);
    form.setValue("project_images", updatedImages);
  };

  // Remove existing image
  const removeExistingImage = (index: number) => {
    const updatedImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedImages);
  };

  // Handle form submission
  const onSubmit = async (data: AchievedProjectFormData) => {
    try {
      const formData: UpdateAchievedProjectRequest = {
        ...data,
        id: project.id,
        country_id: data.country_id || selectedCountryId || null,
        state_id: data.state_id || selectedStateId || null,
        city_id: data.city_id || selectedCityId || null,
        project_features: projectFeatures,
        project_images: projectImages,
        project_type_id: data.project_type_id || selectedProjectType || null,
        currency:
          data.currency && data.currency.length === 3 ? data.currency : "USD",
      };

      await updateProject(project.id, formData);
      toast.success(t("actions.updateSuccess"));

      onSuccess?.(project);
    } catch (error) {
      toast.error(t("actions.submitError"));
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl">
          <div className="flex items-center gap-4 p-4 sm:p-6 bg-card border border-border rounded-lg shadow-sm mb-6">
            <div className="p-2 bg-design-main/10 rounded-lg">
              <Edit className="h-5 w-5 text-design-main" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {t("editProject")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("editProjectDescription")}
              </p>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 sm:space-y-8"
            >
              {/* Project Information Section */}
              <div className="bg-card border border-border rounded-lg shadow-sm">
                <div className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-design-main/10 rounded-lg flex-shrink-0">
                      <Building2 className="h-5 w-5 text-design-main" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base sm:text-lg font-semibold text-foreground">
                        {t("projectInformation")}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {t("projectInformationDescription")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Project Names */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="project_name_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-design-main" />
                            {t("projectNameEn")} *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t("placeholders.projectNameEn")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="project_name_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-design-main" />
                            {t("projectNameAr")} *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={t("placeholders.projectNameAr")}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Descriptions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="description_en"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("descriptionEn")} *</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder={t("placeholders.descriptionEn")}
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description_ar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("descriptionAr")} *</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder={t("placeholders.descriptionAr")}
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Project Type and Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="project_type_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-design-main" />
                            {t("projectType")}
                          </FormLabel>
                          <div className="w-full">
                            <Select
                              onValueChange={handleProjectTypeChange}
                              value={field.value?.toString() || ""}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg">
                                  <SelectValue
                                    placeholder={t(
                                      "placeholders.selectProjectType"
                                    )}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableProjectTypes.map((type) => (
                                  <SelectItem
                                    key={type.id}
                                    value={type.id.toString()}
                                  >
                                    {type.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="country_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-design-main" />
                            {t("country")}
                          </FormLabel>
                          <div className="w-full">
                            <Select
                              onValueChange={async (value) => {
                                const countryId = value
                                  ? parseInt(value)
                                  : null;
                                setSelectedCountryId(countryId);
                                setSelectedStateId(null);
                                setSelectedCityId(null);
                                setAvailableStates([]);
                                field.onChange(countryId);

                                if (countryId) {
                                  await fetchStates(countryId);
                                }
                              }}
                              value={field.value?.toString() || ""}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg">
                                  <SelectValue
                                    placeholder={
                                      isLoadingLocation
                                        ? t("loading")
                                        : t("placeholders.selectCountry")
                                    }
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {countries.map((country) => (
                                  <SelectItem
                                    key={country.id}
                                    value={country.id.toString()}
                                  >
                                    {country.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* State and City Selection */}
                  {selectedCountryId && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="state_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-design-main" />
                              {t("state")}
                            </FormLabel>
                            <div className="w-full">
                              <Select
                                onValueChange={(value) => {
                                  const stateId = value
                                    ? parseInt(value)
                                    : null;
                                  setSelectedStateId(stateId);
                                  setSelectedCityId(null);
                                  field.onChange(stateId);
                                }}
                                value={field.value?.toString() || ""}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg">
                                    <SelectValue
                                      placeholder={t(
                                        "placeholders.selectState"
                                      )}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {isLoadingStates ? (
                                    <SelectItem value="loading" disabled>
                                      Loading states...
                                    </SelectItem>
                                  ) : availableStates.length === 0 ? (
                                    <SelectItem value="no-states" disabled>
                                      No states available
                                    </SelectItem>
                                  ) : (
                                    availableStates.map((state) => (
                                      <SelectItem
                                        key={state.id}
                                        value={state.id.toString()}
                                      >
                                        {state.name}
                                      </SelectItem>
                                    ))
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-design-main" />
                              {t("city")}
                            </FormLabel>
                            <FormControl>
                              <CitySelection
                                hasLabel={false}
                                stateCode={selectedStateId?.toString() || null}
                                selectedCity={field.value?.toString() || ""}
                                onCityChange={(value) => {
                                  const cityId = value ? parseInt(value) : null;
                                  setSelectedCityId(cityId);
                                  field.onChange(cityId);
                                }}
                                placeholder={t("placeholders.selectCity")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Specific Location */}
                  <FormField
                    control={form.control}
                    name="specific_location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-design-main" />
                          {t("specificLocation")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder={t("placeholders.specificLocation")}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Project Dates */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Calendar className="h-5 w-5 text-design-main" />
                      <h4 className="text-base font-semibold text-foreground">
                        {t("projectDates")}
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                              <Calendar className="h-4 w-4 text-design-main" />
                              {t("startDate")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg"
                                placeholder="YYYY-MM-DD"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                              <Calendar className="h-4 w-4 text-design-main" />
                              {t("endDate")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg"
                                placeholder="YYYY-MM-DD"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="execution_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                              <Calendar className="h-4 w-4 text-design-main" />
                              {t("executionDate")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="date"
                                {...field}
                                className="h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg"
                                placeholder="YYYY-MM-DD"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Project Value and Currency */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <DollarSign className="h-5 w-5 text-design-main" />
                      <h4 className="text-base font-semibold text-foreground">
                        {t("projectValue")}
                      </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="project_value"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                              <DollarSign className="h-4 w-4 text-design-main" />
                              {t("projectValue")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value
                                      ? parseFloat(e.target.value)
                                      : null
                                  )
                                }
                                placeholder={t("placeholders.projectValue")}
                                className="h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg"
                                min="0"
                                step="0.01"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                              <DollarSign className="h-4 w-4 text-design-main" />
                              {t("currency")}
                            </FormLabel>
                            <div className="w-full">
                              <Select
                                onValueChange={field.onChange}
                                value={field.value || "USD"}
                              >
                                <FormControl>
                                  <SelectTrigger className="w-full h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg">
                                    <SelectValue
                                      placeholder={t(
                                        "placeholders.selectCurrency"
                                      )}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="USD">
                                    USD - US Dollar
                                  </SelectItem>
                                  <SelectItem value="EUR">
                                    EUR - Euro
                                  </SelectItem>
                                  <SelectItem value="GBP">
                                    GBP - British Pound
                                  </SelectItem>
                                  <SelectItem value="SAR">
                                    SAR - Saudi Riyal
                                  </SelectItem>
                                  <SelectItem value="AED">
                                    AED - UAE Dirham
                                  </SelectItem>
                                  <SelectItem value="KWD">
                                    KWD - Kuwaiti Dinar
                                  </SelectItem>
                                  <SelectItem value="QAR">
                                    QAR - Qatari Riyal
                                  </SelectItem>
                                  <SelectItem value="BHD">
                                    BHD - Bahraini Dinar
                                  </SelectItem>
                                  <SelectItem value="OMR">
                                    OMR - Omani Rial
                                  </SelectItem>
                                  <SelectItem value="JOD">
                                    JOD - Jordanian Dinar
                                  </SelectItem>
                                  <SelectItem value="EGP">
                                    EGP - Egyptian Pound
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Project Features */}
                  <div className="space-y-4">
                    <FormLabel>{t("projectFeatures")}</FormLabel>
                    <div className="space-y-3">
                      {projectFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={feature} readOnly className="flex-1" />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProjectFeature(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <Input
                          value={newFeature}
                          onChange={(e) => setNewFeature(e.target.value)}
                          placeholder={t("placeholders.addFeature")}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addProjectFeature();
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addProjectFeature}
                          disabled={!newFeature.trim()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Project Images */}
                  <div className="space-y-4">
                    <FormLabel className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-design-main" />
                      {t("projectImages")}
                    </FormLabel>
                    <div className="space-y-3">
                      {/* Existing Images */}
                      {existingImages.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            {t("existingImages")}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {existingImages.map((image, index) => (
                              <div key={index} className="relative group">
                                <Image
                                  src={
                                    image.original_url || "/placeholder-vid.mp4"
                                  }
                                  alt={`Existing project ${index + 1}`}
                                  width={100}
                                  height={100}
                                  className="w-full h-24 object-cover rounded-lg"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeExistingImage(index)}
                                  className="absolute top-1 right-1 h-6 w-6 p-0 bg-destructive/80 text-white hover:bg-destructive hover:text-white"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Image Upload Area */}
                      <div
                        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                      >
                        <input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e.target.files)}
                        />
                        <Upload className="h-8 w-8 mx-auto mb-2 text-design-main" />
                        <p className="text-sm text-muted-foreground">
                          {t("clickToUploadImages")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("imageUploadHelp")}
                        </p>
                      </div>

                      {/* New Image Preview */}
                      {projectImages.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-muted-foreground">
                            {t("newImages")}
                          </p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {projectImages.map((image, index) => (
                              <div key={index} className="relative group">
                                <Image
                                  src={URL.createObjectURL(image)}
                                  alt={`New project ${index + 1}`}
                                  width={100}
                                  height={100}
                                  className="w-full h-24 object-cover rounded-lg"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeProjectImage(index)}
                                  className="absolute top-1 right-1 h-6 w-6 p-0 bg-destructive/80 text-white hover:bg-destructive hover:text-white"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Challenges and Solutions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="challenges_faced"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("challenges")}</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder={t("placeholders.challenges")}
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="solutions_provided"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("solutions")}</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder={t("placeholders.solutions")}
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="px-6 sm:px-8 py-3"
                >
                  {tCommon("actions.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 sm:px-8 py-3 bg-design-main hover:bg-design-main-dark text-white font-medium rounded-lg shadow-sm transition-all duration-200 min-w-[140px]  sm:w-auto"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {tCommon("actions.saving")}
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {tCommon("actions.update")}
                    </>
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

export default ContractorEditAchievedProjectsForm;
