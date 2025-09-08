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

import { PhoneInput } from "@auth/components/phone-input/PhoneInput";
import { Checkbox } from "@shared/components/ui/checkbox";
import { createProjectValidationSchemas } from "@/features/project/utils/validation";
import { useProjectStore } from "@/features/project/store/projectStore";
import { projectApi } from "@/features/project/services/projectApi";
import ProjectType from "../../common/ProjectType";
import CitySelect from "../../common/CitySelect";
import { Select, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { SelectContent } from "@radix-ui/react-select";
import { SelectItem } from "@radix-ui/react-select";
import DurationSelect from "../../common/DurationSelect";

const EssentialInfoForm = () => {
  const t = useTranslations("");
  const { ProjectEssentialInfoSchema } = createProjectValidationSchemas(t);
  const {
    isLoading,
    error,
    clearError,
    setLoading,
    setProjectTypes,
    projectTypes,
  } = useProjectStore();
  const form = useForm<z.infer<typeof ProjectEssentialInfoSchema>>({
    resolver: zodResolver(ProjectEssentialInfoSchema),
    defaultValues: {
      name: "",
      type: 0,
      city: "",
      district: "",
      location: "",
      budget: 0,
      budget_unit: "",
      duration: 0,
      duration_unit: "",
      area_sqm: 0,
      description: "",
    },
  });

  const onSubmit = (data: z.infer<typeof ProjectEssentialInfoSchema>) => {
    console.log("❌ Data:", data);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              console.log("❌ Validation errors:", errors);
            })}
            className="form-section"
          >
            {/* First / Last Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="form-item-vertical">
                    <FormLabel>{t("project.name")}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
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
                    <FormLabel>{t("project.type")}</FormLabel>
                    <FormControl className="w-full">
                      <ProjectType
                        onSelect={(value) => {
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage className="form-message-min-height" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="form-item-vertical">
                    {/* <FormLabel>{t("project.type")}</FormLabel> */}
                    <FormControl>
                      <CitySelect
                        selectedCountry="SA"
                        selectedState="3500"
                        selectedCity={field.value}
                        onCityChange={field.onChange}
                        placeholder="Select a city..."
                        enableSearch={true}
                        label={t("project.city")}
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
                    <FormLabel>{t("project.name")}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage className="form-message-min-height" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="form-item-vertical">
                    <FormLabel>{t("project.location")}</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage className="form-message-min-height" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem className="form-item-vertical">
                    <FormLabel>{t("project.budget")}</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-2">
                      <Input {...field} disabled={isLoading} />
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                        }}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder="Select a budget" className='w-full'/>
                        </SelectTrigger>
                        <SelectContent className='w-full'>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="7">7</SelectItem>
                            <SelectItem value="8">8</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </FormControl>
                    <FormMessage className="form-message-min-height" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="form-item-vertical">
                    <FormLabel>{t("project.duration")}</FormLabel>
                    <FormControl>
                      <div className="flex justify-between gap-2"> 
                        <Input {...field} disabled={isLoading} />
                      <DurationSelect
                        onSelect={(value) => {
                            field.onChange(value);
                          }}
                        />
                      </div>
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

            {/* Submit */}
            <Button
              type="submit"
              className="btn-full-width"
              disabled={isLoading}
            >
              {isLoading ? t("actions.loading") : t("personalInfo.continue")}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EssentialInfoForm;
