"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Briefcase, Plus, Trash2 } from "lucide-react";

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

import { WorkField as WorkFieldOption } from "@/features/profile/hooks/useWorkFields";

interface WorkField {
  work_field_id: number;
  field_specific_notes?: string;
  geographical_coverage?: Array<{
    country_code: string;
    state_id: string;
    city_id: string;
    covers_all_areas: boolean;
    specific_areas?: string[];
    priority?: "high" | "medium" | "low";
    notes?: string;
  }>;
}

interface WorkFieldsSectionProps {
  workFields: WorkField[];
  setWorkFields: (fields: WorkField[]) => void;
  availableWorkFields: WorkFieldOption[];
  validationErrors: Record<string, string>;
  setValidationErrors: (errors: Record<string, string>) => void;
  clearFormErrors: (fieldName: string) => void;
  isLoading: boolean;
}

export const SupplierWorkFieldsSection: React.FC<WorkFieldsSectionProps> = ({
  workFields,
  setWorkFields,
  availableWorkFields,
  validationErrors,
  setValidationErrors,
  clearFormErrors,
  isLoading,
}) => {
  const tSupplier = useTranslations("profile.supplier.professionalInfo");

  const addWorkField = () => {
    const newWorkField: WorkField = {
      work_field_id: 0,
      field_specific_notes: "",
      geographical_coverage: [],
    };
    setWorkFields([...workFields, newWorkField]);
  };

  const removeWorkField = (index: number) => {
    setWorkFields(workFields.filter((_, i) => i !== index));
  };

  const updateWorkField = (
    index: number,
    field: keyof WorkField,
    value: string | number | Array<any>
  ) => {
    const updatedFields = workFields.map((workField, i) =>
      i === index ? { ...workField, [field]: value } : workField
    );
    setWorkFields(updatedFields);

    // Clear validation error for this field
    clearFormErrors(`work_fields.${index}.${field}`);
  };

  const updateWorkFieldGeographicalCoverage = (
    workFieldIndex: number,
    geographicalCoverage: Array<{
      country_code: string;
      state_id: string;
      city_id: string;
      covers_all_areas: boolean;
      specific_areas?: string[];
      priority?: "high" | "medium" | "low";
      notes?: string;
    }>
  ) => {
    const updatedFields = workFields.map((workField, i) =>
      i === workFieldIndex
        ? { ...workField, geographical_coverage: geographicalCoverage }
        : workField
    );
    setWorkFields(updatedFields);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground dark:text-white">
          {tSupplier("workFields")}
          <span className="text-red-500 ml-1">*</span>
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addWorkField}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {tSupplier("addWorkField")}
        </Button>
      </div>

      {validationErrors.work_fields && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">
            {validationErrors.work_fields}
          </p>
        </div>
      )}

      <div className="space-y-6">
        {workFields.map((workField, index) => (
          <div key={index} className="p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-design-main" />
                <h4 className="text-sm font-medium text-foreground dark:text-white">
                  {tSupplier("workField")} {index + 1}
                </h4>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeWorkField(index)}
                disabled={isLoading}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-sm font-medium text-foreground mb-2 block">
                  {tSupplier("workFieldType")}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  disabled={isLoading}
                  value={workField.work_field_id.toString()}
                  onValueChange={(value) =>
                    updateWorkField(index, "work_field_id", parseInt(value))
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={tSupplier("placeholders.selectWorkField")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableWorkFields.map((field: WorkFieldOption) => (
                      <SelectItem key={field.id} value={field.id.toString()}>
                        {field.name_en || field.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {validationErrors[`work_fields.${index}.work_field_id`] && (
                  <p className="text-destructive text-xs mt-1">
                    {validationErrors[`work_fields.${index}.work_field_id`]}
                  </p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-foreground mb-2 block">
                  {tSupplier("fieldSpecificNotes")}
                </Label>
                <Input
                  value={workField.field_specific_notes || ""}
                  onChange={(e) =>
                    updateWorkField(
                      index,
                      "field_specific_notes",
                      e.target.value
                    )
                  }
                  disabled={isLoading}
                  placeholder={tSupplier("placeholders.enterFieldNotes")}
                />
                {validationErrors[
                  `work_fields.${index}.field_specific_notes`
                ] && (
                  <p className="text-destructive text-xs mt-1">
                    {
                      validationErrors[
                        `work_fields.${index}.field_specific_notes`
                      ]
                    }
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {workFields.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>{tSupplier("noWorkFields")}</p>
        </div>
      )}
    </div>
  );
};
