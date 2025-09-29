"use client";

import React from "react";
import { Control } from "react-hook-form";
import { useTranslations } from "next-intl";
import { MapPin, Plus, Trash2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { FormField, FormItem, FormMessage } from "@/shared/components/ui/form";

import { CountrySelection } from "@/shared/components/ui/CoutrySelect";
import { StateSelection } from "@/shared/components/ui/StateSelect";
import { CitySelection } from "@/shared/components/ui/CitySelect";

import { ContractorOperationalFormData } from "../../../utils/validation";

interface GeographicalCoverageSectionProps {
  control: Control<ContractorOperationalFormData>;
  geographicalCoverage: Array<{
    country_code: string;
    state_id: string;
    city_id: string;
    covers_all_areas: boolean;
  }>;
  setGeographicalCoverage: (
    coverage: Array<{
      country_code: string;
      state_id: string;
      city_id: string;
      covers_all_areas: boolean;
    }>
  ) => void;
  contractorCoverage: Array<{
    country_code: string;
    state_id: string;
    city_id: string;
    covers_all_areas: boolean;
  }>;
  setContractorCoverage: (
    coverage: Array<{
      country_code: string;
      state_id: string;
      city_id: string;
      covers_all_areas: boolean;
    }>
  ) => void;
  validationErrors: Record<string, string>;
  setValidationErrors: (errors: Record<string, string>) => void;
  clearFormErrors: (fieldName: keyof ContractorOperationalFormData) => void;
  isLoading: boolean;
}

function GeographicalCoverageSection({
  control,
  geographicalCoverage,
  setGeographicalCoverage,
  contractorCoverage,
  setContractorCoverage,
  validationErrors,
  setValidationErrors,
  clearFormErrors,
  isLoading,
}: GeographicalCoverageSectionProps) {
  const tContractor = useTranslations("profile.contractorOperational");
  const tCommon = useTranslations("common");
  const clearValidationErrors = () => {
    const clearedErrors = { ...validationErrors };
    // Clear all geographical coverage related errors
    Object.keys(clearedErrors).forEach((key) => {
      if (
        key.startsWith("operational_geographical_coverage") ||
        key.startsWith("contractor_geographic_coverages")
      ) {
        delete clearedErrors[key];
      }
    });
    // Also clear the main array-level errors
    if (clearedErrors.operational_geographical_coverage) {
      delete clearedErrors.operational_geographical_coverage;
    }
    if (clearedErrors.contractor_geographic_coverages) {
      delete clearedErrors.contractor_geographic_coverages;
    }
    setValidationErrors(clearedErrors);
  };

  // Real-time validation for geographical coverage
  const validateGeographicalCoverageItem = (
    coverage: any,
    index: number,
    isOperational: boolean = true
  ) => {
    const newErrors = { ...validationErrors };
    const prefix = isOperational
      ? "operational_geographical_coverage"
      : "contractor_geographic_coverages";

    // Clear existing errors for this item
    delete newErrors[`${prefix}.${index}.country_code`];
    delete newErrors[`${prefix}.${index}.state_id`];
    delete newErrors[`${prefix}.${index}.city_id`];

    // Validate country
    if (!coverage.country_code) {
      const errorKey = `${prefix}.${index}.country_code`;
      const errorMessage = tContractor(
        isOperational
          ? "feedback.validation.contractorOperational.operationalGeographicalCoverage.countryRequired"
          : "feedback.validation.contractorOperational.contractorGeographicCoverages.countryRequired"
      );
      newErrors[errorKey] = errorMessage;
    }

    // Validate state
    if (!coverage.state_id) {
      const errorKey = `${prefix}.${index}.state_id`;
      const errorMessage = tContractor(
        isOperational
          ? "feedback.validation.contractorOperational.operationalGeographicalCoverage.stateRequired"
          : "feedback.validation.contractorOperational.contractorGeographicCoverages.stateRequired"
      );
      newErrors[errorKey] = errorMessage;
    }

    // Validate city
    if (!coverage.city_id) {
      const errorKey = `${prefix}.${index}.city_id`;
      const errorMessage = tContractor(
        isOperational
          ? "feedback.validation.contractorOperational.operationalGeographicalCoverage.cityRequired"
          : "feedback.validation.contractorOperational.contractorGeographicCoverages.cityRequired"
      );
      newErrors[errorKey] = errorMessage;
    }

    setValidationErrors(newErrors);
  };

  const addGeographicalCoverage = () => {
    setGeographicalCoverage([
      ...geographicalCoverage,
      {
        country_code: "",
        state_id: "",
        city_id: "",
        covers_all_areas: false,
      },
    ]);
    clearValidationErrors();
  };

  const removeGeographicalCoverage = (index: number) => {
    setGeographicalCoverage(geographicalCoverage.filter((_, i) => i !== index));
  };

  const addContractorCoverage = () => {
    setContractorCoverage([
      ...contractorCoverage,
      {
        country_code: "",
        state_id: "",
        city_id: "",
        covers_all_areas: false,
      },
    ]);
    clearValidationErrors();
  };

  const removeContractorCoverage = (index: number) => {
    setContractorCoverage(contractorCoverage.filter((_, i) => i !== index));
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
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Operational Coverage */}
        <div>
          <h4 className="font-medium text-foreground mb-4">
            {tContractor("sections.geographicalCoverage.operationalCoverage")}
          </h4>
          <FormField
            control={control}
            name="operational_geographical_coverage"
            render={() => (
              <FormItem>
                <FormMessage className="text-xs text-destructive mb-4" />
              </FormItem>
            )}
          />
          {geographicalCoverage.map((coverage, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-end gap-4 p-4 border border-border rounded-lg mb-4"
            >
              <div className="flex-1 space-y-4">
                <CountrySelection
                  selectedCountry={coverage.country_code}
                  onCountryChange={(countryCode) => {
                    const updated = [...geographicalCoverage];
                    updated[index].country_code = countryCode;
                    updated[index].state_id = "";
                    updated[index].city_id = "";
                    setGeographicalCoverage(updated);

                    // Clear validation error for this field
                    const newErrors = { ...validationErrors };
                    if (
                      newErrors[
                        `operational_geographical_coverage.${index}.country_code`
                      ]
                    ) {
                      delete newErrors[
                        `operational_geographical_coverage.${index}.country_code`
                      ];
                    }
                    // Clear array-level error if we now have valid coverage
                    const hasValidCoverage = updated.some(
                      (coverage) => coverage.country_code !== ""
                    );
                    if (
                      hasValidCoverage &&
                      newErrors.operational_geographical_coverage
                    ) {
                      delete newErrors.operational_geographical_coverage;
                      clearFormErrors("operational_geographical_coverage");
                    }
                    setValidationErrors(newErrors);
                  }}
                  disabled={isLoading}
                  placeholder={tCommon("select.country")}
                  label={tCommon("country")}
                />
                {validationErrors[
                  `operational_geographical_coverage.${index}.country_code`
                ] && (
                  <p className="text-xs text-destructive">
                    {
                      validationErrors[
                        `operational_geographical_coverage.${index}.country_code`
                      ]
                    }
                  </p>
                )}

                {/* State Selection */}
                <StateSelection
                  countryCode={coverage.country_code}
                  selectedState={coverage.state_id || ""}
                  onStateChange={(stateCode) => {
                    const updated = [...geographicalCoverage];
                    updated[index].state_id = stateCode;
                    updated[index].city_id = "";
                    setGeographicalCoverage(updated);

                    // Clear validation error for this field
                    const newErrors = { ...validationErrors };
                    if (
                      newErrors[
                        `operational_geographical_coverage.${index}.state_id`
                      ]
                    ) {
                      delete newErrors[
                        `operational_geographical_coverage.${index}.state_id`
                      ];
                    }
                    // Clear city error when state changes (since city gets reset)
                    if (
                      newErrors[
                        `operational_geographical_coverage.${index}.city_id`
                      ]
                    ) {
                      delete newErrors[
                        `operational_geographical_coverage.${index}.city_id`
                      ];
                    }
                    setValidationErrors(newErrors);
                  }}
                  onBlur={() => {
                    // Validate the current item when user leaves the field
                    validateGeographicalCoverageItem(coverage, index, true);
                  }}
                  disabled={isLoading || !coverage.country_code}
                  placeholder={tCommon("select.state")}
                  label={tCommon("state")}
                />
                {validationErrors[
                  `operational_geographical_coverage.${index}.state_id`
                ] && (
                  <p className="text-xs text-destructive">
                    {
                      validationErrors[
                        `operational_geographical_coverage.${index}.state_id`
                      ]
                    }
                  </p>
                )}

                {/* City Selection */}
                <CitySelection
                  stateCode={coverage.state_id || null}
                  selectedCity={coverage.city_id || ""}
                  onCityChange={(cityCode) => {
                    const updated = [...geographicalCoverage];
                    updated[index].city_id = cityCode;
                    setGeographicalCoverage(updated);

                    // Clear validation error for this field
                    const newErrors = { ...validationErrors };
                    if (
                      newErrors[
                        `operational_geographical_coverage.${index}.city_id`
                      ]
                    ) {
                      delete newErrors[
                        `operational_geographical_coverage.${index}.city_id`
                      ];
                    }
                    setValidationErrors(newErrors);
                  }}
                  onBlur={() => {
                    // Validate the current item when user leaves the field
                    validateGeographicalCoverageItem(coverage, index, true);
                  }}
                  disabled={isLoading || !coverage.state_id}
                  placeholder={tCommon("select.city")}
                  label={tCommon("city")}
                />
                {validationErrors[
                  `operational_geographical_coverage.${index}.city_id`
                ] && (
                  <p className="text-xs text-destructive">
                    {
                      validationErrors[
                        `operational_geographical_coverage.${index}.city_id`
                      ]
                    }
                  </p>
                )}

                <div className="flex items-center space-x-2">
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
                    className="text-sm font-medium text-foreground"
                  >
                    {tContractor(
                      "sections.geographicalCoverage.coversAllAreas"
                    )}
                  </Label>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeGeographicalCoverage(index)}
                className="border-destructive/20 text-destructive hover:bg-destructive/10 w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addGeographicalCoverage}
            className="w-full h-11 border-border text-foreground hover:bg-muted font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            {tContractor(
              "sections.geographicalCoverage.addOperationalCoverage"
            )}
          </Button>
        </div>

        {/* Contractor Coverage */}
        <div>
          <h4 className="font-medium text-foreground mb-4">
            {tContractor("sections.geographicalCoverage.contractorCoverage")}
          </h4>
          <FormField
            control={control}
            name="contractor_geographic_coverages"
            render={() => (
              <FormItem>
                <FormMessage className="text-xs text-destructive mb-4" />
              </FormItem>
            )}
          />
          {contractorCoverage.map((coverage, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-end gap-4 p-4 border border-border rounded-lg mb-4"
            >
              <div className="flex-1 space-y-4">
                <CountrySelection
                  selectedCountry={coverage.country_code}
                  onCountryChange={(countryCode) => {
                    const updated = [...contractorCoverage];
                    updated[index].country_code = countryCode;
                    updated[index].state_id = "";
                    updated[index].city_id = "";
                    setContractorCoverage(updated);

                    // Clear validation error for this field
                    const newErrors = { ...validationErrors };
                    if (
                      newErrors[
                        `contractor_geographic_coverages.${index}.country_code`
                      ]
                    ) {
                      delete newErrors[
                        `contractor_geographic_coverages.${index}.country_code`
                      ];
                    }
                    // Clear array-level error if we now have valid coverage
                    const hasValidContractorCoverage = updated.some(
                      (coverage) => coverage.country_code !== ""
                    );
                    if (
                      hasValidContractorCoverage &&
                      newErrors.contractor_geographic_coverages
                    ) {
                      delete newErrors.contractor_geographic_coverages;
                      clearFormErrors("contractor_geographic_coverages");
                    }
                    setValidationErrors(newErrors);
                  }}
                  disabled={isLoading}
                  placeholder={tCommon("select.country")}
                  label={tCommon("country")}
                />
                {validationErrors[
                  `contractor_geographic_coverages.${index}.country_code`
                ] && (
                  <p className="text-xs text-destructive">
                    {
                      validationErrors[
                        `contractor_geographic_coverages.${index}.country_code`
                      ]
                    }
                  </p>
                )}

                {/* State Selection */}
                <StateSelection
                  countryCode={coverage.country_code}
                  selectedState={coverage.state_id || ""}
                  onStateChange={(stateCode) => {
                    const updated = [...contractorCoverage];
                    updated[index].state_id = stateCode;
                    updated[index].city_id = "";
                    setContractorCoverage(updated);

                    // Clear validation error for this field
                    const newErrors = { ...validationErrors };
                    if (
                      newErrors[
                        `contractor_geographic_coverages.${index}.state_id`
                      ]
                    ) {
                      delete newErrors[
                        `contractor_geographic_coverages.${index}.state_id`
                      ];
                    }
                    // Clear city error when state changes (since city gets reset)
                    if (
                      newErrors[
                        `contractor_geographic_coverages.${index}.city_id`
                      ]
                    ) {
                      delete newErrors[
                        `contractor_geographic_coverages.${index}.city_id`
                      ];
                    }
                    setValidationErrors(newErrors);
                  }}
                  onBlur={() => {
                    // Validate the current item when user leaves the field
                    validateGeographicalCoverageItem(coverage, index, false);
                  }}
                  disabled={isLoading || !coverage.country_code}
                  placeholder={tCommon("select.state")}
                  label={tCommon("state")}
                />
                {validationErrors[
                  `contractor_geographic_coverages.${index}.state_id`
                ] && (
                  <p className="text-xs text-destructive">
                    {
                      validationErrors[
                        `contractor_geographic_coverages.${index}.state_id`
                      ]
                    }
                  </p>
                )}

                {/* City Selection */}
                <CitySelection
                  stateCode={coverage.state_id || null}
                  selectedCity={coverage.city_id || ""}
                  onCityChange={(cityCode) => {
                    const updated = [...contractorCoverage];
                    updated[index].city_id = cityCode;
                    setContractorCoverage(updated);

                    // Clear validation error for this field
                    const newErrors = { ...validationErrors };
                    if (
                      newErrors[
                        `contractor_geographic_coverages.${index}.city_id`
                      ]
                    ) {
                      delete newErrors[
                        `contractor_geographic_coverages.${index}.city_id`
                      ];
                    }
                    setValidationErrors(newErrors);
                  }}
                  onBlur={() => {
                    // Validate the current item when user leaves the field
                    validateGeographicalCoverageItem(coverage, index, false);
                  }}
                  disabled={isLoading || !coverage.state_id}
                  placeholder={tCommon("select.city")}
                  label={tCommon("city")}
                />
                {validationErrors[
                  `contractor_geographic_coverages.${index}.city_id`
                ] && (
                  <p className="text-xs text-destructive">
                    {
                      validationErrors[
                        `contractor_geographic_coverages.${index}.city_id`
                      ]
                    }
                  </p>
                )}

                <div className="flex items-center space-x-2">
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
                    className="text-sm font-medium text-foreground"
                  >
                    {tContractor(
                      "sections.geographicalCoverage.coversAllAreas"
                    )}
                  </Label>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeContractorCoverage(index)}
                className="border-destructive/20 text-destructive hover:bg-destructive/10 w-full sm:w-auto"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addContractorCoverage}
            className="w-full h-11 border-border text-foreground hover:bg-muted font-medium"
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
