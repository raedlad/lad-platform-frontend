"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useGetCountries } from "@/shared/hooks/globalHooks";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import {
  useOperationalStore,
  ContractorOperationalData,
} from "../../store/operationalStore";
import { operationalApi } from "../../services/operationalApi";
import { createContractorOperationalSchema } from "../../utils/validation";
import { handleApiError } from "./utils/formUtils";
import {
  WorkField,
  GeographicalCoverage,
  ContractorCoverage,
  ValidationErrors,
} from "./types/sections";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

// Section Components
import { ProjectInformationSection } from "./sections/ProjectInformationSection";
import { ClassificationAccreditationSection } from "./sections/ClassificationAccreditationSection";
import { WorkFieldsSection } from "./sections/WorkFieldsSection";
import { GeographicalCoverageSection } from "./sections/GeographicalCoverageSection";

type ContractorOperationalFormData = z.infer<
  ReturnType<typeof createContractorOperationalSchema>
>;

const ContractorOperational = () => {
  const t = useTranslations("");
  const tContractor = useTranslations("profile.contractorOperational");
  const tCommon = useTranslations("common");
  const { countries } = useGetCountries();
  const {
    operationalData,
    setOperationalData,
    contractorOperationalData,
    setContractorOperationalData,
    isLoading,
    error,
    setLoading,
    setError,
  } = useOperationalStore();
  const [workFields, setWorkFields] = useState<WorkField[]>([]);
  const [geographicalCoverage, setGeographicalCoverage] = useState<
    GeographicalCoverage[]
  >([]);
  const [contractorCoverage, setContractorCoverage] = useState<
    ContractorCoverage[]
  >([]);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {}
  );

  const form = useForm<ContractorOperationalFormData>({
    // Remove zodResolver to prevent form-level validation
    // resolver: zodResolver(createContractorOperationalSchema(t)),
    defaultValues: {
      executed_project_range_id: 0,
      staff_size_range_id: 0,
      experience_years_range_id: 0,
      annual_projects_range_id: 0,
      classification_level_id: undefined,
      classification_file: undefined,
      has_government_accreditation: false,
      covers_all_regions: false,
      target_project_value_range_ids: undefined,
      work_fields: [],
      operational_geographical_coverage: [],
      contractor_geographic_coverages: [],
    },
  });

  // Load operational data on component mount
  useEffect(() => {
    if (operationalData) return;

    const loadOperationalData = async () => {
      try {
        const data = await operationalApi.getOperationalData();
        setOperationalData(data);
      } catch (error) {
        const errorMessage = handleApiError(
          error,
          "Failed to load operational data"
        );
        toast.error(errorMessage);
      }
    };

    loadOperationalData();
  }, [operationalData, setOperationalData]);

  // Load existing contractor operational data from profile
  useEffect(() => {
    if (contractorOperationalData) return;

    const loadContractorOperationalData = async () => {
      try {
        const data = await operationalApi.getContractorOperationalFromProfile(
          countries
        );
        if (data) {
          setContractorOperationalData(data);

          // Update form with existing data
          form.reset({
            executed_project_range_id: data.executed_project_range_id,
            staff_size_range_id: data.staff_size_range_id,
            experience_years_range_id: data.experience_years_range_id,
            annual_projects_range_id: data.annual_projects_range_id,
            classification_level_id: data.classification_level_id,
            classification_file: data.classification_file,
            has_government_accreditation: data.has_government_accreditation,
            covers_all_regions: data.covers_all_regions,
            target_project_value_range_ids: data.target_project_value_range_ids,
            work_fields: data.work_fields,
            operational_geographical_coverage:
              data.operational_geographical_coverage,
            contractor_geographic_coverages:
              data.contractor_geographic_coverages,
          });

          // Update local state arrays
          setWorkFields(data.work_fields || []);
          setGeographicalCoverage(
            (data.operational_geographical_coverage || []).map((coverage) => ({
              ...coverage,
              state_id: coverage.state_id || "",
              city_id: coverage.city_id || "",
            }))
          );
          setContractorCoverage(
            (data.contractor_geographic_coverages || []).map((coverage) => ({
              ...coverage,
              state_id: coverage.state_id || "",
              city_id: coverage.city_id || "",
            }))
          );
        }
      } catch (error) {
        console.error("Error loading contractor operational data:", error);
        // Don't show error toast for this as it's not critical
      }
    };

    loadContractorOperationalData();
  }, [
    contractorOperationalData,
    setContractorOperationalData,
    form,
    countries,
  ]);

  // Sync local state with form state whenever arrays change
  useEffect(() => {
    form.setValue("work_fields", workFields, { shouldValidate: false });
  }, [workFields, form]);

  useEffect(() => {
    form.setValue("operational_geographical_coverage", geographicalCoverage, {
      shouldValidate: false,
    });
  }, [geographicalCoverage, form]);

  useEffect(() => {
    form.setValue("contractor_geographic_coverages", contractorCoverage, {
      shouldValidate: false,
    });
  }, [contractorCoverage, form]);

  // Watch form values to track changes
  const watchedValues = form.watch();

  // Function to clear form errors
  const clearFormErrors = (fieldName: keyof ContractorOperationalFormData) => {
    form.clearErrors(fieldName);
  };

  // Track if form has changed
  const hasChanged = useMemo(() => {
    // Check if any form fields have changed from default values
    const formFieldsChanged =
      watchedValues.executed_project_range_id !== 0 ||
      watchedValues.staff_size_range_id !== 0 ||
      watchedValues.experience_years_range_id !== 0 ||
      watchedValues.annual_projects_range_id !== 0 ||
      watchedValues.classification_level_id !== undefined ||
      watchedValues.classification_file !== undefined ||
      watchedValues.has_government_accreditation !== false ||
      watchedValues.covers_all_regions !== false ||
      (watchedValues.target_project_value_range_ids &&
        watchedValues.target_project_value_range_ids.length > 0);

    // Check if work fields have been added or modified
    const workFieldsChanged =
      workFields.length > 0 &&
      workFields.some(
        (field) =>
          field.work_field_id > 0 || field.years_of_experience_in_field > 0
      );

    // Check if geographical coverage has been added or modified
    const geographicalCoverageChanged = geographicalCoverage.length > 0;

    // Check if contractor coverage has been added or modified
    const contractorCoverageChanged = contractorCoverage.length > 0;

    return (
      formFieldsChanged ||
      workFieldsChanged ||
      geographicalCoverageChanged ||
      contractorCoverageChanged
    );
  }, [watchedValues, workFields, geographicalCoverage, contractorCoverage]);

  const onSubmit = async (data: ContractorOperationalFormData) => {
    console.log("🔍 Form submission started");
    console.log("🔍 hasChanged:", hasChanged);
    console.log("🔍 watchedValues:", watchedValues);
    console.log("🔍 workFields:", workFields);
    console.log("🔍 geographicalCoverage:", geographicalCoverage);
    console.log("🔍 contractorCoverage:", contractorCoverage);

    // Prevent submission if no changes have been made
    if (!hasChanged) {
      console.log("🔍 No changes detected, preventing submission");
      toast(tCommon("actions.noChanges"), {
        icon: "ℹ️",
        style: {
          borderRadius: "10px",
          background: "#f0f9ff",
          color: "#0c4a6e",
        },
      });
      return;
    }

    console.log("🔍 Changes detected, proceeding with validation");

    // Use Zod schema validation for form submission
    console.log("🔍 Starting form submission validation");
    console.log("🔍 Current form data:", data);
    console.log("🔍 Current arrays:", {
      workFields,
      geographicalCoverage,
      contractorCoverage,
    });
    console.log("🔍 Current validation errors:", validationErrors);

    const formData = {
      executed_project_range_id: data.executed_project_range_id,
      staff_size_range_id: data.staff_size_range_id,
      experience_years_range_id: data.experience_years_range_id,
      annual_projects_range_id: data.annual_projects_range_id,
      classification_level_id: data.classification_level_id || undefined,
      classification_file: data.classification_file,
      has_government_accreditation: data.has_government_accreditation,
      covers_all_regions: data.covers_all_regions,
      target_project_value_range_ids: data.target_project_value_range_ids || [],
      work_fields: workFields || [],
      operational_geographical_coverage: (geographicalCoverage || []).map(
        (coverage) => ({
          ...coverage,
          state_id: coverage.state_id || "",
          city_id: coverage.city_id || "",
        })
      ),
      contractor_geographic_coverages: (contractorCoverage || []).map(
        (coverage) => ({
          ...coverage,
          state_id: coverage.state_id || "",
          city_id: coverage.city_id || "",
        })
      ),
    };

    // Validate using Zod schema
    const schema = createContractorOperationalSchema(tContractor);
    console.log("🔍 Created schema:", schema);
    console.log("🔍 Form data to validate:", formData);

    const validationResult = schema.safeParse(formData);
    console.log("🔍 Validation result:", validationResult);

    if (!validationResult.success) {
      // Convert Zod errors to our validation errors format
      const errors: Record<string, string> = {};
      validationResult.error.issues.forEach((error: any) => {
        const path = error.path.join(".");
        errors[path] = error.message;
      });

      setValidationErrors(errors);

      // Also set form errors
      validationResult.error.issues.forEach((error: any) => {
        const path = error.path.join(".");
        form.setError(path as any, { message: error.message });
      });

      toast.error(tContractor("errors.validationFailed"), {
        style: {
          borderRadius: "10px",
          background: "#fef2f2",
          color: "#dc2626",
        },
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Don't clear validation errors here - let them show to the user
      // setValidationErrors({});

      await operationalApi.updateFullOperationalProfile(formData);
      setContractorOperationalData(formData);
      // Clear validation errors only after successful submission
      setValidationErrors({});
      toast.success(tContractor("success.updateSuccess"), {
        style: {
          borderRadius: "10px",
          background: "#f0fdf4",
          color: "#16a34a",
        },
      });
    } catch (error) {
      const errorMessage = handleApiError(
        error,
        tContractor("errors.updateFailed")
      );
      setError(errorMessage);
      toast.error(errorMessage, {
        style: {
          borderRadius: "10px",
          background: "#fef2f2",
          color: "#dc2626",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  if (!operationalData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-design-main mx-auto mb-4"></div>
          <p className="text-muted-foreground">{tContractor("loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-xl">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 sm:space-y-8"
            >
              <ProjectInformationSection
                control={form.control}
                operationalData={operationalData}
                isLoading={isLoading}
              />

              <ClassificationAccreditationSection
                control={form.control}
                operationalData={operationalData}
                isLoading={isLoading}
              />

              <WorkFieldsSection
                control={form.control}
                operationalData={operationalData}
                workFields={workFields}
                setWorkFields={setWorkFields}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                clearFormErrors={clearFormErrors}
                isLoading={isLoading}
              />

              <GeographicalCoverageSection
                control={form.control}
                geographicalCoverage={geographicalCoverage}
                setGeographicalCoverage={setGeographicalCoverage}
                contractorCoverage={contractorCoverage}
                setContractorCoverage={setContractorCoverage}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                clearFormErrors={clearFormErrors}
                isLoading={isLoading}
              />

              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive text-sm">{error}</p>
                </div>
              )}

              <div className="flex justify-end pt-6 border-t border-border">
                <Button
                  type="submit"
                  className={cn(
                    "px-6 sm:px-8 py-3 bg-design-main hover:bg-design-main-dark text-white font-medium rounded-lg shadow-sm transition-all duration-200 min-w-[140px] w-full sm:w-auto",
                    (!hasChanged || isLoading) &&
                      "cursor-not-allowed bg-muted hover:bg-muted"
                  )}
                  disabled={!hasChanged || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {tContractor("saving")}
                    </div>
                  ) : (
                    tContractor("saveChanges")
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ContractorOperational;
