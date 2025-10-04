import { api } from "@/lib/api";
import {
  BOQData,
  ProjectClassification,
  DocumentsState,
  ProjectEssentialInfo,
  PublishSettings,
  GetProjectApiResponse,
  ApiResponse,
  PaginatedApiResponse,
  ProjectResponse,
  BOQTemplate,
  Unit,
  UploadFileResponse,
  RemoveFileResponse,
  CreateProjectApiResponse,
  UpdateProjectApiResponse,
} from "../types/project";

export const projectApi = {
  getProject: async (projectId: string): Promise<GetProjectApiResponse> => {
    try {
      const response = await api.get(`/projects/owner/${projectId}`);
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Error getting project",
        response: null,
      };
    }
  },

  getUserProjects: async (params?: {
    status?: string;
    per_page?: number;
    page?: number;
  }): Promise<PaginatedApiResponse<ProjectResponse>> => {
    try {
      const queryParams = new URLSearchParams();

      if (params?.status) {
        queryParams.append("status", params.status);
      }

      if (params?.per_page) {
        queryParams.append("per_page", params.per_page.toString());
      }

      if (params?.page) {
        queryParams.append("page", params.page.toString());
      }

      const queryString = queryParams.toString();
      const url = `/projects/owner${queryString ? `?${queryString}` : ""}`;

      const response = await api.get(url);
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : error instanceof Error
          ? error.message
          : "Failed to get user projects";

      return {
        success: false,
        message: errorMessage,
        response: {
          data: [],
          total: 0,
          per_page: 0,
          current_page: 1,
          last_page: 1,
          from: 0,
          to: 0,
          links: [],
        },
      };
    }
  },
  getProjectTypes: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get("general-data-profile/project-types");
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error getting project types",
      };
    }
  },
  getWorkTypes: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get("general-data-profile/work-types");
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Error getting work types",
      };
    }
  },
  getProjectClassificationJobs: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get(
        "/general-data-profile/classification-jobs"
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error getting project classification jobs",
      };
    }
  },

  getProjectClassificationLevels: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get(
        "/general-data-profile/classification-levels"
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error getting project classifications",
      };
    }
  },

  getBoqTemplates: async (): Promise<ApiResponse<BOQTemplate[]>> => {
    try {
      const response = await api.get("/general-data-profile/boq-templates");
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error getting BOQ templates",
        response: [],
      };
    }
  },

  getBoqTemplateById: async (
    templateId: number
  ): Promise<ApiResponse<BOQTemplate>> => {
    try {
      const response = await api.get(
        `/general-data-profile/boq-templates/${templateId}`
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Error getting BOQ template",
        response: undefined,
      };
    }
  },

  getBoqTemplateItems: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get(
        "/general-data-profile/boq-template-items"
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error getting BOQ template items",
        response: [],
      };
    }
  },

  getBoqUnits: async (): Promise<ApiResponse<Unit[]>> => {
    try {
      const response = await api.get("/general-data-profile/boq-units");
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error getting units",
        response: [],
      };
    }
  },

  createEssentialInfoProject: async (
    data: ProjectEssentialInfo
  ): Promise<CreateProjectApiResponse> => {
    try {
      const response = await api.post("/projects/owner", data);
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : error instanceof Error
          ? error.message
          : "Failed to create project";

      return {
        success: false,
        message: errorMessage,
        response: null,
      };
    }
  },
  updateEssentialInfoProject: async (
    projectId: string,
    data: ProjectEssentialInfo
  ): Promise<UpdateProjectApiResponse> => {
    try {
      const response = await api.patch(`/projects/owner/${projectId}`, data);
      return {
        success: true,
        message: "Essential info updated successfully",
        data: response.data,
      };
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : error instanceof Error
          ? error.message
          : "Failed to update essential info";

      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  },
  createClassificationProject: async (
    projectId: string,
    data: ProjectClassification
  ): Promise<ApiResponse> => {
    try {
      const requestData = {
        classification_job_id: data.jobId,
        classification_level_id: data.levelId,
        work_type_id: data.workTypeId,
        notes: data.notes || "",
      };

      const response = await api.post(
        `/projects/owner/${projectId}/classification`,
        requestData
      );

      return {
        success: true,
        message: "Classification created successfully",
        data: response.data,
      };
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : error instanceof Error
          ? error.message
          : "Failed to create classification";

      return {
        success: false,
        message: errorMessage,
      };
    }
  },
  updateClassificationProject: async (
    projectId: string,
    data: ProjectClassification
  ): Promise<ApiResponse> => {
    try {
      const requestData = {
        classification_job_id: data.jobId,
        classification_level_id: data.levelId,
        work_type_id: data.workTypeId,
        notes: data.notes || "",
      };

      const response = await api.put(
        `/projects/owner/classification/${projectId}`,
        requestData
      );

      return {
        success: true,
        message: "Classification updated successfully",
        data: response.data,
      };
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : error instanceof Error
          ? error.message
          : "Failed to update classification";

      return {
        success: false,
        message: errorMessage,
      };
    }
  },
  updateDocumentsProject: async (
    projectId: string,
    data: DocumentsState
  ): Promise<ApiResponse> => {
    try {
      const response = await new Promise<ApiResponse>((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Documents updated successfully",
            data: {
              ...data,
              id: Date.now(),
            },
          });
        }, 3000);
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
  createDocumentsProject: async (
    projectId: string,
    data: DocumentsState
  ): Promise<ApiResponse> => {
    try {
      const response = await api.post(
        `/projects/owner/${projectId}/documents`,
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Fake API methods for file operations
  uploadFile: async (
    projectId: string,
    file: File,
    collection: string
  ): Promise<UploadFileResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("collection", collection);

      const response = await api.post(
        `/projects/owner/${projectId}/files/upload-single`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        success: true,
        message: "File uploaded successfully",
        data: response.data,
      };
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : error instanceof Error
          ? error.message
          : "Failed to upload file";

      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  },

  removeFile: async (
    projectId: string,
    fileId: string,
    collection: string
  ): Promise<RemoveFileResponse> => {
    try {
      const response = await api.delete(
        `/projects/owner/${projectId}/files/${fileId}`,
        {
          data: {
            collection,
          },
        }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error removing file",
      };
    }
  },

  reuploadFile: async (
    projectId: string,
    fileId: string,
    newFile: File,
    collection: string
  ): Promise<UploadFileResponse> => {
    try {
      const response = await api.post(
        `/projects/owner/${projectId}/files/upload-single`,
        {
          file: newFile,
          collection: collection,
        }
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        data: null,
        message:
          error instanceof Error ? error.message : "Error reuploading file",
      };
    }
  },

  createBOQProject: async (
    projectId: string,
    data: BOQData
  ): Promise<ApiResponse> => {
    try {
      const apiBOQData = {
        source: "manual",
        total_expected: data.total_amount,
        items: data.items.map((item) => ({
          name: item.name,
          description: item.description,
          unit_id: item.unit_id.toString(),
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_total: item.quantity * item.unit_price,
          sort_order: item.sort_order,
          is_required: item.is_required,
        })),
      };

      const response = await api.post(
        `/projects/${projectId}/boq/manual-with-items`,
        apiBOQData
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create BOQ",
      };
    }
  },
  updateBOQProject: async (
    projectId: string,
    data: BOQData
  ): Promise<ApiResponse> => {
    try {
      const apiBOQData = {
        source: "manual",
        total_expected: data.total_amount,
        items: data.items.map((item) => ({
          name: item.name,
          description: item.description,
          unit_id: item.unit_id.toString(),
          quantity: item.quantity,
          unit_price: item.unit_price,
          line_total: item.quantity * item.unit_price,
          sort_order: item.sort_order,
          is_required: item.is_required,
        })),
      };

      const response = await api.put(
        `/project-boqs/${projectId}/manual-with-items`,
        apiBOQData
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update BOQ",
      };
    }
  },
  handlePublishSettingsProject: async (
    projectId: string,
    data: PublishSettings
  ): Promise<ApiResponse> => {
    try {
      const response = await api.post(
        `/projects/${projectId}/publishing-settings`,
        data
      );
      return response.data;
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to save publish settings",
      };
    }
  },
  handleSendProjectToReview: async (
    projectId: string
  ): Promise<ApiResponse> => {
    try {
      const response = await api.post(`/projects/${projectId}/review-requests`);
      return response.data;
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "data" in error.response &&
        error.response.data &&
        typeof error.response.data === "object" &&
        "message" in error.response.data
          ? String(error.response.data.message)
          : error instanceof Error
          ? error.message
          : "Failed to send project to review";

      return {
        success: false,
        message: errorMessage,
      };
    }
  },
};
