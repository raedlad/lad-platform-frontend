import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useProjectStore } from "../store/projectStore";
import { projectApi } from "../services/projectApi";
import {
  ProjectClassification,
  ProjectEssentialInfo,
  PublishSettings,
  DocumentFile,
  DocumentsState,
  Project,
  ProjectStatus,
  BOQData,
  UserProject,
  CreateProjectApiResponse,
  UpdateProjectApiResponse,
  ProjectResponse,
} from "../types/project";
import { useProjectsStore } from "../store/ProjectsStore";

interface SubmitResult {
  success: boolean;
  message: string;
}

export const useCreateProject = () => {
  const router = useRouter();
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
    hasBOQDataChanged,
    setOriginalBOQData,
    hasPublishSettingsChanged,
    publishSettings,
    setPublishSettings,
    setProjectStatus,
    project,
    setProject,
    resetProjectCreation,
    isProjectCreationComplete,
    projectStatus,
    boqData,
  } = useProjectStore();

  const {
    addProject,
    updateProject,
    setLoading: setProjectsLoading,
    setError: setProjectsError,
    setProjects,
    projects,
  } = useProjectsStore();

  const submitClassification = useCallback(
    async (data: {
      jobId: number;
      levelId: number;
      workTypeId: number;
      notes?: string;
    }): Promise<SubmitResult> => {
      if (!projectId) {
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
              ?.id ||
            originalClassificationData?.jobId ||
            0,
          workTypeId:
            workTypes?.find((workType) => workType.id === data.workTypeId)
              ?.id ||
            originalClassificationData?.workTypeId ||
            0,
          levelId:
            projectClassificationLevels?.find(
              (level) => level.id === data.levelId
            )?.id ||
            originalClassificationData?.levelId ||
            0,
          notes: data.notes || "",
        };

        const response = shouldCreate
          ? await projectApi.createClassificationProject(
              projectId,
              classificationData
            )
          : await projectApi.updateClassificationProject(
              projectId,
              classificationData
            );

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
          return { success: false, message: response.message || "API Error" };
        }
      } catch (error) {
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
      title: string;
      project_type_id: number;
      city_id: string;
      district: string;
      address_line: string;
      latitude?: number;
      longitude?: number;
      budget_min: number;
      budget_max: number;
      budget_unit: string;
      duration_value: number;
      duration_unit: string;
      area_sqm: number;
      description: string;
    }): Promise<SubmitResult> => {
      if (isLoading) {
        return {
          success: false,
          message: "Submission already in progress",
        };
      }

      try {
        clearError();
        setLoading(true);

        const shouldCreate = !projectId || completedSteps < currentStep;
        const hasChanged = hasEssentialInfoDataChanged(data);

        if (projectId && !shouldCreate && !hasChanged) {
          setCurrentStep(currentStep + 1);
          setLoading(false);
          return {
            success: true,
            message: "No changes detected, navigating to next step",
          };
        }

        if (projectId && !hasChanged && shouldCreate) {
          setCompletedSteps(currentStep);
          setCurrentStep(currentStep + 1);
          setLoading(false);
          return {
            success: true,
            message: "Step completed, navigating to next step",
          };
        }

        const essentialInfoData: ProjectEssentialInfo = {
          title: data.title,
          project_type_id:
            projectTypes?.filter((type) => type.id === data.project_type_id)[0]
              .id || 0,
          city_id: data.city_id,
          district: data.district,
          address_line: data.address_line,
          latitude: data.latitude,
          longitude: data.longitude,
          budget_min: data.budget_min,
          budget_max: data.budget_max,
          budget_unit: data.budget_unit,
          duration_value: data.duration_value,
          duration_unit: data.duration_unit,
          area_sqm: data.area_sqm,
          description: data.description,
        };

        let response: CreateProjectApiResponse | UpdateProjectApiResponse;
        if (shouldCreate) {
          response = await projectApi.createEssentialInfoProject(
            essentialInfoData
          );

          if (response.success && "response" in response && response.response) {
            const projectData: ProjectResponse = response.response;
            const newProjectId = projectData?.id;

            if (!newProjectId) {
              return {
                success: false,
                message: "Project created but no ID returned",
              };
            }

            if (shouldCreate) {
              const projectIdToRedirect = newProjectId.toString();
              router.replace(
                `/dashboard/individual/projects/${projectIdToRedirect}/edit`
              );
              setCompletedSteps(currentStep);
              setCurrentStep(currentStep + 1);
            }

            setProjectId(newProjectId.toString());

            const project: Project = {
              id: newProjectId.toString(),
              essential_info: {
                title: projectData.title,
                project_type_id: parseInt(projectData.project_type_id),
                city_id: "",
                district: "",
                address_line: "",
                budget_min: projectData.budget_min || 0,
                budget_max: projectData.budget_max || 0,
                budget_unit: "",
                duration_value: parseInt(projectData.duration_value),
                duration_unit: projectData.duration_unit,
                area_sqm: projectData.area_sqm,
                description: projectData.description,
              },
              classification: {
                id: 0,
                jobId: 0,
                workTypeId: 0,
                levelId: 0,
                notes: "",
              },
              documents: {
                architectural_plans: [],
                licenses: [],
                specifications: [],
                site_photos: [],
              },
              status: { status: "in_progress" },
              publish_settings: {
                notify_matching_contractors: false,
                notify_client_on_offer: false,
                offers_window_days: 7,
              },
              boq: {
                items: [],
                total_amount: 0,
              },
            };

            setProject(project);

            const userProject: UserProject = {
              project: project,
              created_at: projectData.created_at,
              updated_at: projectData.updated_at,
            };
            addProject(userProject);
          }
        } else {
          if (!projectId) {
            setLoading(false);
            return {
              success: false,
              message: "No project ID available for update",
            };
          }
          response = await projectApi.updateEssentialInfoProject(
            projectId,
            essentialInfoData
          );
          if (response.success) {
            updateProject(projectId, {
              essential_info: essentialInfoData,
            });
          }
        }

        if (response.success) {
          setOriginalEssentialInfoData(essentialInfoData);
          setLoading(false);
          return {
            success: true,
            message: "Essential info saved successfully",
          };
        } else {
          const errorMessage =
            response.message || "Failed to save essential info";
          setLoading(false);
          return { success: false, message: errorMessage };
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "An unexpected error occurred";
        return {
          success: false,
          message: errorMessage,
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
      isLoading,
      router,
      setProject,
      addProject,
      updateProject,
    ]
  );

  const uploadFile = useCallback(
    async (
      file: File,
      collection: string,
      projectId: string
    ): Promise<SubmitResult & { fileId?: string }> => {
      const fileId = `file_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`;

      try {
        const documentFile: DocumentFile = {
          id: fileId,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadStatus: "uploading",
          uploadProgress: 0,
        };

        addDocumentFile(collection as keyof DocumentsState, documentFile);

        const response = await projectApi.uploadFile(
          projectId,
          file,
          collection
        );

        if (response.success && response.data) {
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
    async (
      fileId: string,
      collection: string,
      projectId: string
    ): Promise<SubmitResult> => {
      try {
        const response = await projectApi.removeFile(
          projectId,
          fileId,
          collection
        );

        if (response.success) {
          removeDocumentFile(collection as keyof DocumentsState, fileId);
          return { success: true, message: "File removed successfully" };
        } else {
          return {
            success: false,
            message: response.message || "Failed to remove file from server",
          };
        }
      } catch (error) {
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
    (fileId: string, collection: string): SubmitResult => {
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
    ): Promise<SubmitResult> => {
      try {
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

        if (response.success && response.data) {
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
    }): Promise<SubmitResult> => {
      try {
        clearError();
        setLoading(true);

        if (!projectId) {
          return {
            success: false,
            message: "No project ID available",
          };
        }

        if (completedSteps < currentStep) setCompletedSteps(currentStep);
        if (currentStep < 4) setCurrentStep(currentStep + 1);

        return {
          success: true,
          message: "Documents step completed successfully",
        };
      } catch (error) {
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

  const submitBOQ = useCallback(
    async (data: {
      id?: number;
      items: Array<{
        name: string;
        description: string;
        unit_id: number;
        quantity: number;
        unit_price: number;
        sort_order: number;
        is_required: boolean;
      }>;
      total_amount: number;
      template_id?: number;
    }): Promise<SubmitResult> => {
      try {
        clearError();
        setLoading(true);

        if (!projectId) {
          return {
            success: false,
            message: "No project ID available",
          };
        }

        const shouldCreate = completedSteps < currentStep;
        const hasChanged = hasBOQDataChanged(data);

        if (!shouldCreate && !hasChanged) {
          setCurrentStep(currentStep + 1);
          return {
            success: true,
            message: "No changes detected, navigating to next step",
          };
        }

        const response = shouldCreate
          ? await projectApi.createBOQProject(projectId, data)
          : await projectApi.updateBOQProject(projectId, data);

        if (!response.success) {
          throw new Error(response.message || "Failed to save BOQ");
        }

        if (shouldCreate) {
          setCompletedSteps(currentStep);
          setOriginalBOQData(data);
          setCurrentStep(currentStep + 1);
          return {
            success: true,
            message: "BOQ saved successfully",
          };
        } else {
          setOriginalBOQData(data);
          setCurrentStep(currentStep + 1);
          return {
            success: true,
            message: "BOQ saved successfully",
          };
        }
      } catch (error) {
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
      hasBOQDataChanged,
      setOriginalBOQData,
    ]
  );

  const submitPublishSettings = useCallback(
    async (data: {
      notify_matching_contractors: boolean;
      notify_client_on_offer: boolean;
      offers_window_days: number;
    }): Promise<SubmitResult> => {
      try {
        clearError();
        setLoading(true);

        if (!projectId) {
          return {
            success: false,
            message: "No project ID available",
          };
        }

        const shouldCreate = completedSteps < currentStep;
        const hasChanged = hasPublishSettingsChanged(data);

        if (projectId && !shouldCreate && !hasChanged) {
          setCurrentStep(currentStep + 1);
          return {
            success: true,
            message: "No changes detected, navigating to next step",
          };
        }

        const publishSettingsData: PublishSettings = {
          notify_matching_contractors: data.notify_matching_contractors,
          notify_client_on_offer: data.notify_client_on_offer,
          offers_window_days: data.offers_window_days,
        };

        const response = await projectApi.handlePublishSettingsProject(
          projectId,
          publishSettingsData
        );

        if (response.success) {
          setPublishSettings(publishSettingsData);
          setCompletedSteps(currentStep);
          setCurrentStep(currentStep + 1);
          return {
            success: true,
            message: "Publish Settings step completed successfully",
          };
        } else {
          return {
            success: false,
            message: response.message || "Failed to save publish settings",
          };
        }
      } catch (error) {
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
      clearError,
      setLoading,
      setCompletedSteps,
      setCurrentStep,
      setPublishSettings,
      hasPublishSettingsChanged,
      projectId,
      completedSteps,
      currentStep,
    ]
  );

  const submitSendProjectToReview =
    useCallback(async (): Promise<SubmitResult> => {
      try {
        clearError();
        setLoading(true);

        if (!projectId) {
          return {
            success: false,
            message: "No project ID available",
          };
        }

        const newProject: Project = {
          id: projectId,
          essential_info: originalEssentialInfoData as ProjectEssentialInfo,
          classification: originalClassificationData as ProjectClassification,
          documents: documents as DocumentsState,
          status: projectStatus as ProjectStatus,
          publish_settings: publishSettings as PublishSettings,
          boq: boqData as BOQData,
        };

        const response = await projectApi.handleSendProjectToReview(projectId);

        if (response.success) {
          setProjectStatus({ status: "review_pending" });
          updateProject(projectId, { status: { status: "review_pending" } });

          setProjects([
            ...projects,
            {
              project: newProject,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ]);
          setCompletedSteps(currentStep);

          resetProjectCreation();

          return {
            success: true,
            message: "Project sent to review successfully",
          };
        }

        return {
          success: false,
          message: response.message || "Failed to send project to review",
        };
      } catch (error) {
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
    }, [
      projectId,
      clearError,
      setLoading,
      setProjectStatus,
      updateProject,
      setCompletedSteps,
      currentStep,
      resetProjectCreation,
      originalEssentialInfoData,
      originalClassificationData,
      documents,
      projectStatus,
      publishSettings,
      boqData,
      setProjects,
      projects,
    ]);

  const getCurrentProject = useCallback(() => {
    return project;
  }, [project]);

  const isProjectComplete = useCallback(() => {
    return isProjectCreationComplete();
  }, [isProjectCreationComplete]);

  return {
    error,
    loading: isLoading,
    project,
    projectId,
    currentStep,
    completedSteps,
    isProjectComplete,
    getCurrentProject,
    submitClassification,
    submitEssentialInfo,
    submitDocuments,
    submitBOQ,
    submitPublishSettings,
    uploadFile,
    removeFile,
    removeFileLocal,
    reuploadFile,
    documents,
    publishSettings,
    submitSendProjectToReview,
    resetProjectCreation,
  };
};
