"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
  Trash2,
  Save,
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
  FormDescription,
} from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { CitySelection } from "@/shared/components/ui/CitySelect";
import { useGetCountries } from "@/shared/hooks/globalHooks";
import { globalApi } from "@/shared/services/globalApi";
import Image from "next/image";
import { useAchievedProjectsStore } from "@/features/profile/store/achievedProjectsStore";
import {
  AchievedProjectFormData,
  CreateAchievedProjectRequest,
  UpdateAchievedProjectRequest,
} from "@/features/profile/types/achievedProjects";
import { createAchievedProjectValidationSchemas } from "@/features/profile/utils/achievedProjectsValidation";
import { cn } from "@/lib/utils";

interface AchievedProjectsFormProps {
  project?: AchievedProjectFormData | null;
  onSuccess?: (project: AchievedProjectFormData) => void;
  onCancel?: () => void;
  className?: string;
}

const ContractorAchievedProjectsForm: React.FC<AchievedProjectsFormProps> = ({
  project,
  onSuccess,
  onCancel,
  className,
}) => {
  const t = useTranslations("profile.achievedProjects");
  const validationT = useTranslations("profile.achievedProjects");
  const tCommon = useTranslations("common");
  const { countries } = useGetCountries();

  const {
    projectTypes: availableProjectTypes,
    isSubmitting,
    createProject,
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
  const [projectFeatures, setProjectFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState("");
  const [projectImages, setProjectImages] = useState<File[]>([]);
  const [selectedProjectType, setSelectedProjectType] = useState<number | null>(
    null
  );

  // Create validation schema
  const validationSchema = useMemo(() => {
    const { CreateAchievedProjectSchema } =
      createAchievedProjectValidationSchemas(validationT);
    return CreateAchievedProjectSchema;
  }, [validationT]);

  const form = useForm<AchievedProjectFormData>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      project_name_ar: "",
      project_name_en: "",
      description_ar: "",
      description_en: "",
      project_type_id: undefined,
      city_id: undefined,
      specific_location: "",
      start_date: "",
      end_date: "",
      execution_date: "",
      project_value: undefined,
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
      form.reset(project);
      setSelectedCountryId(project.country_id || null);
      setSelectedStateId(project.state_id || null);
      setSelectedCityId(project.city_id || null);
      setProjectFeatures(project.project_features || []);
      setProjectImages(project.project_images || []);
      setSelectedProjectType(project.project_type_id || null);
    }
  }, [project, form]);

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

  // Handle form submission
  const onSubmit = async (data: AchievedProjectFormData) => {
    try {
      const formData: CreateAchievedProjectRequest = {
        ...data,
        country_id: selectedCountryId || undefined,
        state_id: selectedStateId || undefined,
        city_id: selectedCityId || undefined,
        project_features: projectFeatures,
        project_images: projectImages,
        project_type_id: selectedProjectType || undefined,
      };

      // Create new project (update not supported by current API)
      await createProject(formData);
      toast.success(t("actions.createSuccess"));

      onSuccess?.(data);
    } catch (error) {
      toast.error(t("actions.submitError"));
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl">
          <div className="flex items-center gap-4 p-4 sm:p-6 bg-card border border-border rounded-lg shadow-sm mb-6">
            <div className="p-2 bg-design-main/10 rounded-lg">
              <Building2 className="h-5 w-5 text-design-main" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {t("addProject")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("formDescription")}
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
                            <Building2 className="h-4 w-4" />
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
                            <Building2 className="h-4 w-4" />
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
                            <Building2 className="h-4 w-4" />
                            {t("projectType")}
                          </FormLabel>
                          <div className="w-full">
                            <Select
                              onValueChange={handleProjectTypeChange}
                              value={selectedProjectType?.toString() || ""}
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
                            <MapPin className="h-4 w-4" />
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
                              value={selectedCountryId?.toString() || ""}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg">
                                  <SelectValue
                                    placeholder={t(
                                      "placeholders.selectCountry"
                                    )}
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
                              <MapPin className="h-4 w-4" />
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
                                value={selectedStateId?.toString() || ""}
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
                              <MapPin className="h-4 w-4" />
                              {t("city")}
                            </FormLabel>
                            <FormControl>
                              <CitySelection
                                hasLabel={false}
                                stateCode={selectedStateId?.toString() || null}
                                selectedCity={selectedCityId?.toString() || ""}
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
                          <MapPin className="h-4 w-4" />
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
                                      : undefined
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
                      <ImageIcon className="h-4 w-4" />
                      {t("projectImages")}
                    </FormLabel>
                    <div className="space-y-3">
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
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {t("clickToUploadImages")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("imageUploadHelp")}
                        </p>
                      </div>

                      {/* Image Preview */}
                      {projectImages.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {projectImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <Image
                                src={URL.createObjectURL(image)}
                                alt={`Project ${index + 1}`}
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
              <div className="flex justify-end pt-6 border-t border-border">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 sm:px-8 py-3 bg-design-main hover:bg-design-main-dark text-white font-medium rounded-lg shadow-sm transition-all duration-200 min-w-[140px] w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {tCommon("actions.saving")}
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {tCommon("actions.create")}
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

export default ContractorAchievedProjectsForm;
