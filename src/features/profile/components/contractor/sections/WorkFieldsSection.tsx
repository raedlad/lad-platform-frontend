"use client";

import React from "react";
import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Briefcase, Award, Plus, Trash2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { FormField, FormItem, FormMessage } from "@/shared/components/ui/form";

import { ContractorOperationalFormData } from "../../../utils/validation";
import { OperationalData } from "../../../store/operationalStore";

interface WorkFieldsSectionProps {
  control: Control<ContractorOperationalFormData>;
  operationalData: OperationalData;
  workFields: Array<{
    work_field_id: number;
    years_of_experience_in_field: number;
  }>;
  setWorkFields: (
    fields: Array<{
      work_field_id: number;
      years_of_experience_in_field: number;
    }>
  ) => void;
  validationErrors: Record<string, string>;
  setValidationErrors: (errors: Record<string, string>) => void;
  clearFormErrors: (fieldName: keyof ContractorOperationalFormData) => void;
  isLoading: boolean;
}

function WorkFieldsSection({
  control,
  operationalData,
  workFields,
  setWorkFields,
  validationErrors,
  setValidationErrors,
  clearFormErrors,
  isLoading,
}: WorkFieldsSectionProps) {
  const tContractor = useTranslations("profile.contractorOperational");

  const addWorkField = () => {
    setWorkFields([
      ...workFields,
      { work_field_id: 0, years_of_experience_in_field: 0 },
    ]);
    clearValidationErrors();
  };

  const removeWorkField = (index: number) => {
    setWorkFields(workFields.filter((_, i) => i !== index));
  };

  const clearValidationErrors = () => {
    const clearedErrors = { ...validationErrors };
    // Clear all work field related errors
    Object.keys(clearedErrors).forEach((key) => {
      if (key.startsWith("work_fields")) {
        delete clearedErrors[key];
      }
    });
    // Also clear the main work_fields error
    if (clearedErrors.work_fields) {
      delete clearedErrors.work_fields;
    }
    setValidationErrors(clearedErrors);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      <div className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-design-main/10 rounded-lg flex-shrink-0">
            <Briefcase className="h-5 w-5 text-design-main" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              {tContractor("sections.workFields.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {tContractor("sections.workFields.description")}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <FormField
          control={control}
          name="work_fields"
          render={() => (
            <FormItem>
              <FormMessage className="text-xs text-destructive" />
            </FormItem>
          )}
        />

        {workFields.map((workField, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-end gap-4 p-4 border border-border rounded-lg"
          >
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-design-main flex-shrink-0" />
                  <span className="truncate">
                    {tContractor("sections.workFields.workField")}
                  </span>
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

                    // Clear validation errors immediately
                    const newErrors = { ...validationErrors };
                    if (newErrors[`work_fields.${index}.work_field_id`]) {
                      delete newErrors[`work_fields.${index}.work_field_id`];
                    }
                    // If we now have valid fields, clear the array error
                    const hasValidFields = updated.some(
                      (field) => field.work_field_id > 0
                    );
                    if (hasValidFields && newErrors.work_fields) {
                      delete newErrors.work_fields;
                      clearFormErrors("work_fields");
                    }
                    setValidationErrors(newErrors);
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg">
                    <SelectValue
                      placeholder={tContractor("placeholders.selectWorkField")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {operationalData.work_fields.map((field) => (
                      <SelectItem key={field.id} value={field.id.toString()}>
                        {field.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors[`work_fields.${index}.work_field_id`] && (
                  <p className="text-xs text-destructive">
                    {validationErrors[`work_fields.${index}.work_field_id`]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-design-main flex-shrink-0" />
                  <span className="truncate">
                    {tContractor("sections.workFields.yearsOfExperience")}
                  </span>
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

                    // Clear validation error for this field
                    if (
                      validationErrors[
                        `work_fields.${index}.years_of_experience_in_field`
                      ]
                    ) {
                      const newErrors = { ...validationErrors };
                      delete newErrors[
                        `work_fields.${index}.years_of_experience_in_field`
                      ];
                      setValidationErrors(newErrors);
                    }
                  }}
                  disabled={isLoading}
                  className="h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg"
                />
                {validationErrors[
                  `work_fields.${index}.years_of_experience_in_field`
                ] && (
                  <p className="text-xs text-destructive">
                    {
                      validationErrors[
                        `work_fields.${index}.years_of_experience_in_field`
                      ]
                    }
                  </p>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => removeWorkField(index)}
              className="border-destructive/20 text-destructive hover:bg-destructive/10 w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addWorkField}
          className="w-full h-11 border-border text-foreground hover:bg-muted font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          {tContractor("sections.workFields.addWorkField")}
        </Button>
      </div>
    </div>
  );
}

export { WorkFieldsSection };
