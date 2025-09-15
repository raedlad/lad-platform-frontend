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

  // Fake API methods for file operations
  uploadFile: async (projectId: string, file: File, collection: string) => {
    try {
      //   const response = await api.post(
      //     `/projects/owner/${projectId}/files/upload-single`,
      //     {
      //       file,
      //       collection: collection,
      //     }
      //   );
      //   return response.data;
      return new Promise<{ success: boolean; data: any; message: string }>(
        (resolve) => {
          const interval = setInterval(() => {
            clearInterval(interval);
            // Simulate successful upload
            resolve({
              success: true,
              data: {
                fileId: `file_${projectId}_${Date.now()}_${Math.random()
                  .toString(36)
                  .substr(2, 9)}`,
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type,
                collection: collection,
                url: `https://fake-cdn.com/uploads/${collection}/${file.name}`,
              },
              message: "File uploaded successfully",
            });
          }, 2000); // Simulate 2 second upload delay
        }
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      return {
        success: false,
        data: null,
        message: "Error uploading file",
      };
    }
  },

  removeFile: async (projectId: string, fileId: string, collection: string) => {
    try {
      // return new Promise<{ success: boolean; message: string }>((resolve) => {
      //   setTimeout(() => {
      //     resolve({
      //       success: true,
      //       message: "File removed successfully",
      //     });
      //   }, 1000); // Simulate API delay
      // });
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
      console.error("Error removing file:", error);
      return {
        success: false,
        message: "Error removing file",
      };
    }
  },

  reuploadFile: async (
    projectId: string,
    fileId: string,
    newFile: File,
    collection: string
  ) => {
    try {
      const response = await api.post(
        `/projects/owner/${projectId}/files/upload-single`,
        {
          file: newFile,
          collection: collection,
        }
      );
      return response.data;
      // return new Promise<{ success: boolean; data: any; message: string }>(
      //   (resolve) => {
      //     const interval = setInterval(() => {
      //       clearInterval(interval);
      //       // Simulate successful reupload
      //       resolve({
      //         success: true,
      //         data: {
      //           fileId: fileId, // Keep same ID for reupload
      //           fileName: newFile.name,
      //           fileSize: newFile.size,
      //           fileType: newFile.type,
      //           collection: collection,
      //           url: `https://fake-cdn.com/uploads/${collection}/${
      //             newFile.name
      //           }?updated=${Date.now()}`,
      //         },
      //         message: "File reuploaded successfully",
      //       });
      //     }, 1500); // Slightly faster for reupload (1.5 seconds)
      //   }
      // );
    } catch (error) {
      console.error("Error reuploading file:", error);
      return {
        success: false,
        data: null,
        message: "Error reuploading file",
      };
    }
  },
};
