"use client";
import React, { useCallback, useEffect } from "react";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@shared/components/ui/form";
import { Input } from "@shared/components/ui/input";
import { Button } from "@shared/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { createProjectValidationSchemas } from "@/features/project/utils/validation";
import { useProjectStore } from "@/features/project/store/projectStore";
import { useCreateProject } from "@/features/project/hooks/useCreateProject";
import { useProjectData } from "@/features/project/hooks/useProjectData";
import ProjectType from "../../common/ProjectType";
import CitySelect from "../../common/CitySelect";
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

const EssentialInfoForm = () => {
  const t = useTranslations("");
  const { ProjectEssentialInfoSchema } = createProjectValidationSchemas(t);
  const { originalEssentialInfoData, projectId } = useProjectStore();
  const { error, submitEssentialInfo } = useCreateProject();
  const { isLoading } = useProjectData();
  const form = useForm<z.infer<typeof ProjectEssentialInfoSchema>>({
    resolver: zodResolver(ProjectEssentialInfoSchema),
    defaultValues: {
      name: originalEssentialInfoData?.name || "",
      type: originalEssentialInfoData?.type?.[0]?.id || 0,
      city: originalEssentialInfoData?.city || "",
      district: originalEssentialInfoData?.district || "",
      location: originalEssentialInfoData?.location || "",
      budget: originalEssentialInfoData?.budget || 0,
      budget_unit: originalEssentialInfoData?.budget_unit || "SAR",
      duration: originalEssentialInfoData?.duration || 0,
      duration_unit: originalEssentialInfoData?.duration_unit || "day",
      area_sqm: originalEssentialInfoData?.area_sqm || 0,
      description: originalEssentialInfoData?.description || "",
    },
  });

  // Data loading is now handled automatically by useProjectData hook

  useEffect(() => {
    if (originalEssentialInfoData) {
      console.log(
        "🔄 Resetting EssentialInfoForm with data:",
        originalEssentialInfoData
      );
      form.reset({
        name: originalEssentialInfoData.name || "",
        type: originalEssentialInfoData.type?.[0]?.id || 0,
        city: originalEssentialInfoData.city || "",
        district: originalEssentialInfoData.district || "",
        location: originalEssentialInfoData.location || "",
        budget: originalEssentialInfoData.budget || 0,
        budget_unit: originalEssentialInfoData.budget_unit || "SAR",
        duration: originalEssentialInfoData.duration || 0,
        duration_unit: originalEssentialInfoData.duration_unit || "day",
        area_sqm: originalEssentialInfoData.area_sqm || 0,
        description: originalEssentialInfoData.description || "",
      });
    }
  }, [originalEssentialInfoData, form]);

  const onSubmit = async (data: z.infer<typeof ProjectEssentialInfoSchema>) => {
    console.log("🚀 Submitting essential info:", data);
    const result = await submitEssentialInfo(data);
    if (!result.success) {
      console.error("❌ Submission failed:", result.message);
    } else {
      console.log("✅ Submission successful:", result.message);
    }
  };

  const onValidationError = (errors: any) => {
    console.log("❌ Validation errors:", errors);
  };

  return (
    <div className="w-full flex flex-col gap-8 ">
      <div className="flex gap-2 text-lg font-bold">
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
                  name="name"
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
                  name="type"
                  render={({ field }) => (
                    <FormItem className="form-item-vertical">
                      <FormLabel>{t("project.step1.type") + " *"}</FormLabel>
                      <FormControl className="w-full">
                        <ProjectType
                          className="!"
                          value={field.value}
                          onSelect={(value) => {
                            field.onChange(value);
                          }}
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
                  name="city"
                  render={({ field }) => (
                    <FormItem className="form-item-vertical">
                      <FormControl>
                        <CitySelect
                          className="!"
                          selectedCountry="SA"
                          selectedState="3500"
                          selectedCity={field.value}
                          onCityChange={field.onChange}
                          enableSearch={true}
                          placeholder={
                            t("project.step1.cityPlaceholder") ||
                            "Select a city"
                          }
                          label={t("project.step1.city") + " *"}
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
                name="location"
                render={({ field }) => (
                  <FormItem className="form-item-vertical">
                    <FormLabel>{t("project.step1.location")} *</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage className="form-message-min-height" />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 items-start md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="budget"
                  render={({ field: budgetField }) => (
                    <FormItem className="form-item-vertical">
                      <FormLabel>{t("project.step1.budget") + " *"}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            dir="ltr"
                            type="number"
                            min={1}
                            inputMode="numeric"
                            className="pe-18"
                            value={budgetField.value || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              budgetField.onChange(
                                val === "" ? 0 : Number(val)
                              );
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
                  name="duration"
                  render={({ field: durationField }) => (
                    <FormItem className="form-item-vertical">
                      <FormLabel>
                        {t("project.step1.duration") + " *"}
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            dir="ltr"
                            type="number"
                            min={1}
                            inputMode="numeric"
                            className="pe-24"
                            value={durationField.value || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              durationField.onChange(
                                val === "" ? 0 : Number(val)
                              );
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
              </div>
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
                          type="number"
                          min={1}
                          inputMode="numeric"
                          className="pe-10"
                          value={field.value || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? 0 : Number(val));
                          }}
                          disabled={isLoading}
                        />
                        <div className="absolute end-0 text-design-main top-0 bottom-0 my-auto p-2 px-4 flex items-center gap-2">
                          <span>m²</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage className="form-message-min-height" />
                  </FormItem>
                )}
              />
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
