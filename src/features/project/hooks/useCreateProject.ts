import { useCallback } from "react";
import { useProjectStore } from "../store/projectStore";
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
          job:
            projectClassificationJobs?.find((job) => job.id === data.jobId) ||
            originalClassificationData?.job!,
          workType:
            workTypes?.find((workType) => workType.id === data.workTypeId) ||
            originalClassificationData?.workType!,
          level:
            projectClassificationLevels?.find(
              (level) => level.id === data.levelId
            ) || originalClassificationData?.level!,
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
          type: projectTypes?.filter((type) => type.id === data.type) || [],
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

  return {
    error,
    submitClassification,
    submitEssentialInfo,
  };
};
