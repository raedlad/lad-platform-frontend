"use client";

import React from "react";
import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Building, Users, Award, Briefcase, FileText } from "lucide-react";

import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";

import { ContractorOperationalFormData } from "../../../utils/validation";
import { OperationalData } from "../../../store/operationalStore";

interface ProjectInformationSectionProps {
  control: Control<ContractorOperationalFormData>;
  operationalData: OperationalData;
  isLoading: boolean;
}

function ProjectInformationSection({
  control,
  operationalData,
  isLoading,
}: ProjectInformationSectionProps) {
  const tContractor = useTranslations("profile.contractorOperational");

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      <div className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-design-main/10 rounded-lg flex-shrink-0">
            <Building className="h-5 w-5 text-design-main" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              {tContractor("sections.projectInfo.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {tContractor("sections.projectInfo.description")}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <FormField
            control={control}
            name="executed_project_range_id"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Building className="h-4 w-4 text-design-main flex-shrink-0" />
                  <span className="truncate">
                    {tContractor("sections.projectInfo.executedProjectRange")}
                  </span>
                  <span className="text-destructive">*</span>
                </FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={
                    field.value && field.value > 0 ? field.value.toString() : ""
                  }
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg">
                      <SelectValue
                        placeholder={tContractor(
                          "placeholders.selectExecutedProjectRange"
                        )}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {operationalData.executed_project_value_ranges.map(
                      (range) => (
                        <SelectItem key={range.id} value={range.id.toString()}>
                          {range.label}
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
            name="staff_size_range_id"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-design-main flex-shrink-0" />
                  <span className="truncate">
                    {tContractor("sections.projectInfo.staffSizeRange")}
                  </span>
                  <span className="text-destructive">*</span>
                </FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={
                    field.value && field.value > 0 ? field.value.toString() : ""
                  }
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg">
                      <SelectValue
                        placeholder={tContractor(
                          "placeholders.selectStaffSizeRange"
                        )}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {operationalData.staff_size_ranges.map((range) => (
                      <SelectItem key={range.id} value={range.id.toString()}>
                        {range.label}
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
            name="experience_years_range_id"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-design-main flex-shrink-0" />
                  <span className="truncate">
                    {tContractor("sections.projectInfo.experienceYearsRange")}
                  </span>
                  <span className="text-destructive">*</span>
                </FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={
                    field.value && field.value > 0 ? field.value.toString() : ""
                  }
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg">
                      <SelectValue
                        placeholder={tContractor(
                          "placeholders.selectExperienceYearsRange"
                        )}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {operationalData.experience_years_ranges.map((range) => (
                      <SelectItem key={range.id} value={range.id.toString()}>
                        {range.label}
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
            name="annual_projects_range_id"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-design-main flex-shrink-0" />
                  <span className="truncate">
                    {tContractor("sections.projectInfo.annualProjectsRange")}
                  </span>
                  <span className="text-destructive">*</span>
                </FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={
                    field.value && field.value > 0 ? field.value.toString() : ""
                  }
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg">
                      <SelectValue
                        placeholder={tContractor(
                          "placeholders.selectAnnualProjectsRange"
                        )}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {operationalData.annual_projects_ranges.map((range) => (
                      <SelectItem key={range.id} value={range.id.toString()}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={control}
          name="target_project_value_range_ids"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-design-main flex-shrink-0" />
                <span className="truncate">
                  {tContractor("sections.projectInfo.targetProjectRanges")}
                </span>
              </FormLabel>
              <FormDescription className="text-sm text-muted-foreground">
                {tContractor(
                  "sections.projectInfo.targetProjectRangesDescription"
                )}
              </FormDescription>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {operationalData.target_project_value_ranges.map((range) => (
                  <div
                    key={range.id}
                    className="flex items-center space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={`target-${range.id}`}
                      checked={field.value?.includes(range.id) || false}
                      onCheckedChange={(checked) => {
                        const currentValues = field.value || [];
                        if (checked) {
                          field.onChange([...currentValues, range.id]);
                        } else {
                          field.onChange(
                            currentValues.filter((id) => id !== range.id)
                          );
                        }
                      }}
                      disabled={isLoading}
                      className="border-border"
                    />
                    <Label
                      htmlFor={`target-${range.id}`}
                      className="text-sm font-medium text-foreground cursor-pointer"
                    >
                      {range.label}
                    </Label>
                  </div>
                ))}
              </div>
              <FormMessage className="text-xs text-red-600" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}

export { ProjectInformationSection };
