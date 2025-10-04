"use client";
import React, { useEffect, useRef } from "react";
import CreateProjectWrapper from "./CreateProjectWrapper";
import CreateProjectProgress from "./CreateProjectProgress";
import { useProjectStore } from "../../store/projectStore";
import { useProjectData } from "../../hooks/useProjectData";
import EssentialInfoForm from "./forms/EssentialInfoForm";
import ClassificationForm from "./forms/ClassificationForm";
import BOQForm from "./forms/BOQForm";
import DocumentsForm from "./forms/DocumentsForm";
import ProjectOverviewForm from "./forms/ProjectOverviewForm";
import PublishSettingsForm from "./forms/PublishSettingsForm";

const CreateProject = ({ projectId }: { projectId?: string }) => {
  const currentStep = useProjectStore((state) => state.currentStep);
  const completedSteps = useProjectStore((state) => state.completedSteps);
  const isLoadingProjectData = useProjectStore(
    (state) => state.isLoadingProjectData
  );
  const canAccessStep = useProjectStore((state) => state.canAccessStep);
  const setCurrentStep = useProjectStore((state) => state.setCurrentStep);
  const setCompletedSteps = useProjectStore((state) => state.setCompletedSteps);
  const { fetchProjectData } = useProjectData();
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!projectId) {
      setCurrentStep(1);
      setCompletedSteps(0);
      hasLoadedRef.current = false;
      return;
    }

    if (hasLoadedRef.current) {
      return;
    }

    const loadProject = async () => {
      hasLoadedRef.current = true;

      try {
        // fetchProjectData handles everything:
        // - Fetches project data from API
        // - Calculates completed steps
        // - Sets currentStep and completedSteps in store
        // - Sets all project data
        await fetchProjectData(projectId);
      } catch (error) {
        console.error("Error loading project:", error);
        hasLoadedRef.current = false;
      }
    };

    loadProject();
  }, [projectId]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      hasLoadedRef.current = false;
    };
  }, []);

  const renderStep = () => {
    if (!canAccessStep(currentStep)) {
      const nextAvailableStep = completedSteps + 1;
      setCurrentStep(nextAvailableStep);
      return null;
    }

    switch (currentStep) {
      case 1:
        return <EssentialInfoForm create={!projectId} />;
      case 2:
        return <ClassificationForm />;
      case 3:
        return <DocumentsForm />;
      case 4:
        return <BOQForm />;
      case 5:
        return <PublishSettingsForm />;
      case 6:
        return <ProjectOverviewForm />;
      default:
        return <EssentialInfoForm create={!projectId} />;
    }
  };
  if (isLoadingProjectData) {
    return (
      <CreateProjectWrapper>
        <CreateProjectProgress />
        <div className="w-full border border-design-tertiary rounded-md p-4 md:p-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-design-main mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading project data...</p>
            </div>
          </div>
        </div>
      </CreateProjectWrapper>
    );
  }

  return (
    <CreateProjectWrapper>
      <CreateProjectProgress />
      <div className="w-full border border-design-tertiary rounded-md p-4 md:p-6 max-w-3xl mx-auto">
        {renderStep()}
      </div>
    </CreateProjectWrapper>
  );
};

export default CreateProject;
