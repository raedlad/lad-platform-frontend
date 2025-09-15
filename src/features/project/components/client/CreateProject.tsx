"use client";
import React, { useEffect } from "react";
import CreateProjectWrapper from "./CreateProjectWrapper";
import CreateProjectProgress from "./CreateProjectProgress";
import { useProjectStore } from "../../store/projectStore";
import { useProjectData } from "../../hooks/useProjectData";
import EssentialInfoForm from "./forms/EssentialInfoForm";
import ClassificationForm from "./forms/ClassificationForm";
import BOQForm from "./forms/BOQForm";
import DocumentsForm from "./forms/DocumentsForm";
import ProjectOverview from "./ProjectOverview";

const CreateProject = () => {
  const store = useProjectStore();
  const currentStep = store.currentStep;
  const isLoadingProjectData = store.isLoadingProjectData;

  // Fetch mock project data only once when component mounts
  const { fetchProjectData } = useProjectData();

  useEffect(() => {
    fetchProjectData();
    console.log("triggers");
  }, [fetchProjectData]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <EssentialInfoForm />;
      case 2:
        return <ClassificationForm />;
      case 3:
        return <DocumentsForm />;
      case 4:
        return <BOQForm />;
      case 5:
        return <ProjectOverview />;
    }
  };
  if (isLoadingProjectData) {
    return (
      <div>
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
      </div>
    );
  }

  return (
    <div>
      <CreateProjectWrapper>
        <CreateProjectProgress />
        <div className="w-full border border-design-tertiary rounded-md p-4 md:p-6 max-w-3xl mx-auto">
          {renderStep()}
        </div>
      </CreateProjectWrapper>
    </div>
  );
};

export default CreateProject;
