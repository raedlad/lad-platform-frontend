"use client";
import React, { useState } from "react";
import EssentialInfoForm from "./forms/EssentialInfoForm";
import ClassificationForm from "./forms/ClassificationForm";
import ToolbarExpandable from "@/components/ui/toolbar-expandable";
import { FileTextIcon } from "lucide-react";
import BOQForm from "./forms/BOQForm";
import DocumentsForm from "./forms/DocumentsForm";

const CreateProjectProgress = () => {
  const [activeStep, setActiveStep] = useState("details");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const steps = [
    {
      id: "details",
      title: "Details info",
      description: "Enter the details of your project",
      icon: <FileTextIcon className="w-4 h-4" />,
      content: <EssentialInfoForm />,
    },
    {
      id: "classification",
      title: "Category",
      description: "Add the classification for your project",
      icon: <FileTextIcon className="w-4 h-4" />,
      content: <ClassificationForm />,
    },
    {
      id: "documents",
      title: "Files",
      description: "Add the project documents for your project",
      icon: <FileTextIcon className="w-4 h-4" />,
      content: <DocumentsForm />,
    },
    {
      id: "boq",
      title: "BOQ",
      description: "Add the BOQ for your project",
      icon: <FileTextIcon className="w-4 h-4" />,
      content: <BOQForm />,
    },
    {
      id: "boq_details",
      title: "BOQ Info",
      description: "Add the BOQ details for your project",
      icon: <FileTextIcon className="w-4 h-4" />,
      content: <BOQForm />,
    },
  ];

  // Function to validate if a step can be accessed
  const handleStepValidation = (stepId: string): boolean => {
    // Add your custom validation logic here
    // For example, check if required fields are filled
    switch (stepId) {
      case "details":
        return true; // First step is always accessible
      case "classification":
        return completedSteps.includes("details");
      case "documents":
        return completedSteps.includes("classification");
      case "boq":
        return completedSteps.includes("documents");
      case "boq_details":
        return completedSteps.includes("boq");
      default:
        return false;
    }
  };

  // Function to handle step access denied
  const handleStepAccessDenied = (stepId: string) => {
    console.log(`Access denied to step: ${stepId}`);
    // You could show a toast notification here
    // toast.error("Please complete the previous steps first");
  };

  // Function to mark a step as completed and move to next step
  const markStepAsCompleted = (stepId: string) => {
    // Mark the step as completed
    setCompletedSteps((prev) =>
      prev.includes(stepId) ? prev : [...prev, stepId]
    );

    // Find the current step index
    const currentStepIndex = steps.findIndex((step) => step.id === stepId);

    // Move to next step if it exists
    if (currentStepIndex !== -1 && currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      setActiveStep(nextStep.id);
    }
  };

  console.log("Active step:", activeStep);
  console.log("Completed steps:", completedSteps);

  return (
    <div>
      <ToolbarExpandable
        steps={steps}
        expanded={true}
        activeStep={activeStep}
        onActiveStepChange={(step) => {
          setActiveStep(step || "details");
        }}
        completedSteps={completedSteps}
        onStepValidation={handleStepValidation}
        restrictNavigation={true}
        onStepAccessDenied={handleStepAccessDenied}
      />

      {/* Demo: Button to mark current step as completed and move to next */}
      <div className="mt-4 text-center">
        <button
          onClick={() => markStepAsCompleted(activeStep)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={completedSteps.includes(activeStep)}
        >
          {completedSteps.includes(activeStep)
            ? "Step Completed"
            : `Complete & Continue`}
        </button>
      </div>
    </div>
  );
};

export default CreateProjectProgress;
