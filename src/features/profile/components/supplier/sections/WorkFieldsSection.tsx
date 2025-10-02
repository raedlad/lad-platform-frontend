"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
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
import { FormField, FormItem, FormMessage } from "@/shared/components/ui/form";

import { WorkField as WorkFieldOption } from "@/features/profile/hooks/useWorkFields";

// Use the same WorkField type as the parent component
interface WorkField {
  work_field_id: string;
  field_specific_notes?: string;
}

interface WorkFieldsSectionProps {
  workFields: WorkField[];
  setWorkFields: (fields: WorkField[]) => void;
  availableWorkFields: WorkFieldOption[];
  isLoading: boolean;
}

export const SupplierWorkFieldsSection: React.FC<WorkFieldsSectionProps> = ({
  workFields,
  setWorkFields,
  availableWorkFields,
  isLoading,
}) => {
  const tSupplier = useTranslations("profile.supplier.professionalInfo");
  const { control, trigger } = useFormContext();

  const addWorkField = () => {
    const newWorkField: WorkField = {
      work_field_id: "",
      field_specific_notes: "",
    };
    setWorkFields([...workFields, newWorkField]);
    // Trigger validation after adding
    setTimeout(() => trigger("work_fields"), 0);
  };

  const removeWorkField = (index: number) => {
    setWorkFields(workFields.filter((_, i) => i !== index));
    // Trigger validation after removing
    setTimeout(() => trigger("work_fields"), 0);
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
    // Trigger validation after updating
    setTimeout(() => trigger("work_fields"), 0);
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

      <FormField
        control={control}
        name="work_fields"
        render={() => (
          <FormItem>
            <FormMessage className="text-xs text-destructive mb-4" />
          </FormItem>
        )}
      />

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
              <FormField
                control={control}
                name={`work_fields.${index}.work_field_id`}
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      {tSupplier("workFieldType")}
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Select
                      disabled={isLoading}
                      value={field.value || ""}
                      onValueChange={(value) => {
                        updateWorkField(index, "work_field_id", value);
                        field.onChange(value);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={tSupplier(
                            "placeholders.selectWorkField"
                          )}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {availableWorkFields.map(
                          (fieldOption: WorkFieldOption) => (
                            <SelectItem
                              key={fieldOption.id}
                              value={fieldOption.id.toString()}
                            >
                              {fieldOption.name_en || fieldOption.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`work_fields.${index}.field_specific_notes`}
                render={({ field }) => (
                  <FormItem>
                    <Label className="text-sm font-medium text-foreground mb-2 block">
                      {tSupplier("fieldSpecificNotes")}
                    </Label>
                    <Input
                      value={field.value || ""}
                      onChange={(e) => {
                        updateWorkField(
                          index,
                          "field_specific_notes",
                          e.target.value
                        );
                        field.onChange(e.target.value);
                      }}
                      disabled={isLoading}
                      placeholder={tSupplier("placeholders.enterFieldNotes")}
                    />
                    <FormMessage className="text-xs text-destructive" />
                  </FormItem>
                )}
              />
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
