import { useCallback, useEffect, useRef } from "react";
import { useProjectStore } from "../store/projectStore";
import { projectApi } from "../services/projectApi";

export const useProjectData = () => {
  const {
    projectId,
    originalEssentialInfoData,
    originalClassificationData,
    setOriginalEssentialInfoData,
    setOriginalClassificationData,
    setLoading,
    isLoading,
    currentStep,
    completedSteps,
  } = useProjectStore();

  // Track if we've already loaded data for this project to prevent unnecessary loads
  const loadedProjectIdRef = useRef<string | null>(null);

  const loadAllProjectData = useCallback(async () => {
    // If no projectId, this is the first step - no need to load existing data
    if (!projectId) {
      return {
        success: true,
        message: "No existing project to load data from",
      };
    }

    // Check if we've already loaded data for this project
    if (loadedProjectIdRef.current === projectId) {
      console.log("📦 Data already loaded for this project:", projectId);
      return {
        success: true,
        message: "Project data already loaded for this project",
      };
    }

    // Only load data when:
    // 1. We're creating (completedSteps < currentStep) - first time through
    // 2. We're editing an existing project (completedSteps >= currentStep) but don't have data yet
    const isCreating = completedSteps < currentStep;
    const isEditingWithoutData =
      completedSteps >= currentStep &&
      (!originalEssentialInfoData || !originalClassificationData);

    if (!isCreating && !isEditingWithoutData) {
      console.log(
        "📦 Using cached project data from store - no need to reload"
      );
      console.log("📊 Data status:", {
        isCreating,
        isEditingWithoutData,
        hasEssentialInfo: !!originalEssentialInfoData,
        hasClassification: !!originalClassificationData,
        completedSteps,
        currentStep,
      });
      return {
        success: true,
        message: "Project data already loaded from store",
      };
    }

    try {
      setLoading(true);
      console.log("🌐 Loading all project data from API...");

      // Load all project data in one API call
      const projectResponse = await projectApi.getProject(projectId);

      if (projectResponse.success && projectResponse.data) {
        // Set essential info data if available
        if (projectResponse.data.essential_info) {
          setOriginalEssentialInfoData(projectResponse.data.essential_info);
          console.log("✅ Essential info data loaded");
        }

        // Set classification data if available
        if (projectResponse.data.classification?.[0]) {
          setOriginalClassificationData(projectResponse.data.classification[0]);
          console.log("✅ Classification data loaded");
        }

        // Mark this project as loaded
        loadedProjectIdRef.current = projectId;

        return {
          success: true,
          message: "All project data loaded successfully",
          data: {
            essentialInfo: projectResponse.data.essential_info,
            classification: projectResponse.data.classification?.[0],
          },
        };
      }

      return {
        success: true,
        message: "No existing project data found",
      };
    } catch (error) {
      console.error("Error loading project data:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load project data",
      };
    } finally {
      setLoading(false);
    }
  }, [
    projectId,
    originalEssentialInfoData,
    originalClassificationData,
    setLoading,
    setOriginalEssentialInfoData,
    setOriginalClassificationData,
  ]);

  // Reset loaded project ref when projectId changes
  useEffect(() => {
    if (projectId !== loadedProjectIdRef.current) {
      loadedProjectIdRef.current = null;
    }
  }, [projectId]);

  // Auto-load data when:
  // 1. ProjectId changes (new project selected)
  // 2. We're creating and don't have data yet
  // 3. We're editing and don't have data yet
  useEffect(() => {
    console.log("🔍 useProjectData useEffect triggered:", {
      projectId,
      completedSteps,
      currentStep,
      hasEssentialInfo: !!originalEssentialInfoData,
      hasClassification: !!originalClassificationData,
      loadedProjectId: loadedProjectIdRef.current,
    });

    const loadData = async () => {
      if (projectId) {
        const isCreating = completedSteps < currentStep;
        const isEditingWithoutData =
          completedSteps >= currentStep &&
          (!originalEssentialInfoData || !originalClassificationData);

        console.log("🔍 Loading conditions:", {
          isCreating,
          isEditingWithoutData,
          shouldLoad: isCreating || isEditingWithoutData,
        });

        if (isCreating || isEditingWithoutData) {
          console.log("🔄 Auto-loading project data:", {
            isCreating,
            isEditingWithoutData,
            completedSteps,
            currentStep,
          });
          await loadAllProjectData();
        } else {
          console.log("⏭️ Skipping data load - data already available");
        }
      } else {
        console.log("⏭️ No projectId - skipping data load");
      }
    };

    loadData();
  }, [projectId, completedSteps, currentStep]);

  // Function to manually load data when a project is selected
  const loadProjectData = useCallback(
    async (selectedProjectId: string) => {
      console.log(
        "🎯 Manually loading data for selected project:",
        selectedProjectId
      );
      // This would be called when a user selects an existing project
      // For now, we'll just call the existing function
      return loadAllProjectData();
    },
    [loadAllProjectData]
  );

  return {
    loadAllProjectData,
    loadProjectData,
    isLoading,
  };
};
