import { api } from "@/lib/api";
import {
  ProjectClassification,
  ProjectDocuments,
  ProjectEssentialInfo,
} from "../types/project";

export const projectApi = {
  getProject: async (projectId: string) => {
    try {
      const response = await api.get(`/projects/owner/${projectId}`);
      return response.data;
    } catch (error) {
      console.log("Error getting project:", error);
      return {
        success: false,
        message: "Error getting project",
        data: null,
      };
    }
  },
  getProjectTypes: async () => {
    try {
      const response = await api.get("general-data-profile/project-types");

      return response.data;
    } catch (error) {
      console.log("Error getting project types:", error);
      return {
        success: false,
        message: "Error getting project types",
        data: null,
      };
    }
  },
  getWorkTypes: async () => {
    try {
      const response = await api.get("general-data-profile/work-types");
      return response.data;
    } catch (error) {
      console.log("Error getting work types:", error);
      return {
        success: false,
        message: "Error getting work types",
        data: null,
      };
    }
  },
  getProjectClassificationJobs: async () => {
    try {
      const response = await api.get(
        "/general-data-profile/classification-jobs"
      );
      return response.data;
    } catch (error) {
      console.log("Error getting project classification jobs:", error);
      return {
        success: false,
        message: "Error getting project classification jobs",
        data: null,
      };
    }
  },

  getProjectClassificationLevels: async () => {
    try {
      const response = await api.get(
        "/general-data-profile/classification-levels"
      );
      return response.data;
    } catch (error) {
      console.log("Error getting project classifications:", error);
      return {
        success: false,
        message: "Error getting project classifications",
        data: null,
      };
    }
  },

  createEssentialInfoProject: async (data: ProjectEssentialInfo) => {
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          const projectId = `proj_${Date.now()}`; // Generate a unique project ID
          resolve({
            success: true,
            message: "Project created successfully",
            data: {
              projectId,
              essentialInfo: {
                ...data,
                id: Date.now(), // mock essential info ID
              },
            },
          });
        }, 2000); // 2 seconds
      });

      return response;
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },
  updateEssentialInfoProject: async (
    projectId: string,
    data: ProjectEssentialInfo
  ) => {
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Fake project created successfully",
            data: {
              ...data,
              id: Date.now(), // mock ID
            },
          });
        }, 3000); // 3 seconds
      });

      return response;
    } catch (error) {
      console.error("Error updating project essential info:", error);
      throw error;
    }
  },
  createClassificationProject: async (
    projectId: string,
    data: ProjectClassification
  ) => {
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Fake project created successfully",
            data: {
              ...data,
              id: Date.now(), // mock ID
            },
          });
        }, 3000); // 3 seconds
      });

      return response;
    } catch (error) {
      console.error("Error creating project classification:", error);
      throw error;
    }
  },
  updateClassificationProject: async (
    projectId: string,
    data: ProjectClassification
  ) => {
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Fake project created successfully",
            data: {
              ...data,
              id: Date.now(), // mock ID
            },
          });
        }, 3000); // 3 seconds
      });

      return response;
    } catch (error) {
      console.error("Error updating project classification:", error);
      throw error;
    }
  },
  updateDocumentsProject: async (projectId: string, data: ProjectDocuments) => {
    try {
      const response = await new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            success: true,
            message: "Fake project created successfully",
            data: {
              ...data,
              id: Date.now(), // mock ID
            },
          });
        }, 3000); // 3 seconds
      });

      return response;
    } catch (error) {
      console.error("Error updating project documents:", error);
      throw error;
    }
  },
  createDocumentsProject: async (projectId: string, data: ProjectDocuments) => {
    try {
      const response = await api.post(
        `/projects/owner/${projectId}/documents`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Error creating project documents:", error);
      throw error;
    }
  },
};
