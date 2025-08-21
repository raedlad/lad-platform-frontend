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
import { SupplierOperationalCommercialInfoSchema } from "@auth/utils/validation";
import { SupplierOperationalCommercialInfo } from "@auth/types/supplier";
import { ArrowLeft } from "lucide-react";
import {
  REGISTRATION_STEPS,
  STEP_CONFIG,
  FORM_LABELS,
  FORM_PLACEHOLDERS,
  SUPPLY_AREAS_OPTIONS,
  SERVICE_COVERAGE_OPTIONS,
  YEARS_OF_EXPERIENCE_OPTIONS,
  FILE_UPLOAD_MESSAGES,
} from "@auth/constants/supplierRegistration";
import { FileUpload } from "@/features/auth/components/common/FileUpload";
import { useSupplierRegistrationStore } from "@auth/store/supplierRegistrationStore";
import { useSupplierRegistration } from "@auth/hooks/useSupplierRegistration";

const SupplierOperationalCommercialInfoForm: React.FC = () => {
  const store = useSupplierRegistrationStore();
  const { handleOperationalCommercialInfoSubmit, goToPreviousStep } =
    useSupplierRegistration();

  const isLoading = store.isLoading;
  const onSubmit = handleOperationalCommercialInfoSubmit;
  const onBack = goToPreviousStep;

  const form = useForm<SupplierOperationalCommercialInfo>({
    resolver: zodResolver(SupplierOperationalCommercialInfoSchema),
    defaultValues: {
      supplyAreas: [],
      serviceCoverage: [],
      yearsOfExperience: undefined,
      governmentPrivateDealings: false,
      supportingDocuments: [],
    },
  });

  const handleSubmit = async (values: SupplierOperationalCommercialInfo) => {
    console.log("Form values before submit:", values);
    const result = await onSubmit(values);

    if (!result.success) {
      console.log("Form submission failed:", result.error);
    }
  };

  const getStepNumber = () => STEP_CONFIG.operationalCommercialInfo.stepNumber;

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
            {STEP_CONFIG.operationalCommercialInfo.title}
          </CardTitle>
          <CardDescription>
            {STEP_CONFIG.operationalCommercialInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {/* Supply Areas */}
              <FormField
                control={form.control}
                name="supplyAreas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.supplyAreas}</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-2">
                        {SUPPLY_AREAS_OPTIONS.map((area) => (
                          <FormField
                            key={area}
                            control={form.control}
                            name="supplyAreas"
                            render={({ field: innerField }) => {
                              return (
                                <FormItem
                                  key={area}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={innerField.value?.includes(area)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? innerField.onChange([
                                              ...(innerField.value || []),
                                              area,
                                            ])
                                          : innerField.onChange(
                                              innerField.value?.filter(
                                                (value) => value !== area
                                              )
                                            );
                                      }}
                                      disabled={isLoading}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {area}
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

              {/* Service Coverage */}
              <FormField
                control={form.control}
                name="serviceCoverage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{FORM_LABELS.serviceCoverage}</FormLabel>
                    <FormControl>
                      <div className="grid grid-cols-2 gap-2">
                        {SERVICE_COVERAGE_OPTIONS.map((coverage) => (
                          <FormField
                            key={coverage}
                            control={form.control}
                            name="serviceCoverage"
                            render={({ field: innerField }) => {
                              return (
                                <FormItem
                                  key={coverage}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={innerField.value?.includes(
                                        coverage
                                      )}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? innerField.onChange([
                                              ...(innerField.value || []),
                                              coverage,
                                            ])
                                          : innerField.onChange(
                                              innerField.value?.filter(
                                                (value) => value !== coverage
                                              )
                                            );
                                      }}
                                      disabled={isLoading}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {coverage}
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

              {/* Government/Private Dealings */}
              <FormField
                control={form.control}
                name="governmentPrivateDealings"
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
                        {FORM_LABELS.governmentPrivateDealings}
                      </FormLabel>
                      <FormDescription>
                        {FORM_PLACEHOLDERS.governmentPrivateDealings}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("governmentPrivateDealings") && (
                <FormField
                  control={form.control}
                  name="supportingDocuments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{FORM_LABELS.supportingDocuments}</FormLabel>
                      <FormControl>
                        <FileUpload
                          accept={[
                            "application/pdf",
                            "image/jpeg",
                            "image/png",
                          ]}
                          maxSizeMB={FILE_UPLOAD_MESSAGES.maxSizeMB}
                          onChange={(file) =>
                            field.onChange(
                              file
                                ? [...(field.value || []), file]
                                : field.value
                            )
                          }
                          multiple={true}
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

export default SupplierOperationalCommercialInfoForm;
