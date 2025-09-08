import api from "@/lib/api";
import {
  OperationalData,
  ContractorOperationalData,
} from "../store/operationalStore";

export const operationalApi = {
  // Get all operational data from the general-data-profile/all endpoint
  async getOperationalData(): Promise<OperationalData> {
    try {
      const response = await api.get("/general-data-profile/all");
      return response.data.response;
    } catch (error) {
      console.error("Error fetching operational data:", error);
      throw error;
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
      data.target_project_value_range_ids.forEach((id, index) => {
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
        formData.append(
          `operational_geographical_coverage[${index}][country_code]`,
          coverage.country_code
        );
        if (coverage.state_id) {
          formData.append(
            `operational_geographical_coverage[${index}][state_id]`,
            coverage.state_id
          );
        }
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
        formData.append(
          `contractor_geographic_coverages[${index}][country_code]`,
          coverage.country_code
        );
        if (coverage.state_id) {
          formData.append(
            `contractor_geographic_coverages[${index}][state_id]`,
            coverage.state_id
          );
        }
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
      console.error("Error saving contractor operational data:", error);
      throw error;
    }
  },

  // Get contractor operational data
  async getContractorOperationalData(): Promise<ContractorOperationalData | null> {
    try {
      const response = await api.get("/contractor/operational");
      return response.data;
    } catch (error) {
      console.error("Error fetching contractor operational data:", error);
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
      data.target_project_value_range_ids.forEach((id, index) => {
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
        formData.append(
          `operational_geographical_coverage[${index}][country_code]`,
          coverage.country_code
        );
        if (coverage.state_id) {
          formData.append(
            `operational_geographical_coverage[${index}][state_id]`,
            coverage.state_id
          );
        }
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
        formData.append(
          `contractor_geographic_coverages[${index}][country_code]`,
          coverage.country_code
        );
        if (coverage.state_id) {
          formData.append(
            `contractor_geographic_coverages[${index}][state_id]`,
            coverage.state_id
          );
        }
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

      await api.post(
        "/contractor/update-profile/update-full-operational",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    } catch (error) {
      console.error("Error updating full operational profile:", error);
      throw error;
    }
  },
};
