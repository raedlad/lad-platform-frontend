"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
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
  operationalData: OperationalData;
  workFields: Array<{
    work_field_id: number;
    years_of_experience_in_field: number | null;
  }>;
  setWorkFields: (
    fields: Array<{
      work_field_id: number;
      years_of_experience_in_field: number | null;
    }>
  ) => void;
  isLoading: boolean;
}

function WorkFieldsSection({
  operationalData,
  workFields,
  setWorkFields,
  isLoading,
}: WorkFieldsSectionProps) {
  const tContractor = useTranslations("profile.contractorOperational");
  const { control, trigger } = useFormContext<ContractorOperationalFormData>();

  const addWorkField = () => {
    setWorkFields([
      ...workFields,
      { work_field_id: 0, years_of_experience_in_field: null },
    ]);
    // Trigger validation after adding
    setTimeout(() => trigger("work_fields"), 0);
  };

  const removeWorkField = (index: number) => {
    setWorkFields(workFields.filter((_, i) => i !== index));
    // Trigger validation after removing
    setTimeout(() => trigger("work_fields"), 0);
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
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-foreground">
            {tContractor("sections.workFields.title")}
          </h4>
          <div className="text-sm text-muted-foreground">
            {workFields.length}{" "}
            {workFields.length === 1 ? "work field" : "work fields"}
          </div>
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

        <div className="space-y-4">
          {workFields.map((workField, index) => (
            <div
              key={index}
              className="group relative bg-muted/30 border border-border rounded-lg p-5 hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 space-y-4">
                  <FormField
                    control={control}
                    name={`work_fields.${index}.work_field_id`}
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                          <Briefcase className="h-4 w-4 text-design-main flex-shrink-0" />
                          <span className="truncate">
                            {tContractor("sections.workFields.workField")}
                          </span>
                        </Label>
                        <Select
                          value={field.value > 0 ? field.value.toString() : ""}
                          onValueChange={(value) => {
                            const updated = [...workFields];
                            updated[index].work_field_id = parseInt(value);
                            setWorkFields(updated);
                            field.onChange(parseInt(value));
                            // Trigger validation for the work fields
                            setTimeout(() => trigger("work_fields"), 0);
                          }}
                          disabled={isLoading}
                        >
                          <SelectTrigger className="w-full h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg">
                            <SelectValue
                              placeholder={tContractor(
                                "placeholders.selectWorkField"
                              )}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {operationalData.work_fields.map((fieldOption) => (
                              <SelectItem
                                key={fieldOption.id}
                                value={fieldOption.id.toString()}
                              >
                                {fieldOption.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-xs text-destructive" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name={`work_fields.${index}.years_of_experience_in_field`}
                    render={({ field }) => (
                      <FormItem>
                        <Label className="text-sm font-medium text-foreground flex items-center gap-2 mb-2">
                          <Award className="h-4 w-4 text-design-main flex-shrink-0" />
                          <span className="truncate">
                            {tContractor(
                              "sections.workFields.yearsOfExperience"
                            )}
                          </span>
                        </Label>
                        <Input
                          type="number"
                          min="1"
                          max="100"
                          value={field.value || ""}
                          onChange={(e) => {
                            const updated = [...workFields];
                            const value = e.target.value;
                            const numValue =
                              value === "" ? null : parseInt(value) || null;
                            updated[index].years_of_experience_in_field =
                              numValue;
                            setWorkFields(updated);
                            field.onChange(numValue);
                            // Trigger validation for the work fields
                            setTimeout(() => trigger("work_fields"), 0);
                          }}
                          disabled={isLoading}
                          className="w-full h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg"
                        />
                        <FormMessage className="text-xs text-destructive" />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex items-center justify-end lg:justify-start">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeWorkField(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 h-9 w-9 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={addWorkField}
          className="w-full h-11 border-dashed border-2 border-border text-foreground hover:bg-muted hover:border-solid font-medium transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          {tContractor("sections.workFields.addWorkField")}
        </Button>
      </div>
    </div>
  );
}

export { WorkFieldsSection };
