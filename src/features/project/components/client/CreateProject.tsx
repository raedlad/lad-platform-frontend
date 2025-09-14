"use client";
import React from "react";
import CreateProjectWrapper from "./CreateProjectWrapper";
import CreateProjectProgress from "./CreateProjectProgress";
import { useProjectStore } from "../../store/projectStore";
import EssentialInfoForm from "./forms/EssentialInfoForm";
import ClassificationForm from "./forms/ClassificationForm";
import BOQForm from "./forms/BOQForm";
import DocumentsForm from "./forms/DocumentsForm";
import ProjectOverview from "./ProjectOverview";
const CreateProject = () => {
  const store = useProjectStore();
  const currentStep = store.currentStep;

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
