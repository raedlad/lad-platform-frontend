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
import { FreelanceEngineerProfessionalInfoSchema } from "@auth/utils/validation";
import { FreelanceEngineerProfessionalInfo } from "@auth/types/freelanceEngineer";
import { ArrowLeft } from "lucide-react";
import {
  REGISTRATION_STEPS,
  STEP_CONFIG,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  ENGINEERING_SPECIALIZATIONS,
  YEARS_OF_EXPERIENCE_OPTIONS,
  YEARS_OF_EXPERIENCE_LABELS,
  TYPES_OF_EXPERIENCE_OPTIONS,
  WORK_LOCATIONS,
} from "@auth/constants/freelanceEngineerRegistration";
import { useFreelanceEngineerRegistrationStore } from "@auth/store/freelanceEngineerRegistrationStore";
import { useFreelanceEngineerRegistration } from "@auth/hooks/useFreelanceEngineerRegistration";

const FreelanceEngineerProfessionalInfoForm: React.FC = () => {
  const store = useFreelanceEngineerRegistrationStore();
  const { handleProfessionalInfoSubmit, goToPreviousStep } =
    useFreelanceEngineerRegistration();

  const isLoading = store.isLoading;
  const onSubmit = handleProfessionalInfoSubmit;
  const onBack = goToPreviousStep;

  const form = useForm<FreelanceEngineerProfessionalInfo>({
    resolver: zodResolver(FreelanceEngineerProfessionalInfoSchema),
    defaultValues: {
      engineeringSpecialization: [],
      yearsOfExperience: undefined,
      typesOfExperience: [],
      workLocations: [],
      currentOfficeAffiliation: false,
      officeName: "",
    },
  });

  const handleSubmit = async (values: FreelanceEngineerProfessionalInfo) => {
    console.log("Form values before submit:", values);
    const result = await onSubmit(values);

    if (!result.success) {
      console.log("Form submission failed:", result.error);
    }
  };

  const getStepNumber = () => STEP_CONFIG.professionalInfo.stepNumber;

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
            {STEP_CONFIG.professionalInfo.title}
          </CardTitle>
          <CardDescription>
            {STEP_CONFIG.professionalInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                console.log("❌ Validation errors:", errors);
              })}
              className="space-y-4"
            >
              {/* Engineering Specialization */}
              <FormField
                control={form.control}
                name="engineeringSpecialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {FORM_LABELS.engineeringSpecialization}
                    </FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-2">
                        {ENGINEERING_SPECIALIZATIONS.map((spec) => (
                          <FormField
                            key={spec}
                            control={form.control}
                            name="engineeringSpecialization"
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

              {/* Types of Experience */}
              <FormField
                control={form.control}
                name="typesOfExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.typesOfExperience}</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-2">
                        {TYPES_OF_EXPERIENCE_OPTIONS.map((type) => (
                          <FormField
                            key={type}
                            control={form.control}
                            name="typesOfExperience"
                            render={({ field: innerField }) => {
                              return (
                                <FormItem
                                  key={type}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={innerField.value?.includes(type)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? innerField.onChange([
                                              ...(innerField.value || []),
                                              type,
                                            ])
                                          : innerField.onChange(
                                              innerField.value?.filter(
                                                (value) => value !== type
                                              )
                                            );
                                      }}
                                      disabled={isLoading}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {type}
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

              {/* Work Locations */}
              <FormField
                control={form.control}
                name="workLocations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.workLocations}</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-2">
                        {WORK_LOCATIONS.map((location) => (
                          <FormField
                            key={location}
                            control={form.control}
                            name="workLocations"
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

              {/* Current Office Affiliation */}
              <FormField
                control={form.control}
                name="currentOfficeAffiliation"
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
                        {FORM_LABELS.currentOfficeAffiliation}
                      </FormLabel>
                      <FormDescription>
                        {FORM_PLACEHOLDERS.currentOfficeAffiliation}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("currentOfficeAffiliation") && (
                <FormField
                  control={form.control}
                  name="officeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FORM_LABELS.officeName}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={FORM_PLACEHOLDERS.officeName}
                          {...field}
                          disabled={isLoading}
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

export default FreelanceEngineerProfessionalInfoForm;
