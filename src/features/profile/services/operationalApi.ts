import api from "@/lib/api";
import {
  OperationalData,
  ContractorOperationalData,
} from "../store/operationalStore";

// Error messages
const ERROR_MESSAGES = {
  FETCH_OPERATIONAL_DATA: "Failed to fetch operational data",
  SAVE_OPERATIONAL_DATA: "Failed to save contractor operational data",
  UPDATE_OPERATIONAL_PROFILE: "Failed to update operational profile",
} as const;

export const operationalApi = {
  // Get all operational data from the general-data-profile/all endpoint
  async getOperationalData(): Promise<OperationalData> {
    try {
      const response = await api.get("/general-data-profile/all");
      return response.data.response;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.FETCH_OPERATIONAL_DATA);
    }
  },

  // Save contractor operational data
  async saveContractorOperationalData(
    data: ContractorOperationalData
  ): Promise<void> {
    try {
      // Convert the data to FormData for file uploads
      const formData = new FormData();

      // Add all the required fields
      formData.append(
        "executed_project_range_id",
        data.executed_project_range_id.toString()
      );
      formData.append(
        "staff_size_range_id",
        data.staff_size_range_id.toString()
      );
      formData.append(
        "experience_years_range_id",
        data.experience_years_range_id.toString()
      );
      formData.append(
        "annual_projects_range_id",
        data.annual_projects_range_id.toString()
      );

      if (data.classification_level_id) {
        formData.append(
          "classification_level_id",
          data.classification_level_id.toString()
        );
      }

      if (data.classification_file) {
        formData.append("classification_file", data.classification_file);
      }

      formData.append(
        "has_government_accreditation",
        data.has_government_accreditation.toString()
      );
      formData.append("covers_all_regions", data.covers_all_regions.toString());

      // Add target project value range IDs
      data.target_project_value_range_ids?.forEach((id, index) => {
        formData.append(
          `target_project_value_range_ids[${index}]`,
          id.toString()
        );
      });

      // Add work fields
      data.work_fields.forEach((field, index) => {
        formData.append(
          `work_fields[${index}][work_field_id]`,
          field.work_field_id.toString()
        );
        formData.append(
          `work_fields[${index}][years_of_experience_in_field]`,
          field.years_of_experience_in_field.toString()
        );
      });

      // Add operational geographical coverage
      data.operational_geographical_coverage.forEach((coverage, index) => {
        if (coverage.city_id) {
          formData.append(
            `operational_geographical_coverage[${index}][city_id]`,
            coverage.city_id
          );
        }
        formData.append(
          `operational_geographical_coverage[${index}][covers_all_areas]`,
          coverage.covers_all_areas.toString()
        );
      });

      // Add contractor geographic coverages
      data.contractor_geographic_coverages.forEach((coverage, index) => {
        if (coverage.city_id) {
          formData.append(
            `contractor_geographic_coverages[${index}][city_id]`,
            coverage.city_id
          );
        }
        formData.append(
          `contractor_geographic_coverages[${index}][covers_all_areas]`,
          coverage.covers_all_areas.toString()
        );
      });

      await api.post("/contractor/operational", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      throw new Error(ERROR_MESSAGES.SAVE_OPERATIONAL_DATA);
    }
  },

  // Get contractor operational data
  async getContractorOperationalData(): Promise<ContractorOperationalData | null> {
    try {
      const response = await api.get("/contractor/operational");
      return response.data;
    } catch (error) {
      return null;
    }
  },

  // Get contractor operational data from profile endpoint
  async getContractorOperationalFromProfile(
    countries?: any[]
  ): Promise<ContractorOperationalData | null> {
    try {
      const response = await api.get("/contractor/profile");
      const profileData = response.data.response;

      if (!profileData?.operational_profile) {
        return null;
      }

      const operationalProfile = profileData.operational_profile;

      // Helper function to get country ISO2 code from country name
      const getCountryCodeFromName = (countryName: string): string => {
        if (!countries || !countryName) return "";
        const country = countries.find((c) => c.name === countryName);
        return country?.iso2 || "";
      };

      // Transform the profile data to match ContractorOperationalData format
      const contractorOperationalData: ContractorOperationalData = {
        executed_project_range_id:
          operationalProfile.executed_project_range?.id || 0,
        staff_size_range_id: operationalProfile.staff_size_range?.id || 0,
        experience_years_range_id:
          operationalProfile.experience_years_range?.id || 0,
        annual_projects_range_id:
          operationalProfile.annual_projects_range?.id || 0,
        classification_level_id:
          operationalProfile.classification_level?.id || undefined,
        classification_file: undefined, // File not available in profile response
        has_government_accreditation:
          operationalProfile.has_government_accreditation || false,
        covers_all_regions: operationalProfile.covers_all_regions || false,
        target_project_value_range_ids:
          profileData.target_project_values?.map(
            (item: any) => item.project_value_range.id
          ) || [],
        work_fields:
          operationalProfile.work_fields?.map((field: any) => ({
            work_field_id: field.work_field.id,
            years_of_experience_in_field: field.years_of_experience_in_field,
          })) || [],
        operational_geographical_coverage:
          operationalProfile.geographical_coverage?.map((coverage: any) => {
            console.log("🌍 Processing geographical coverage:", coverage);
            console.log("🌍 City object:", coverage.city);
            console.log("🌍 City ID:", coverage.city?.id);
            console.log("🌍 Country name:", coverage.city?.country);

            return {
              country_code: getCountryCodeFromName(coverage.city.country),
              state_id: coverage.state_id?.toString() || "",
              city_id: coverage.city.id.toString(),
              covers_all_areas: coverage.covers_all_areas || false,
            };
          }) || [],
        contractor_geographic_coverages:
          profileData.geographical_coverage?.map((coverage: any) => {
            console.log("🏢 Processing contractor coverage:", coverage);
            console.log("🏢 City object:", coverage.city);
            console.log("🏢 City ID:", coverage.city?.id);
            console.log("🏢 Country name:", coverage.city?.country);

            return {
              country_code: getCountryCodeFromName(coverage.city.country),
              state_id: coverage.state_id?.toString() || "",
              city_id: coverage.city.id.toString(),
              covers_all_areas: coverage.covers_all_areas || false,
            };
          }) || [],
      };

      return contractorOperationalData;
    } catch (error) {
      console.error(
        "Error fetching contractor operational data from profile:",
        error
      );
      return null;
    }
  },

  // Update full contractor operational profile
  async updateFullOperationalProfile(
    data: ContractorOperationalData
  ): Promise<void> {
    try {
      // Convert the data to FormData for file uploads
      const formData = new FormData();

      // Add all the required fields
      formData.append(
        "executed_project_range_id",
        data.executed_project_range_id.toString()
      );
      formData.append(
        "staff_size_range_id",
        data.staff_size_range_id.toString()
      );
      formData.append(
        "experience_years_range_id",
        data.experience_years_range_id.toString()
      );
      formData.append(
        "annual_projects_range_id",
        data.annual_projects_range_id.toString()
      );

      if (data.classification_level_id) {
        formData.append(
          "classification_level_id",
          data.classification_level_id.toString()
        );
      }

      if (data.classification_file) {
        formData.append("classification_file", data.classification_file);
      }

      formData.append(
        "has_government_accreditation",
        data.has_government_accreditation.toString()
      );
      formData.append("covers_all_regions", data.covers_all_regions.toString());

      // Add target project value range IDs
      data.target_project_value_range_ids?.forEach((id, index) => {
        formData.append(
          `target_project_value_range_ids[${index}]`,
          id.toString()
        );
      });

      // Add work fields (ensure it's always an array)
      const workFields = data.work_fields || [];
      if (workFields.length === 0) {
        // Send empty array key to satisfy API requirements
        formData.append("work_fields[]", "");
      } else {
        workFields.forEach((field, index) => {
          formData.append(
            `work_fields[${index}][work_field_id]`,
            field.work_field_id.toString()
          );
          formData.append(
            `work_fields[${index}][years_of_experience_in_field]`,
            field.years_of_experience_in_field.toString()
          );
        });
      }

      // Add operational geographical coverage (ensure it's always an array)
      const operationalCoverage = data.operational_geographical_coverage || [];
      if (operationalCoverage.length === 0) {
        // Send empty array key to satisfy API requirements
        formData.append("operational_geographical_coverage[]", "");
      } else {
        operationalCoverage.forEach((coverage, index) => {
          if (coverage.city_id) {
            formData.append(
              `operational_geographical_coverage[${index}][city_id]`,
              coverage.city_id
            );
          }
          formData.append(
            `operational_geographical_coverage[${index}][covers_all_areas]`,
            coverage.covers_all_areas.toString()
          );
        });
      }

      // Add contractor geographic coverages (ensure it's always an array)
      const contractorCoverage = data.contractor_geographic_coverages || [];
      if (contractorCoverage.length === 0) {
        // Send empty array key to satisfy API requirements
        formData.append("contractor_geographic_coverages[]", "");
      } else {
        contractorCoverage.forEach((coverage, index) => {
          if (coverage.city_id) {
            formData.append(
              `contractor_geographic_coverages[${index}][city_id]`,
              coverage.city_id
            );
          }
          formData.append(
            `contractor_geographic_coverages[${index}][covers_all_areas]`,
            coverage.covers_all_areas.toString()
          );
        });
      }

      await api.post("/contractor/profile/update-full-operational", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } catch (error) {
      throw new Error(ERROR_MESSAGES.UPDATE_OPERATIONAL_PROFILE);
    }
  },
};
