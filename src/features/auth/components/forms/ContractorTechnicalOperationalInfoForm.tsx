"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@shared/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@shared/components/ui/form";
import { Checkbox } from "@shared/components/ui/checkbox";
import { Input } from "@shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/components/ui/select";
import { ContractorTechnicalOperationalInfoSchema } from "@auth/utils/validation";
import { ContractorTechnicalOperationalInfo } from "@auth/types/contractor";
import { ArrowLeft } from "lucide-react";
import {
  REGISTRATION_STEPS,
  STEP_CONFIG,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  PROJECT_SIZE_COMPLETED_OPTIONS,
  TARGET_PROJECT_SIZE_OPTIONS,
  TOTAL_EMPLOYEES_OPTIONS,
  CONTRACTOR_CLASSIFICATION_OPTIONS,
  WORK_FIELDS_OPTIONS,
  GEOGRAPHIC_SPREAD_OPTIONS,
  YEARS_OF_EXPERIENCE_OPTIONS,
  ANNUAL_PROJECT_VOLUME_OPTIONS,
  FILE_UPLOAD_MESSAGES,
} from "@auth/constants/contractorRegistration";
import { FileUpload } from "@/features/auth/components/common/FileUpload";
import { useContractorRegistrationStore } from "@auth/store/contractorRegistrationStore";
import { useContractorRegistration } from "@auth/hooks/useContractorRegistration";

const ContractorTechnicalOperationalInfoForm: React.FC = () => {
  const store = useContractorRegistrationStore();
  const { handleTechnicalOperationalInfoSubmit, goToPreviousStep } =
    useContractorRegistration();

  const isLoading = store.isLoading;
  const onSubmit = handleTechnicalOperationalInfoSubmit;
  const onBack = goToPreviousStep;

  const form = useForm<ContractorTechnicalOperationalInfo>({
    resolver: zodResolver(ContractorTechnicalOperationalInfoSchema),
    defaultValues: {
      projectSizeCompleted: undefined,
      targetProjectSize: [],
      totalEmployees: undefined,
      governmentAccreditations: false,
      contractorClassification: undefined,
      classificationFile: undefined,
      workFields: [],
      geographicSpread: [],
      yearsOfExperience: undefined,
      annualProjectVolume: undefined,
    },
  });

  const handleSubmit = async (values: ContractorTechnicalOperationalInfo) => {
    console.log("Form values before submit:", values);
    const result = await onSubmit(values);

    if (!result.success) {
      console.log("Form submission failed:", result.error);
    }
  };

  const getStepNumber = () => STEP_CONFIG.technicalOperationalInfo.stepNumber;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-transparent shadow-none border-none">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-1"
              disabled={isLoading}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm text-muted-foreground">
              Step {getStepNumber()} of {REGISTRATION_STEPS.length}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {STEP_CONFIG.technicalOperationalInfo.title}
          </CardTitle>
          <CardDescription>
            {STEP_CONFIG.technicalOperationalInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Project Size Completed */}
              <FormField
                control={form.control}
                name="projectSizeCompleted"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.projectSizeCompleted}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={FORM_PLACEHOLDERS.projectSizeCompleted}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROJECT_SIZE_COMPLETED_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Target Project Size */}
              <FormField
                control={form.control}
                name="targetProjectSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.targetProjectSize}</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-2">
                        {TARGET_PROJECT_SIZE_OPTIONS.map((size) => (
                          <FormField
                            key={size}
                            control={form.control}
                            name="targetProjectSize"
                            render={({ field: innerField }) => {
                              return (
                                <FormItem
                                  key={size}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={innerField.value?.includes(size)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? innerField.onChange([
                                              ...(innerField.value || []),
                                              size,
                                            ])
                                          : innerField.onChange(
                                              innerField.value?.filter(
                                                (value) => value !== size
                                              )
                                            );
                                      }}
                                      disabled={isLoading}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {size}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Total Employees */}
              <FormField
                control={form.control}
                name="totalEmployees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.totalEmployees}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={FORM_PLACEHOLDERS.totalEmployees}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TOTAL_EMPLOYEES_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Government Accreditations */}
              <FormField
                control={form.control}
                name="governmentAccreditations"
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
                        {FORM_LABELS.governmentAccreditations}
                      </FormLabel>
                      <FormDescription>
                        {FORM_PLACEHOLDERS.governmentAccreditations}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {/* Contractor Classification */}
              <FormField
                control={form.control}
                name="contractorClassification"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {FORM_LABELS.contractorClassification}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              FORM_PLACEHOLDERS.contractorClassification
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONTRACTOR_CLASSIFICATION_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("contractorClassification") ===
                "Classification file upload if applicable" && (
                <FormField
                  control={form.control}
                  name="classificationFile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FORM_LABELS.classificationFile}</FormLabel>
                      <FormControl>
                        <FileUpload
                          accept={[
                            "application/pdf",
                            "image/jpeg",
                            "image/png",
                          ]}
                          maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                          onChange={(file) => field.onChange(file as File | null)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Work Fields */}
              <FormField
                control={form.control}
                name="workFields"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.workFields}</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-2">
                        {WORK_FIELDS_OPTIONS.map((fieldOption) => (
                          <FormField
                            key={fieldOption}
                            control={form.control}
                            name="workFields"
                            render={({ field: innerField }) => {
                              return (
                                <FormItem
                                  key={fieldOption}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={innerField.value?.includes(
                                        fieldOption
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? innerField.onChange([
                                              ...(innerField.value || []),
                                              fieldOption,
                                            ])
                                          : innerField.onChange(
                                              innerField.value?.filter(
                                                (value) => value !== fieldOption
                                              )
                                            );
                                      }}
                                      disabled={isLoading}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {fieldOption}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Geographic Spread */}
              <FormField
                control={form.control}
                name="geographicSpread"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.geographicSpread}</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-2">
                        {GEOGRAPHIC_SPREAD_OPTIONS.map((location) => (
                          <FormField
                            key={location}
                            control={form.control}
                            name="geographicSpread"
                            render={({ field: innerField }) => {
                              return (
                                <FormItem
                                  key={location}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={innerField.value?.includes(
                                        location
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? innerField.onChange([
                                              ...(innerField.value || []),
                                              location,
                                            ])
                                          : innerField.onChange(
                                              innerField.value?.filter(
                                                (value) => value !== location
                                              )
                                            );
                                      }}
                                      disabled={isLoading}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {location}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Years of Experience */}
              <FormField
                control={form.control}
                name="yearsOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.yearsOfExperience}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={FORM_PLACEHOLDERS.yearsOfExperience}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {YEARS_OF_EXPERIENCE_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Annual Project Volume */}
              <FormField
                control={form.control}
                name="annualProjectVolume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.annualProjectVolume}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={FORM_PLACEHOLDERS.annualProjectVolume}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ANNUAL_PROJECT_VOLUME_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Continue"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractorTechnicalOperationalInfoForm;
