"use client";
import React, { useEffect } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@shared/components/ui/form";
import { Input } from "@shared/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { createProjectValidationSchemas } from "@/features/project/utils/validation";
import { useProjectStore } from "@/features/project/store/projectStore";
import { useCreateProject } from "@/features/project/hooks/useCreateProject";
import ProjectType from "../../common/ProjectType";
import { CitySelection } from "@/shared/components/ui/CitySelect";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import DurationSelect from "../../common/DurationSelect";
import { Textarea } from "@/shared/components/ui/textarea";
import NavigationButtons from "../../common/NavigationButtons";
import { toast } from "react-hot-toast";
import { LocationInput } from "../../common/LocationInput";
import {
  formatNumberWithCommas,
  parseFormattedNumber,
} from "@/lib/numberFormat";

const EssentialInfoForm = ({ create }: { create?: boolean }) => {
  const t = useTranslations("");
  const { ProjectEssentialInfoSchema } = createProjectValidationSchemas(t);
  const { originalEssentialInfoData, projectId, isLoading } = useProjectStore();
  const { error, submitEssentialInfo } = useCreateProject();
  const form = useForm<z.infer<typeof ProjectEssentialInfoSchema>>({
    resolver: zodResolver(ProjectEssentialInfoSchema),
    defaultValues: {
      title: create ? "" : originalEssentialInfoData?.title || "",
      project_type_id: create
        ? 0
        : originalEssentialInfoData?.project_type_id || 0,
      city_id: create ? "" : originalEssentialInfoData?.city_id || "",
      district: create ? "" : originalEssentialInfoData?.district || "",
      address_line: create ? "" : originalEssentialInfoData?.address_line || "",
      latitude: create ? undefined : originalEssentialInfoData?.latitude,
      longitude: create ? undefined : originalEssentialInfoData?.longitude,
      budget_min: create ? 0 : originalEssentialInfoData?.budget_min || 0,
      budget_max: create ? 0 : originalEssentialInfoData?.budget_max || 0,
      budget_unit: create
        ? "SAR"
        : originalEssentialInfoData?.budget_unit || "SAR",
      duration_value: create
        ? 0
        : originalEssentialInfoData?.duration_value || 0,
      duration_unit: create
        ? "days"
        : originalEssentialInfoData?.duration_unit || "days",
      area_sqm: create ? 0 : originalEssentialInfoData?.area_sqm || 0,
      description: create ? "" : originalEssentialInfoData?.description || "",
    },
  });

  useEffect(() => {
    if (originalEssentialInfoData && !create) {
      const formData = {
        title: originalEssentialInfoData.title || "",
        project_type_id: originalEssentialInfoData.project_type_id || 0,
        city_id: originalEssentialInfoData.city_id || "",
        district: originalEssentialInfoData.district || "",
        address_line: originalEssentialInfoData.address_line || "",
        latitude: originalEssentialInfoData.latitude,
        longitude: originalEssentialInfoData.longitude,
        budget_min: originalEssentialInfoData.budget_min || 0,
        budget_max: originalEssentialInfoData.budget_max || 0,
        budget_unit: originalEssentialInfoData.budget_unit || "SAR",
        duration_value: originalEssentialInfoData.duration_value || 0,
        duration_unit: originalEssentialInfoData.duration_unit || "day",
        area_sqm: originalEssentialInfoData.area_sqm || 0,
        description: originalEssentialInfoData.description || "",
      };

      form.reset(formData);
    }
  }, [originalEssentialInfoData, form, create]);

  const onSubmit = async (data: z.infer<typeof ProjectEssentialInfoSchema>) => {
    try {
      const result = await submitEssentialInfo(data);
      if (!result.success) {
        toast.error(result.message || t("project.step1.error.generic"));
      } else {
        toast.success(result.message || t("project.step1.success"));
      }
    } catch (error) {
      toast.error(t("project.step1.error.unexpected"));
    }
  };

  const onValidationError = (errors: Record<string, unknown>) => {
    // Validation errors handled by form
  };

  return (
    <div className="w-full flex flex-col gap-8 ">
      <div className="flex gap-2 text-base lg:text-lg font-bold">
        <span className="text-design-main">01 -</span>
        <h1>{t("project.step1.title")}</h1>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onValidationError)}
              className="form-section"
            >
              <div className="grid grid-cols-1 items-start md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="form-item-vertical">
                      <FormLabel>{t("project.step1.name")} *</FormLabel>
                      <FormControl>
                        <Input className="" {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage className="form-message-min-height" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="project_type_id"
                  render={({ field }) => (
                    <FormItem className="form-item-vertical">
                      <FormLabel>{t("project.step1.type") + " *"}</FormLabel>
                      <FormControl className="w-full">
                        <ProjectType
                          value={field.value}
                          onSelect={(value) => {
                            field.onChange(value);
                          }}
                          placeholder={
                            t("project.step1.typePlaceholder") ||
                            "Select project type"
                          }
                        />
                      </FormControl>
                      <FormMessage className="form-message-min-height" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 items-start md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="city_id"
                  render={({ field }) => (
                    <FormItem className="form-item-vertical">
                      <FormControl>
                        <CitySelection
                          hasIcon={false}
                          selectedCity={field.value}
                          onCityChange={field.onChange}
                          enableSearch={true}
                          placeholder={
                            t("project.step1.cityPlaceholder") ||
                            "Select a city"
                          }
                          label={t("project.step1.city") + " *"}
                          onBlur={() => field.onBlur()}
                        />
                      </FormControl>
                      <FormMessage className="form-message-min-height" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem className="form-item-vertical">
                      <FormLabel>
                        {t("project.step1.district") + " *"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} disabled={isLoading} />
                      </FormControl>
                      <FormMessage className="form-message-min-height" />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address_line"
                render={({ field }) => (
                  <FormItem className="form-item-vertical">
                    <FormLabel>{t("project.step1.address_line")} *</FormLabel>
                    <FormControl>
                      <LocationInput
                        value={field.value}
                        onChange={field.onChange}
                        onCoordinatesChange={(lat, lng) => {
                          form.setValue("latitude", lat);
                          form.setValue("longitude", lng);
                        }}
                        disabled={isLoading}
                        placeholder={
                          t("project.step1.address_linePlaceholder") ||
                          "Enter project address"
                        }
                      />
                    </FormControl>
                    <FormMessage className="form-message-min-height" />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 items-start md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="budget_min"
                  render={({ field: budgetField }) => (
                    <FormItem className="form-item-vertical">
                      <FormLabel>
                        {t("project.step1.budget_min") + " *"}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="numeric"
                            className="pe-20"
                            value={
                              budgetField.value
                                ? formatNumberWithCommas(budgetField.value)
                                : ""
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              const numericValue =
                                val === "" ? 0 : parseFormattedNumber(val);
                              budgetField.onChange(numericValue);
                            }}
                            disabled={isLoading}
                          />
                          <FormField
                            control={form.control}
                            name="budget_unit"
                            render={({ field: unitField }) => (
                              <Select
                                value={unitField.value}
                                onValueChange={unitField.onChange}
                              >
                                <SelectTrigger className="absolute end-0 top-0 bottom-0 my-auto !h-10 w-[80px] border-0 bg-transparent shadow-none rounded-none px-3">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SAR">SAR</SelectItem>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                  <SelectItem value="GBP">GBP</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="form-message-min-height" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budget_max"
                  render={({ field: budgetField }) => (
                    <FormItem className="form-item-vertical">
                      <FormLabel>
                        {t("project.step1.budget_max") + " *"}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="numeric"
                            className="pe-20"
                            value={
                              budgetField.value
                                ? formatNumberWithCommas(budgetField.value)
                                : ""
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              const numericValue =
                                val === "" ? 0 : parseFormattedNumber(val);
                              budgetField.onChange(numericValue);
                            }}
                            disabled={isLoading}
                          />
                          <FormField
                            control={form.control}
                            name="budget_unit"
                            render={({ field: unitField }) => (
                              <Select
                                value={unitField.value}
                                onValueChange={unitField.onChange}
                              >
                                <SelectTrigger className="absolute end-0 top-0 bottom-0 my-auto !h-10 w-[80px] border-0 bg-transparent shadow-none rounded-none px-3">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="SAR">SAR</SelectItem>
                                  <SelectItem value="USD">USD</SelectItem>
                                  <SelectItem value="EUR">EUR</SelectItem>
                                  <SelectItem value="GBP">GBP</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="form-message-min-height" />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 items-start md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="duration_value"
                  render={({ field: durationField }) => (
                    <FormItem className="form-item-vertical">
                      <FormLabel>
                        {t("project.step1.duration") + " *"}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type="text"
                            inputMode="numeric"
                            className="pe-24"
                            value={
                              durationField.value
                                ? formatNumberWithCommas(durationField.value)
                                : ""
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              const numericValue =
                                val === "" ? 0 : parseFormattedNumber(val);
                              durationField.onChange(numericValue);
                            }}
                            disabled={isLoading}
                          />
                          <FormField
                            control={form.control}
                            name="duration_unit"
                            render={({ field: unitField }) => (
                              <DurationSelect
                                value={unitField.value}
                                onSelect={unitField.onChange}
                                triggerClassName="absolute end-0 top-0 bottom-0 my-auto !h-10 w-[100px] border-0 bg-transparent shadow-none rounded-none px-3"
                              />
                            )}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="form-message-min-height" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="area_sqm"
                  render={({ field }) => (
                    <FormItem className="form-item-vertical">
                      <FormLabel>{t("project.step1.area_sqm")} *</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            dir="ltr"
                            type="text"
                            inputMode="numeric"
                            className="pe-10"
                            value={
                              field.value
                                ? formatNumberWithCommas(field.value)
                                : ""
                            }
                            onChange={(e) => {
                              const val = e.target.value;
                              const numericValue =
                                val === "" ? 0 : parseFormattedNumber(val);
                              field.onChange(numericValue);
                            }}
                            disabled={isLoading}
                          />
                          <div className="absolute end-0 text-design-main top-0 bottom-0 my-auto p-2 px-4 flex items-center gap-2">
                            <span>{t("project.step1.area_unit")}</span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage className="form-message-min-height" />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="form-item-vertical">
                    <FormLabel>{t("project.step1.description")} *</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage className="form-message-min-height" />
                  </FormItem>
                )}
              />
              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <NavigationButtons
                onSubmit={() =>
                  form.handleSubmit(onSubmit, onValidationError)()
                }
                isLoading={isLoading}
              />
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default EssentialInfoForm;
