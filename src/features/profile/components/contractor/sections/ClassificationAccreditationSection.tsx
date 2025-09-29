"use client";

import React from "react";
import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Award, Upload, X } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
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
import { cn } from "@/lib/utils";

interface ClassificationAccreditationSectionProps {
  control: Control<ContractorOperationalFormData>;
  operationalData: OperationalData;
  isLoading: boolean;
}

function ClassificationAccreditationSection({
  control,
  operationalData,
  isLoading,
}: ClassificationAccreditationSectionProps) {
  const tContractor = useTranslations("profile.contractorOperational");

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      <div className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-design-main/10 rounded-lg flex-shrink-0">
            <Award className="h-5 w-5 text-design-main" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              {tContractor("sections.classification.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {tContractor("sections.classification.description")}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-start">
          <FormField
            control={control}
            name="classification_level_id"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-design-main flex-shrink-0" />
                  <span className="truncate">
                    {tContractor("sections.classification.classificationLevel")}
                  </span>
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    value={
                      field.value && field.value > 0
                        ? field.value.toString()
                        : ""
                    }
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="h-11 border-border focus:border-design-main focus:ring-design-main/20 rounded-lg">
                        <SelectValue
                          placeholder={tContractor(
                            "placeholders.selectClassificationLevel"
                          )}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {operationalData.classification_levels.map((level) => (
                        <SelectItem key={level.id} value={level.id.toString()}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-xs text-destructive" />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="classification_file"
            render={({ field, formState }) => {
              const form = formState as any; // Temporary fix for form access
              return (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-medium text-foreground flex items-center gap-2">
                    <Upload className="h-4 w-4 text-design-main flex-shrink-0" />
                    <span className="truncate">
                      {tContractor(
                        "sections.classification.classificationFile"
                      )}
                    </span>
                  </FormLabel>
                  <FormDescription className="text-sm text-muted-foreground">
                    {tContractor(
                      "sections.classification.classificationFileDescription"
                    )}
                  </FormDescription>
                  <FormControl>
                    <div className="space-y-2">
                      <div
                        className={cn(
                          "border-2 border-dashed rounded-lg p-4 transition-all cursor-pointer",
                          "hover:bg-muted/50 hover:border-muted-foreground/50",
                          field.value
                            ? "border-design-main"
                            : "border-muted-foreground/25",
                          isLoading && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={() => {
                          if (!isLoading) {
                            document
                              .getElementById("classification-file-upload")
                              ?.click();
                          }
                        }}
                      >
                        <input
                          id="classification-file-upload"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.webp"
                          className="hidden"
                          disabled={isLoading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              // Validate file size (8MB max)
                              if (file.size > 8 * 1024 * 1024) {
                                form.setError("classification_file", {
                                  message: tContractor(
                                    "fileUpload.fileSizeError"
                                  ),
                                });
                                return;
                              }
                              // Validate file type
                              const allowedTypes = [
                                "application/pdf",
                                "image/jpeg",
                                "image/jpg",
                                "image/png",
                                "image/webp",
                              ];
                              if (!allowedTypes.includes(file.type)) {
                                form.setError("classification_file", {
                                  message: tContractor(
                                    "fileUpload.fileTypeError"
                                  ),
                                });
                                return;
                              }
                              field.onChange(file as File);
                              form.clearErrors("classification_file");
                            }
                          }}
                        />
                        <div className="flex flex-col items-center gap-2 text-center">
                          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <Upload className="w-4 h-4 text-muted-foreground" />
                          </div>
                          {field.value ? (
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-green-700">
                                {field.value.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(field.value.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  field.onChange(undefined);
                                }}
                                className="h-6 px-2 text-xs"
                                disabled={isLoading}
                              >
                                <X className="w-3 h-3 mr-1" />
                                {tContractor("fileUpload.remove")}
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-sm font-medium">
                                {tContractor("fileUpload.clickToUpload")}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {tContractor("fileUpload.fileSize")}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-destructive" />
                </FormItem>
              );
            }}
          />
        </div>

        <div className="space-y-4">
          <FormField
            control={control}
            name="has_government_accreditation"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-border rounded-lg">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                    className="border-border mt-1"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium text-foreground">
                    {tContractor(
                      "sections.classification.hasGovernmentAccreditation"
                    )}
                  </FormLabel>
                  <FormDescription className="text-sm text-muted-foreground">
                    {tContractor(
                      "sections.classification.hasGovernmentAccreditationDescription"
                    )}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="covers_all_regions"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border border-border rounded-lg">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                    className="border-border mt-1"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium text-foreground">
                    {tContractor("sections.classification.coversAllRegions")}
                  </FormLabel>
                  <FormDescription className="text-sm text-muted-foreground">
                    {tContractor(
                      "sections.classification.coversAllRegionsDescription"
                    )}
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export { ClassificationAccreditationSection };
