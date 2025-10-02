"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";

import { Button } from "@/shared/components/ui/button";
import { Form } from "@/shared/components/ui/form";
import { useOperationalStore } from "../../store/operationalStore";
import { operationalApi } from "../../services/operationalApi";
import { createContractorOperationalSchema } from "../../utils/validation";
import { handleApiError } from "./utils/formUtils";
import {
  WorkField,
  GeographicalCoverage,
  ContractorCoverage,
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

  const form = useForm<ContractorOperationalFormData>({
    defaultValues: {
      executed_project_range_id: 0,
      staff_size_range_id: 0,
      experience_years_range_id: 0,
      annual_projects_range_id: 0,
      classification_level_id: undefined,
      classification_file: undefined,
      has_government_accreditation: false,
      covers_all_regions: false,
      target_project_value_range_ids: [],
      work_fields: [],
      operational_geographical_coverage: [],
      contractor_geographic_coverages: [],
    },
    mode: "onChange", // This ensures the form updates immediately when values change
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
    const loadContractorOperationalData = async () => {
      try {
        const data = await operationalApi.getContractorOperationalFromProfile();
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
              city_id: coverage.city_id || "",
              covers_all_areas: coverage.covers_all_areas || false,
            }))
          );
          setContractorCoverage(
            (data.contractor_geographic_coverages || []).map((coverage) => ({
              city_id: coverage.city_id || "",
              covers_all_areas: coverage.covers_all_areas || false,
            }))
          );
        }
      } catch (error) {
        console.error("Error loading contractor operational data:", error);
        // Don't show error toast for this as it's not critical
      }
    };

    // Only load if we don't have data yet
    if (!contractorOperationalData) {
      loadContractorOperationalData();
    } else {
      // If we already have data, ensure local state is properly initialized
      setWorkFields(contractorOperationalData.work_fields || []);
      setGeographicalCoverage(
        (contractorOperationalData.operational_geographical_coverage || []).map(
          (coverage) => ({
            city_id: coverage.city_id || "",
            covers_all_areas: coverage.covers_all_areas || false,
          })
        )
      );
      setContractorCoverage(
        (contractorOperationalData.contractor_geographic_coverages || []).map(
          (coverage) => ({
            city_id: coverage.city_id || "",
            covers_all_areas: coverage.covers_all_areas || false,
          })
        )
      );
    }
  }, [contractorOperationalData, setContractorOperationalData, form]);

  // Additional effect to ensure form is reset when contractorOperationalData changes
  useEffect(() => {
    if (contractorOperationalData) {
      const formData = {
        executed_project_range_id:
          contractorOperationalData.executed_project_range_id,
        staff_size_range_id: contractorOperationalData.staff_size_range_id,
        experience_years_range_id:
          contractorOperationalData.experience_years_range_id,
        annual_projects_range_id:
          contractorOperationalData.annual_projects_range_id,
        classification_level_id:
          contractorOperationalData.classification_level_id,
        classification_file: contractorOperationalData.classification_file,
        has_government_accreditation:
          contractorOperationalData.has_government_accreditation,
        covers_all_regions: contractorOperationalData.covers_all_regions,
        target_project_value_range_ids:
          contractorOperationalData.target_project_value_range_ids,
        work_fields: contractorOperationalData.work_fields,
        operational_geographical_coverage:
          contractorOperationalData.operational_geographical_coverage,
        contractor_geographic_coverages:
          contractorOperationalData.contractor_geographic_coverages,
      };
      form.reset(formData);

      // Use setTimeout to ensure form is properly initialized before setting individual values
      setTimeout(() => {
        form.setValue(
          "executed_project_range_id",
          contractorOperationalData.executed_project_range_id
        );
        form.setValue(
          "staff_size_range_id",
          contractorOperationalData.staff_size_range_id
        );
        form.setValue(
          "experience_years_range_id",
          contractorOperationalData.experience_years_range_id
        );
        form.setValue(
          "annual_projects_range_id",
          contractorOperationalData.annual_projects_range_id
        );
        form.setValue(
          "classification_level_id",
          contractorOperationalData.classification_level_id
        );
        form.setValue(
          "has_government_accreditation",
          contractorOperationalData.has_government_accreditation
        );
        form.setValue(
          "covers_all_regions",
          contractorOperationalData.covers_all_regions
        );
        form.setValue(
          "target_project_value_range_ids",
          contractorOperationalData.target_project_value_range_ids || []
        );
      }, 100);
    }
  }, [contractorOperationalData, form]);

  // Sync local state with form state whenever arrays change
  useEffect(() => {
    // Convert WorkField[] to WorkFieldWithExperience[] for form
    const workFieldsForForm = workFields.map((field) => ({
      work_field_id: field.work_field_id,
      years_of_experience_in_field: field.years_of_experience_in_field || 0,
    }));
    form.setValue("work_fields", workFieldsForForm, { shouldValidate: true });
  }, [workFields, form]);

  useEffect(() => {
    form.setValue("operational_geographical_coverage", geographicalCoverage, {
      shouldValidate: true,
    });
  }, [geographicalCoverage, form]);

  useEffect(() => {
    form.setValue("contractor_geographic_coverages", contractorCoverage, {
      shouldValidate: true,
    });
  }, [contractorCoverage, form]);

  // Watch form values to track changes
  const watchedValues = form.watch();

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
          field.work_field_id > 0 ||
          (field.years_of_experience_in_field &&
            field.years_of_experience_in_field > 0)
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
    // Prevent submission if no changes have been made
    if (!hasChanged) {
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

    // Trigger validation for all fields before Zod validation
    await form.trigger();

    const formData = {
      executed_project_range_id: data.executed_project_range_id,
      staff_size_range_id: data.staff_size_range_id,
      experience_years_range_id: data.experience_years_range_id,
      annual_projects_range_id: data.annual_projects_range_id,
      classification_level_id: data.classification_level_id || undefined,
      classification_file:
        data.classification_file instanceof File
          ? data.classification_file
          : undefined,
      has_government_accreditation: data.has_government_accreditation,
      covers_all_regions: data.covers_all_regions,
      target_project_value_range_ids: data.target_project_value_range_ids || [],
      work_fields: (workFields || []).map((field) => ({
        work_field_id: field.work_field_id,
        years_of_experience_in_field: field.years_of_experience_in_field || 0,
      })),
      operational_geographical_coverage: (geographicalCoverage || []).map(
        (coverage) => ({
          city_id: coverage.city_id || "",
          covers_all_areas: coverage.covers_all_areas || false,
        })
      ),
      contractor_geographic_coverages: (contractorCoverage || []).map(
        (coverage) => ({
          city_id: coverage.city_id || "",
          covers_all_areas: coverage.covers_all_areas || false,
        })
      ),
    };

    // Validate using Zod schema
    const schema = createContractorOperationalSchema(t);
    const validationResult = schema.safeParse(formData);

    if (!validationResult.success) {
      // Set form errors from Zod validation
      validationResult.error.issues.forEach((error) => {
        const path = error.path.join(".");
        form.setError(path as keyof ContractorOperationalFormData, {
          message: error.message,
        });
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

      await operationalApi.updateFullOperationalProfile(formData);
      setContractorOperationalData(formData);
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
            <FormProvider {...form}>
              <form
                key={contractorOperationalData ? "loaded" : "loading"}
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 sm:space-y-8"
              >
                <ProjectInformationSection
                  operationalData={operationalData}
                  isLoading={isLoading}
                />

                <ClassificationAccreditationSection
                  operationalData={operationalData}
                  isLoading={isLoading}
                />

                <WorkFieldsSection
                  operationalData={operationalData}
                  workFields={workFields}
                  setWorkFields={setWorkFields}
                  isLoading={isLoading}
                />

                <GeographicalCoverageSection
                  geographicalCoverage={geographicalCoverage}
                  setGeographicalCoverage={setGeographicalCoverage}
                  contractorCoverage={contractorCoverage}
                  setContractorCoverage={setContractorCoverage}
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
            </FormProvider>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ContractorOperational;
