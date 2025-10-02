"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { MapPin, Plus, Trash2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { FormField, FormItem, FormMessage } from "@/shared/components/ui/form";

import { CitySelection } from "@/shared/components/ui/CitySelect";

import { ContractorOperationalFormData } from "../../../utils/validation";

interface GeographicalCoverageSectionProps {
  geographicalCoverage: Array<{
    city_id: string;
    covers_all_areas: boolean;
  }>;
  setGeographicalCoverage: (
    coverage: Array<{
      city_id: string;
      covers_all_areas: boolean;
    }>
  ) => void;
  contractorCoverage: Array<{
    city_id: string;
    covers_all_areas: boolean;
  }>;
  setContractorCoverage: (
    coverage: Array<{
      city_id: string;
      covers_all_areas: boolean;
    }>
  ) => void;
  isLoading: boolean;
}

function GeographicalCoverageSection({
  geographicalCoverage,
  setGeographicalCoverage,
  contractorCoverage,
  setContractorCoverage,
  isLoading,
}: GeographicalCoverageSectionProps) {
  const tContractor = useTranslations("profile.contractorOperational");
  const tCommon = useTranslations("common");
  const { control, trigger } = useFormContext<ContractorOperationalFormData>();

  const addGeographicalCoverage = () => {
    setGeographicalCoverage([
      ...geographicalCoverage,
      {
        city_id: "",
        covers_all_areas: false,
      },
    ]);
    // Trigger validation after adding
    setTimeout(() => trigger("operational_geographical_coverage"), 0);
  };

  const removeGeographicalCoverage = (index: number) => {
    setGeographicalCoverage(geographicalCoverage.filter((_, i) => i !== index));
    // Trigger validation after removing
    setTimeout(() => trigger("operational_geographical_coverage"), 0);
  };

  const addContractorCoverage = () => {
    setContractorCoverage([
      ...contractorCoverage,
      {
        city_id: "",
        covers_all_areas: false,
      },
    ]);
    // Trigger validation after adding
    setTimeout(() => trigger("contractor_geographic_coverages"), 0);
  };

  const removeContractorCoverage = (index: number) => {
    setContractorCoverage(contractorCoverage.filter((_, i) => i !== index));
    // Trigger validation after removing
    setTimeout(() => trigger("contractor_geographic_coverages"), 0);
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
              {tContractor("sections.geographicalCoverage.title")}
            </h3>
            <p className="text-sm text-muted-foreground">
              {tContractor("sections.geographicalCoverage.description")}
            </p>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 space-y-8">
        {/* Operational Coverage */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-foreground">
              {tContractor("sections.geographicalCoverage.operationalCoverage")}
            </h4>
          </div>

          <FormField
            control={control}
            name="operational_geographical_coverage"
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
                      name={`operational_geographical_coverage.${index}.city_id`}
                      render={() => (
                        <FormItem>
                          <CitySelection
                            selectedCity={coverage.city_id || ""}
                            onCityChange={(cityCode) => {
                              const updated = [...geographicalCoverage];
                              updated[index].city_id = cityCode;
                              setGeographicalCoverage(updated);
                              setTimeout(
                                () =>
                                  trigger("operational_geographical_coverage"),
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
                        {tContractor(
                          "sections.geographicalCoverage.coversAllAreas"
                        )}
                      </Label>
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
            {tContractor(
              "sections.geographicalCoverage.addOperationalCoverage"
            )}
          </Button>
        </div>

        {/* Contractor Coverage */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-foreground">
              {tContractor("sections.geographicalCoverage.contractorCoverage")}
            </h4>
          </div>

          <FormField
            control={control}
            name="contractor_geographic_coverages"
            render={() => (
              <FormItem>
                <FormMessage className="text-xs text-destructive mb-4" />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            {contractorCoverage.map((coverage, index) => (
              <div
                key={index}
                className="group relative bg-muted/30 border border-border rounded-lg p-5 hover:bg-muted/50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 space-y-4">
                    <FormField
                      control={control}
                      name={`contractor_geographic_coverages.${index}.city_id`}
                      render={() => (
                        <FormItem>
                          <CitySelection
                            selectedCity={coverage.city_id || ""}
                            onCityChange={(cityCode) => {
                              const updated = [...contractorCoverage];
                              updated[index].city_id = cityCode;
                              setContractorCoverage(updated);
                              // Trigger validation for the contractor coverage field
                              setTimeout(
                                () =>
                                  trigger("contractor_geographic_coverages"),
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
                        id={`contractor-covers-all-${index}`}
                        checked={coverage.covers_all_areas}
                        onCheckedChange={(checked) => {
                          const updated = [...contractorCoverage];
                          updated[index].covers_all_areas = checked as boolean;
                          setContractorCoverage(updated);
                        }}
                        disabled={isLoading}
                        className="border-border"
                      />
                      <Label
                        htmlFor={`contractor-covers-all-${index}`}
                        className="text-sm font-medium text-foreground cursor-pointer"
                      >
                        {tContractor(
                          "sections.geographicalCoverage.coversAllAreas"
                        )}
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center justify-end lg:justify-start">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContractorCoverage(index)}
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
            onClick={addContractorCoverage}
            className="w-full h-11 border-dashed border-2 border-border text-foreground hover:bg-muted hover:border-solid font-medium transition-all"
          >
            <Plus className="h-4 w-4 mr-2" />
            {tContractor("sections.geographicalCoverage.addContractorCoverage")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export { GeographicalCoverageSection };
