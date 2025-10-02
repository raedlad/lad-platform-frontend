"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { MapPin, Plus, Trash2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { FormField, FormItem, FormMessage } from "@/shared/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

import { CitySelection } from "@/shared/components/ui/CitySelect";

interface GeographicalCoverage {
  city_id: string;
  covers_all_areas: boolean;
  specific_areas?: string[];
  priority?: "high" | "medium" | "low";
  notes?: string;
}

interface GeographicalCoverageSectionProps {
  geographicalCoverage: GeographicalCoverage[];
  setGeographicalCoverage: (coverage: GeographicalCoverage[]) => void;
  isLoading: boolean;
}

export const SupplierGeographicalCoverageSection: React.FC<
  GeographicalCoverageSectionProps
> = ({ geographicalCoverage, setGeographicalCoverage, isLoading }) => {
  const tSupplier = useTranslations("profile.supplier.professionalInfo");
  const tCommon = useTranslations("common");
  const { control, trigger } = useFormContext();

  const addGeographicalCoverage = () => {
    const newCoverage: GeographicalCoverage = {
      city_id: "",
      covers_all_areas: false,
      specific_areas: [],
      priority: "medium",
      notes: "",
    };
    setGeographicalCoverage([...geographicalCoverage, newCoverage]);
    // Trigger validation after adding
    setTimeout(() => trigger("geographical_coverage"), 0);
  };

  const removeGeographicalCoverage = (index: number) => {
    const updatedCoverage = geographicalCoverage.filter((_, i) => i !== index);
    setGeographicalCoverage(updatedCoverage);
    // Trigger validation after removing
    setTimeout(() => trigger("geographical_coverage"), 0);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      <div className="px-4 sm:px-6 py-4 border-b border-border bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-design-main/10 rounded-lg flex-shrink-0">
            <MapPin className="h-5 w-5 text-design-main" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              {tSupplier("geographicalCoverage")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {tSupplier("geographicalCoverageDescription")}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-foreground">
            {tSupplier("coverageAreas")}
          </h4>
          <div className="text-sm text-muted-foreground">
            {tSupplier("coverageCount", {
              count: geographicalCoverage.length,
            })}
          </div>
        </div>

        <FormField
          control={control}
          name="geographical_coverage"
          render={() => (
            <FormItem>
              <FormMessage className="text-xs text-destructive mb-4" />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          {geographicalCoverage.map((coverage, index) => (
            <div
              key={index}
              className="group relative bg-muted/30 border border-border rounded-lg p-5 hover:bg-muted/50 transition-colors"
            >
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 space-y-4">
                  <FormField
                    control={control}
                    name={`geographical_coverage.${index}.city_id`}
                    render={() => (
                      <FormItem>
                        <CitySelection
                          selectedCity={coverage.city_id || ""}
                          onCityChange={(cityCode) => {
                            const updated = [...geographicalCoverage];
                            updated[index].city_id = cityCode;
                            setGeographicalCoverage(updated);
                            setTimeout(
                              () => trigger("geographical_coverage"),
                              0
                            );
                          }}
                          disabled={isLoading}
                          placeholder={tCommon("select.city")}
                          label={tCommon("city")}
                          className="w-full"
                        />
                        <FormMessage className="text-xs text-destructive" />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`covers-all-${index}`}
                      checked={coverage.covers_all_areas}
                      onCheckedChange={(checked) => {
                        const updated = [...geographicalCoverage];
                        updated[index].covers_all_areas = checked as boolean;
                        setGeographicalCoverage(updated);
                      }}
                      disabled={isLoading}
                      className="border-border"
                    />
                    <Label
                      htmlFor={`covers-all-${index}`}
                      className="text-sm font-medium text-foreground cursor-pointer"
                    >
                      {tSupplier("coversAllAreas")}
                    </Label>
                  </div>

                  {coverage.covers_all_areas && (
                    <div>
                      <Label className="text-sm font-medium text-foreground">
                        {tSupplier("specificAreas")}
                      </Label>
                      <Textarea
                        value={coverage.specific_areas?.join(", ") || ""}
                        onChange={(e) => {
                          const updated = [...geographicalCoverage];
                          updated[index].specific_areas = e.target.value
                            .split(",")
                            .map((area) => area.trim())
                            .filter((area) => area.length > 0);
                          setGeographicalCoverage(updated);
                        }}
                        disabled={isLoading}
                        placeholder={tSupplier("specificAreasPlaceholder")}
                        className="mt-1"
                      />
                    </div>
                  )}

                  <div>
                    <Label className="text-sm font-medium text-foreground">
                      {tSupplier("priority")}
                    </Label>
                    <Select
                      value={coverage.priority || "medium"}
                      onValueChange={(value) => {
                        const updated = [...geographicalCoverage];
                        updated[index].priority = value as
                          | "high"
                          | "medium"
                          | "low";
                        setGeographicalCoverage(updated);
                      }}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">
                          {tSupplier("priorities.high")}
                        </SelectItem>
                        <SelectItem value="medium">
                          {tSupplier("priorities.medium")}
                        </SelectItem>
                        <SelectItem value="low">
                          {tSupplier("priorities.low")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground">
                      {tSupplier("notes")}
                    </Label>
                    <Textarea
                      value={coverage.notes || ""}
                      onChange={(e) => {
                        const updated = [...geographicalCoverage];
                        updated[index].notes = e.target.value;
                        setGeographicalCoverage(updated);
                      }}
                      disabled={isLoading}
                      placeholder={tSupplier("notesPlaceholder")}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end lg:justify-start">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeGeographicalCoverage(index)}
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
          onClick={addGeographicalCoverage}
          className="w-full h-11 border-dashed border-2 border-border text-foreground hover:bg-muted hover:border-solid font-medium transition-all"
        >
          <Plus className="h-4 w-4 mr-2" />
          {tSupplier("addCoverage")}
        </Button>
      </div>
    </div>
  );
};
