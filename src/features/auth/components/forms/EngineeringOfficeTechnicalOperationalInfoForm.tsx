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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { EngineeringOfficeTechnicalOperationalInfoSchema } from "@auth/utils/validation";
import { EngineeringOfficeTechnicalOperationalInfo } from "@auth/types/engineeringOffice";
import { ArrowLeft } from "lucide-react";
import {
  REGISTRATION_STEPS,
  STEP_CONFIG,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  OFFICE_SPECIALIZATIONS,
  YEARS_OF_EXPERIENCE_OPTIONS,
  YEARS_OF_EXPERIENCE_LABELS,
  NUMBER_OF_EMPLOYEES_OPTIONS,
  NUMBER_OF_EMPLOYEES_LABELS,
  ANNUAL_PROJECT_VOLUME_OPTIONS,
  ANNUAL_PROJECT_VOLUME_LABELS,
  GEOGRAPHIC_COVERAGE_OPTIONS,
} from "@auth/constants/engineeringOfficeRegistration";
import { FileUpload } from "@/features/auth/components/common/FileUpload";
import { FILE_UPLOAD_MESSAGES } from "@auth/constants/engineeringOfficeRegistration";
import { useEngineeringOfficeRegistrationStore } from "@auth/store/engineeringOfficeRegistrationStore";
import { useEngineeringOfficeRegistration } from "@auth/hooks/useEngineeringOfficeRegistration";

const EngineeringOfficeTechnicalOperationalInfoForm: React.FC = () => {
  const store = useEngineeringOfficeRegistrationStore();
  const { handleTechnicalOperationalInfoSubmit, goToPreviousStep } =
    useEngineeringOfficeRegistration();

  const isLoading = store.isLoading;
  const onSubmit = handleTechnicalOperationalInfoSubmit;
  const onBack = goToPreviousStep;

  const form = useForm<EngineeringOfficeTechnicalOperationalInfo>({
    resolver: zodResolver(EngineeringOfficeTechnicalOperationalInfoSchema),
    defaultValues: {
      officeSpecializations: [],
      yearsOfExperience: undefined,
      numberOfEmployees: undefined,
      annualProjectVolume: undefined,
      geographicCoverage: [],
      officialAccreditations: false,
      accreditationDocument: undefined,
    },
  });

  const handleSubmit = async (
    values: EngineeringOfficeTechnicalOperationalInfo
  ) => {
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
              {/* Office Specializations */}
              <FormField
                control={form.control}
                name="officeSpecializations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.officeSpecializations}</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-2">
                        {OFFICE_SPECIALIZATIONS.map((spec) => (
                          <FormField
                            key={spec}
                            control={form.control}
                            name="officeSpecializations"
                            render={({ field: innerField }) => {
                              return (
                                <FormItem
                                  key={spec}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={innerField.value?.includes(spec)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? innerField.onChange([
                                              ...(innerField.value || []),
                                              spec,
                                            ])
                                          : innerField.onChange(
                                              innerField.value?.filter(
                                                (value) => value !== spec
                                              )
                                            );
                                      }}
                                      disabled={isLoading}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {spec}
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
                      value={field.value}
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
                            {YEARS_OF_EXPERIENCE_LABELS[option]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Number of Employees */}
              <FormField
                control={form.control}
                name="numberOfEmployees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.numberOfEmployees}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={FORM_PLACEHOLDERS.numberOfEmployees}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {NUMBER_OF_EMPLOYEES_OPTIONS.map((option) => (
                          <SelectItem key={option} value={option}>
                            {NUMBER_OF_EMPLOYEES_LABELS[option]}
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
                      value={field.value}
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
                            {ANNUAL_PROJECT_VOLUME_LABELS[option]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Geographic Coverage */}
              <FormField
                control={form.control}
                name="geographicCoverage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.geographicCoverage}</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-2">
                        {GEOGRAPHIC_COVERAGE_OPTIONS.map((location) => (
                          <FormField
                            key={location}
                            control={form.control}
                            name="geographicCoverage"
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

              {/* Official Accreditations */}
              <FormField
                control={form.control}
                name="officialAccreditations"
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
                        {FORM_LABELS.officialAccreditations}
                      </FormLabel>
                      <FormDescription>
                        {FORM_PLACEHOLDERS.officialAccreditations}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("officialAccreditations") && (
                <FormField
                  control={form.control}
                  name="accreditationDocument"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FORM_LABELS.accreditationDocument}</FormLabel>
                      <FormControl>
                        <FileUpload
                          accept={[
                            "application/pdf",
                            "image/jpeg",
                            "image/png",
                          ]}
                          maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                          onChange={(file) =>
                            field.onChange(file as File | null)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

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

export default EngineeringOfficeTechnicalOperationalInfoForm;
