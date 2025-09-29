"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { MapPin, Plus, Trash2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { CountrySelection } from "@/shared/components/ui/CoutrySelect";
import { StateSelection } from "@/shared/components/ui/StateSelect";
import { CitySelection } from "@/shared/components/ui/CitySelect";

import { EngineeringOfficeGeographicalCoverageSectionProps } from "../types/sections";
import { cn } from "@/lib/utils";

export const EngineeringOfficeGeographicalCoverageSection: React.FC<
  EngineeringOfficeGeographicalCoverageSectionProps
> = ({
  control,
  geographicalCoverage,
  setGeographicalCoverage,
  validationErrors,
  setValidationErrors,
  clearFormErrors,
  isLoading,
}) => {
  const tEngineeringOffice = useTranslations(
    "profile.engineeringOffice.professionalInfo"
  );

  const addGeographicalCoverage = () => {
    const newCoverage = {
      country_code: "",
      state_id: "",
      city_id: 0,
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
    field: keyof (typeof geographicalCoverage)[0],
    value: any
  ) => {
    const updatedCoverage = geographicalCoverage.map((coverage, i) =>
      i === index ? { ...coverage, [field]: value } : coverage
    );
    setGeographicalCoverage(updatedCoverage);

    // Clear validation error for this field
    clearFormErrors(`geographical_coverage.${index}.${field}`);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground dark:text-white">
          {tEngineeringOffice("geographicalCoverage")}
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
          {tEngineeringOffice("addCoverage")}
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
            key={index}
            className="p-4 border border-border  rounded-lg "
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-design-main" />
                <h4 className="text-sm font-medium text-foreground dark:text-white">
                  {tEngineeringOffice("coverage")} {index + 1}
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
                  placeholder={tEngineeringOffice("placeholders.selectCountry")}
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
                  placeholder={tEngineeringOffice("placeholders.selectState")}
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
                  selectedCity={coverage.city_id.toString()}
                  onCityChange={(value) =>
                    updateGeographicalCoverage(
                      index,
                      "city_id",
                      parseInt(value)
                    )
                  }
                  disabled={
                    isLoading || !coverage.country_code || !coverage.state_id
                  }
                  placeholder={tEngineeringOffice("placeholders.selectCity")}
                />
                {validationErrors[`geographical_coverage.${index}.city_id`] && (
                  <p className="text-destructive text-xs mt-1">
                    {validationErrors[`geographical_coverage.${index}.city_id`]}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium text-foreground dark:text-white mb-2 block">
                {tEngineeringOffice("notes")}
              </label>
              <Textarea
                value={coverage.notes || ""}
                onChange={(e) =>
                  updateGeographicalCoverage(index, "notes", e.target.value)
                }
                disabled={isLoading}
                placeholder={tEngineeringOffice("placeholders.enterNotes")}
                rows={2}
              />
            </div>
          </div>
        ))}
      </div>

      {geographicalCoverage.length === 0 && (
        <div className="text-center py-8 text-muted-foreground ">
          <p>{tEngineeringOffice("noGeographicalCoverage")}</p>
        </div>
      )}
    </div>
  );
};
