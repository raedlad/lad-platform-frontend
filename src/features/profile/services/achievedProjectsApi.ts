import { api as apiClient } from "@/lib/api";
import {
  AchievedProject,
  AchievedProjectsApiResponse,
  CreateAchievedProjectRequest,
  UpdateAchievedProjectRequest,
  AchievedProjectsFilters,
  ProjectType,
} from "../types/achievedProjects";

class AchievedProjectsApi {
  private baseUrl = "/contractor/projects-previous";

  // Get all achieved projects
  async getAchievedProjects(): Promise<AchievedProjectsApiResponse> {
    const response = await apiClient.get(this.baseUrl);
    return response.data;
  }

  // Get a single achieved project by ID
  async getAchievedProject(id: number): Promise<AchievedProject> {
    const response = await apiClient.get(`${this.baseUrl}/${id}`);
    // Handle the response structure - it might be wrapped in a response object
    return response.data.response || response.data;
  }

  // Create a new achieved project
  async createAchievedProject(
    data: CreateAchievedProjectRequest
  ): Promise<AchievedProject> {
    const formData = new FormData();

    // Add text fields
    formData.append("project_name_ar", data.project_name_ar);
    formData.append("project_name_en", data.project_name_en);
    formData.append("description_ar", data.description_ar);
    formData.append("description_en", data.description_en);

    // Add project type
    if (data.project_type_id) {
      formData.append("project_type_id", data.project_type_id.toString());
    }
    if (data.country_id) {
      formData.append("country_id", data.country_id.toString());
    }
    if (data.state_id) {
      formData.append("state_id", data.state_id.toString());
    }
    if (data.city_id) {
      formData.append("city_id", data.city_id.toString());
    }
    if (data.specific_location) {
      formData.append("specific_location", data.specific_location);
    }
    if (data.start_date) {
      formData.append("start_date", data.start_date);
    }
    if (data.end_date) {
      formData.append("end_date", data.end_date);
    }
    if (data.execution_date) {
      formData.append("execution_date", data.execution_date);
    }
    if (data.project_value) {
      formData.append("project_value", data.project_value.toString());
    }
    if (data.currency) {
      formData.append("currency", data.currency);
    }
    if (data.display_order) {
      formData.append("display_order", data.display_order.toString());
    }
    if (data.challenges_faced) {
      formData.append("challenges_faced", data.challenges_faced);
    }
    if (data.solutions_provided) {
      formData.append("solutions_provided", data.solutions_provided);
    }

    // Add project features array
    if (data.project_features && data.project_features.length > 0) {
      data.project_features.forEach((feature, index) => {
        formData.append(`project_features[${index}]`, feature);
      });
    }

    // Add project images as files
    if (data.project_images && data.project_images.length > 0) {
      data.project_images.forEach((image) => {
        formData.append(`project_images[]`, image);
      });
    }

    const response = await apiClient.post(this.baseUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // Update an existing achieved project
  async updateAchievedProject(
    id: number,
    data: UpdateAchievedProjectRequest
  ): Promise<AchievedProject> {
    const formData = new FormData();

    // Add text fields
    formData.append("project_name_ar", data.project_name_ar);
    formData.append("project_name_en", data.project_name_en);
    formData.append("description_ar", data.description_ar);
    formData.append("description_en", data.description_en);

    // Add project type
    if (data.project_type_id) {
      formData.append("project_type_id", data.project_type_id.toString());
    }
    if (data.country_id) {
      formData.append("country_id", data.country_id.toString());
    }
    if (data.state_id) {
      formData.append("state_id", data.state_id.toString());
    }
    if (data.city_id) {
      formData.append("city_id", data.city_id.toString());
    }
    if (data.specific_location) {
      formData.append("specific_location", data.specific_location);
    }
    if (data.start_date) {
      formData.append("start_date", data.start_date);
    }
    if (data.end_date) {
      formData.append("end_date", data.end_date);
    }
    if (data.execution_date) {
      formData.append("execution_date", data.execution_date);
    }
    if (data.project_value) {
      formData.append("project_value", data.project_value.toString());
    }
    if (data.currency) {
      formData.append("currency", data.currency);
    }
    if (data.display_order) {
      formData.append("display_order", data.display_order.toString());
    }
    if (data.challenges_faced) {
      formData.append("challenges_faced", data.challenges_faced);
    }
    if (data.solutions_provided) {
      formData.append("solutions_provided", data.solutions_provided);
    }

    // Add project features array
    if (data.project_features && data.project_features.length > 0) {
      data.project_features.forEach((feature, index) => {
        formData.append(`project_features[${index}]`, feature);
      });
    }

    // Add project images as files
    if (data.project_images && data.project_images.length > 0) {
      data.project_images.forEach((image) => {
        formData.append(`project_images[]`, image);
      });
    }

    const response = await apiClient.post(
      `${this.baseUrl}/update/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // Delete an achieved project
  async deleteAchievedProject(
    contractorProjectPrevious: number
  ): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${contractorProjectPrevious}`);
  }

  // Reorder projects (not available in current API)
  // async reorderProjects(projectIds: number[]): Promise<void> {
  //   // Implementation would go here if reorder endpoint becomes available
  //   throw new Error("Reorder not supported by current API");
  // }

  // Fetch project types
  async fetchProjectTypes(): Promise<ProjectType[]> {
    const response = await apiClient.get("/general-data-profile/project-types");
    return response.data.response;
  }
}

export const achievedProjectsApi = new AchievedProjectsApi();
