import { useCallback } from "react";
import {
  useProjectStore,
  DocumentFile,
  DocumentsState,
} from "../store/projectStore";
import { projectApi } from "../services/projectApi";
import { ProjectClassification, ProjectEssentialInfo } from "../types/project";

export const useCreateProject = () => {
  const {
    isLoading,
    error,
    clearError,
    setLoading,
    projectId,
    setProjectId,
    currentStep,
    completedSteps,
    setCurrentStep,
    setCompletedSteps,
    hasClassificationDataChanged,
    originalClassificationData,
    setOriginalClassificationData,
    projectClassificationJobs,
    projectClassificationLevels,
    workTypes,
    hasEssentialInfoDataChanged,
    originalEssentialInfoData,
    setOriginalEssentialInfoData,
    projectTypes,
    documents,
    addDocumentFile,
    updateDocumentFile,
    removeDocumentFile,
  } = useProjectStore();

  const submitClassification = useCallback(
    async (data: {
      jobId: number;
      levelId: number;
      workTypeId: number;
      notes?: string;
    }) => {
      if (!projectId) {
        console.error("No project ID available");
        return { success: false, message: "No project ID available" };
      }

      try {
        clearError();
        setLoading(true);

        const shouldCreate = completedSteps < currentStep;
        const hasChanged = hasClassificationDataChanged(data);

        if (!shouldCreate && !hasChanged) {
          setCurrentStep(currentStep + 1);
          return {
            success: true,
            message: "No changes detected, navigating to next step",
          };
        }

        const classificationData: ProjectClassification = {
          id: originalClassificationData?.id || 0,
          jobId:
            projectClassificationJobs?.find((job) => job.id === data.jobId)
              ?.id || originalClassificationData?.jobId!,
          workTypeId:
            workTypes?.find((workType) => workType.id === data.workTypeId)
              ?.id || originalClassificationData?.workTypeId!,
          levelId:
            projectClassificationLevels?.find(
              (level) => level.id === data.levelId
            )?.id || originalClassificationData?.levelId!,
          notes: data.notes || "",
        };

        let response: any;
        if (shouldCreate) {
          response = await projectApi.createClassificationProject(
            projectId,
            classificationData
          );
        } else {
          response = await projectApi.updateClassificationProject(
            projectId,
            classificationData
          );
        }

        if (response.success) {
          setOriginalClassificationData(classificationData);

          if (shouldCreate) {
            setCompletedSteps(currentStep);
          }

          setCurrentStep(currentStep + 1);

          return {
            success: true,
            message: "Classification saved successfully",
          };
        } else {
          console.error("API Error:", response.message);
          return { success: false, message: response.message || "API Error" };
        }
      } catch (error) {
        console.error("❌ Error:", error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        };
      } finally {
        setLoading(false);
      }
    },
    [
      projectId,
      completedSteps,
      currentStep,
      hasClassificationDataChanged,
      originalClassificationData,
      projectClassificationJobs,
      projectClassificationLevels,
      workTypes,
      clearError,
      setLoading,
      setOriginalClassificationData,
      setCompletedSteps,
      setCurrentStep,
    ]
  );

  const submitEssentialInfo = useCallback(
    async (data: {
      name: string;
      type: number;
      city: string;
      district: string;
      location: string;
      budget: number;
      budget_unit: string;
      duration: number;
      duration_unit: string;
      area_sqm: number;
      description: string;
    }) => {
      try {
        clearError();
        setLoading(true);

        const shouldCreate = !projectId || completedSteps < currentStep;
        const hasChanged = hasEssentialInfoDataChanged(data);

        console.log("🔍 Essential Info Debug:", {
          projectId,
          shouldCreate,
          hasChanged,
          completedSteps,
          currentStep,
        });

        if (projectId && !shouldCreate && !hasChanged) {
          setCurrentStep(currentStep + 1);
          return {
            success: true,
            message: "No changes detected, navigating to next step",
          };
        }

        const essentialInfoData: ProjectEssentialInfo = {
          name: data.name,
          type:
            projectTypes?.filter((type) => type.id === data.type)[0].id || 0,
          city: data.city,
          district: data.district,
          location: data.location,
          budget: data.budget,
          budget_unit: data.budget_unit,
          duration: data.duration,
          duration_unit: data.duration_unit,
          area_sqm: data.area_sqm,
          description: data.description,
        };

        let response: any;
        if (shouldCreate) {
          response = await projectApi.createEssentialInfoProject(
            essentialInfoData
          );
          if (response.success && response.data?.projectId) {
            setProjectId(response.data.projectId);
            // Note: loadAllProjectData will be called by the forms when they detect the new projectId
          }
        } else {
          if (!projectId) {
            return {
              success: false,
              message: "No project ID available for update",
            };
          }
          response = await projectApi.updateEssentialInfoProject(
            projectId,
            essentialInfoData
          );
        }

        if (response.success) {
          setOriginalEssentialInfoData(essentialInfoData);
          if (shouldCreate) {
            setCompletedSteps(currentStep);
          }
          setCurrentStep(currentStep + 1);

          return {
            success: true,
            message: "Essential info saved successfully",
          };
        } else {
          console.error("API Error:", response.message);
          return { success: false, message: response.message || "API Error" };
        }
      } catch (error) {
        console.error("❌ Error:", error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        };
      } finally {
        setLoading(false);
      }
    },
    [
      projectId,
      setProjectId,
      completedSteps,
      currentStep,
      hasEssentialInfoDataChanged,
      originalEssentialInfoData,
      projectTypes,
      clearError,
      setLoading,
      setOriginalEssentialInfoData,
      setCompletedSteps,
      setCurrentStep,
    ]
  );

  const uploadFile = useCallback(
    async (file: File, collection: string, projectId: string) => {
      const fileId = `file_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      try {
        // Create document file object
        const documentFile: DocumentFile = {
          id: fileId,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadStatus: "uploading",
          uploadProgress: 0,
        };

        // Add to store immediately with pending status
        addDocumentFile(collection as keyof DocumentsState, documentFile);

        // Upload the file
        const response = await projectApi.uploadFile(
          projectId,
          file,
          collection
        );

        if (response.success) {
          updateDocumentFile(collection as keyof DocumentsState, fileId, {
            uploadStatus: "completed",
            uploadProgress: 100,
            url: response.data.url,
          });
          return {
            success: true,
            message: "File uploaded successfully",
            fileId,
          };
        } else {
          updateDocumentFile(collection as keyof DocumentsState, fileId, {
            uploadStatus: "error",
            error: response.message,
          });
          return { success: false, message: response.message };
        }
      } catch (error) {
        updateDocumentFile(collection as keyof DocumentsState, fileId, {
          uploadStatus: "error",
          error: error instanceof Error ? error.message : "Upload failed",
        });
        return {
          success: false,
          message: error instanceof Error ? error.message : "Upload failed",
        };
      }
    },
    [addDocumentFile, updateDocumentFile]
  );

  const removeFile = useCallback(
    async (fileId: string, collection: string, projectId: string) => {
      try {
        const response = await projectApi.removeFile(
          projectId,
          fileId,
          collection
        );

        if (response.success) {
          // Only remove from local state after successful API call
          removeDocumentFile(collection as keyof DocumentsState, fileId);
          return { success: true, message: "File removed successfully" };
        } else {
          return {
            success: false,
            message: response.message || "Failed to remove file from server",
          };
        }
      } catch (error) {
        console.error("API Error removing file:", error);
        return {
          success: false,
          message:
            error instanceof Error ? error.message : "Network error occurred",
        };
      }
    },
    [removeDocumentFile]
  );

  const removeFileLocal = useCallback(
    (fileId: string, collection: string) => {
      removeDocumentFile(collection as keyof DocumentsState, fileId);
      return { success: true, message: "File removed from local state" };
    },
    [removeDocumentFile]
  );

  const reuploadFile = useCallback(
    async (
      fileId: string,
      newFile: File,
      collection: string,
      projectId: string
    ) => {
      try {
        // Update file status to uploading
        updateDocumentFile(collection as keyof DocumentsState, fileId, {
          uploadStatus: "uploading",
          uploadProgress: 0,
          error: undefined,
        });

        const response = await projectApi.reuploadFile(
          projectId,
          fileId,
          newFile,
          collection
        );

        if (response.success) {
          updateDocumentFile(collection as keyof DocumentsState, fileId, {
            file: newFile,
            name: newFile.name,
            size: newFile.size,
            type: newFile.type,
            uploadStatus: "completed",
            uploadProgress: 100,
            url: response.data.url,
          });
          return { success: true, message: "File reuploaded successfully" };
        } else {
          updateDocumentFile(collection as keyof DocumentsState, fileId, {
            uploadStatus: "error",
            error: response.message,
          });
          return { success: false, message: response.message };
        }
      } catch (error) {
        updateDocumentFile(collection as keyof DocumentsState, fileId, {
          uploadStatus: "error",
          error: error instanceof Error ? error.message : "Reupload failed",
        });
        return {
          success: false,
          message: error instanceof Error ? error.message : "Reupload failed",
        };
      }
    },
    [updateDocumentFile]
  );

  const submitDocuments = useCallback(
    async (data: {
      architectural_plans: File[];
      licenses: File[];
      specifications: File[];
      site_photos: File[];
    }) => {
      try {
        clearError();
        setLoading(true);
        console.log("🔍 Documents Debug:", {
          projectId,
          completedSteps,
          currentStep,
          documentsData: data,
        });
        if (!projectId) {
          return {
            success: false,
            message: "No project ID available",
          };
        }
        if (completedSteps < currentStep) setCompletedSteps(currentStep);
        if (currentStep < 4) setCurrentStep(currentStep + 1);
        console.log("Documents step completed successfully", currentStep);
        return {
          success: true,
          message: "Documents step completed successfully",
        };
      } catch (error) {
        console.error("❌ Error:", error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred",
        };
      } finally {
        setLoading(false);
      }
    },
    [
      projectId,
      completedSteps,
      currentStep,
      clearError,
      setLoading,
      setCompletedSteps,
      setCurrentStep,
    ]
  );

  return {
    error,
    loading: isLoading,
    submitClassification,
    submitEssentialInfo,
    submitDocuments,
    uploadFile,
    removeFile,
    removeFileLocal,
    reuploadFile,
    documents,
  };
};
