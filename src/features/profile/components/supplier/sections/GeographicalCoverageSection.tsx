"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { MapPin, Plus, Trash2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";

import { CountrySelection } from "@/shared/components/ui/CoutrySelect";
import { StateSelection } from "@/shared/components/ui/StateSelect";
import { CitySelection } from "@/shared/components/ui/CitySelect";

interface GeographicalCoverage {
  country_code: string;
  state_id: string;
  city_id: string;
  covers_all_areas: boolean;
  specific_areas?: string[];
  priority?: "high" | "medium" | "low";
  notes?: string;
}

interface GeographicalCoverageSectionProps {
  geographicalCoverage: GeographicalCoverage[];
  setGeographicalCoverage: (coverage: GeographicalCoverage[]) => void;
  validationErrors: Record<string, string>;
  setValidationErrors: (errors: Record<string, string>) => void;
  clearFormErrors: (fieldName: string) => void;
  isLoading: boolean;
}

export const SupplierGeographicalCoverageSection: React.FC<
  GeographicalCoverageSectionProps
> = ({
  geographicalCoverage,
  setGeographicalCoverage,
  validationErrors,
  setValidationErrors,
  clearFormErrors,
  isLoading,
}) => {
  const tSupplier = useTranslations("profile.supplier.professionalInfo");
  const tCommon = useTranslations("common");

  const addGeographicalCoverage = () => {
    const newCoverage: GeographicalCoverage = {
      country_code: "",
      state_id: "",
      city_id: "",
      covers_all_areas: false,
      specific_areas: [],
      priority: "medium",
      notes: "",
    };
    setGeographicalCoverage([...geographicalCoverage, newCoverage]);
  };

  const removeGeographicalCoverage = (index: number) => {
    const updatedCoverage = geographicalCoverage.filter((_, i) => i !== index);
    setGeographicalCoverage(updatedCoverage);
  };

  const updateGeographicalCoverage = (
    index: number,
    field: keyof GeographicalCoverage,
    value: string | boolean | string[]
  ) => {
    const updatedCoverage = geographicalCoverage.map((coverage, i) =>
      i === index ? { ...coverage, [field]: value } : coverage
    );
    setGeographicalCoverage(updatedCoverage);

    // Clear validation error for this field
    clearFormErrors(`geographical_coverage.${index}.${field}`);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-2">
      <div className="flex items-center justify-between mb-4 py-4">
        <h3 className="text-lg font-semibold text-foreground dark:text-white">
          {tSupplier("geographicalCoverage")}
          <span className="text-red-500 ml-1">*</span>
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addGeographicalCoverage}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          {tSupplier("addCoverage")}
        </Button>
      </div>

      {validationErrors.geographical_coverage && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">
            {validationErrors.geographical_coverage}
          </p>
        </div>
      )}

      <div className="space-y-4">
        {geographicalCoverage.map((coverage, index) => (
          <div
            key={`geographical-coverage-${index}`}
            className="p-2 rounded-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-design-main" />
                <h4 className="text-sm font-medium text-foreground dark:text-white">
                  {tSupplier("coverage")} {index + 1}
                </h4>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeGeographicalCoverage(index)}
                disabled={isLoading}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <CountrySelection
                  selectedCountry={coverage.country_code}
                  onCountryChange={(value) =>
                    updateGeographicalCoverage(index, "country_code", value)
                  }
                  disabled={isLoading}
                  placeholder={tCommon("select.country")}
                  label={tCommon("country")}
                />
                {validationErrors[
                  `geographical_coverage.${index}.country_code`
                ] && (
                  <p className="text-destructive text-xs mt-1">
                    {
                      validationErrors[
                        `geographical_coverage.${index}.country_code`
                      ]
                    }
                  </p>
                )}
              </div>

              <div>
                <StateSelection
                  countryCode={coverage.country_code}
                  selectedState={coverage.state_id}
                  onStateChange={(value) =>
                    updateGeographicalCoverage(index, "state_id", value)
                  }
                  disabled={isLoading || !coverage.country_code}
                  placeholder={tCommon("select.state")}
                  label={tCommon("state")}
                />
                {validationErrors[
                  `geographical_coverage.${index}.state_id`
                ] && (
                  <p className="text-destructive text-xs mt-1">
                    {
                      validationErrors[
                        `geographical_coverage.${index}.state_id`
                      ]
                    }
                  </p>
                )}
              </div>

              <div>
                <CitySelection
                  stateCode={coverage.state_id}
                  selectedCity={coverage.city_id}
                  onCityChange={(value) =>
                    updateGeographicalCoverage(index, "city_id", value)
                  }
                  disabled={
                    isLoading || !coverage.country_code || !coverage.state_id
                  }
                  placeholder={tCommon("select.city")}
                  label={tCommon("city")}
                />
                {validationErrors[`geographical_coverage.${index}.city_id`] && (
                  <p className="text-destructive text-xs mt-1">
                    {validationErrors[`geographical_coverage.${index}.city_id`]}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`covers-all-${index}`}
                    checked={coverage.covers_all_areas}
                    onCheckedChange={(checked) =>
                      updateGeographicalCoverage(
                        index,
                        "covers_all_areas",
                        checked as boolean
                      )
                    }
                    disabled={isLoading}
                    className="border-border"
                  />
                  <Label
                    htmlFor={`covers-all-${index}`}
                    className="text-sm font-medium text-foreground"
                  >
                    {tSupplier("coversAllAreas")}
                  </Label>
                </div>
                {validationErrors[
                  `geographical_coverage.${index}.covers_all_areas`
                ] && (
                  <p className="text-destructive text-xs mt-1">
                    {
                      validationErrors[
                        `geographical_coverage.${index}.covers_all_areas`
                      ]
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground dark:text-white mb-2 block">
                  {tSupplier("priority")}
                </label>
                <select
                  value={coverage.priority || "medium"}
                  onChange={(e) =>
                    updateGeographicalCoverage(
                      index,
                      "priority",
                      e.target.value as "high" | "medium" | "low"
                    )
                  }
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-design-main focus:border-transparent"
                >
                  <option value="high">{tSupplier("priorities.high")}</option>
                  <option value="medium">
                    {tSupplier("priorities.medium")}
                  </option>
                  <option value="low">{tSupplier("priorities.low")}</option>
                </select>
                {validationErrors[
                  `geographical_coverage.${index}.priority`
                ] && (
                  <p className="text-destructive text-xs mt-1">
                    {
                      validationErrors[
                        `geographical_coverage.${index}.priority`
                      ]
                    }
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-foreground dark:text-white mb-2 block">
                  {tSupplier("notes")}
                </label>
                <Textarea
                  value={coverage.notes || ""}
                  onChange={(e) =>
                    updateGeographicalCoverage(index, "notes", e.target.value)
                  }
                  disabled={isLoading}
                  placeholder={tSupplier("placeholders.enterNotes")}
                  rows={2}
                />
                {validationErrors[`geographical_coverage.${index}.notes`] && (
                  <p className="text-destructive text-xs mt-1">
                    {validationErrors[`geographical_coverage.${index}.notes`]}
                  </p>
                )}
              </div>

              {/* Specific Areas Field (hidden but with validation) */}
              {validationErrors[
                `geographical_coverage.${index}.specific_areas`
              ] && (
                <div className="text-destructive text-xs">
                  {
                    validationErrors[
                      `geographical_coverage.${index}.specific_areas`
                    ]
                  }
                </div>
              )}
            </div>
            <div className="my-4 bg-border h-0.5 w-full" />
          </div>
        ))}
      </div>

      {geographicalCoverage.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>{tSupplier("noGeographicalCoverage")}</p>
        </div>
      )}
    </div>
  );
};
