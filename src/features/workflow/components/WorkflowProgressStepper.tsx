"use client";

import React from "react";
import {
  FileText,
  Clock,
  Search,
  FileSignature,
  PenTool,
  Hammer,
  CheckCircle,
  Archive,
  LucideIcon,
} from "lucide-react";
import { useWorkflowStage, UseWorkflowStageParams } from "../hooks/useWorkflowStage";
import { getOrderedStages } from "../types/workflow";
import { useLocale } from "next-intl";

const ICON_MAP: Record<string, LucideIcon> = {
  FileText,
  Clock,
  Search,
  FileSignature,
  PenTool,
  Hammer,
  CheckCircle,
  Archive,
};

interface WorkflowProgressStepperProps extends UseWorkflowStageParams {
  variant?: "horizontal" | "vertical";
  showLabels?: boolean;
  className?: string;
}

/**
 * WorkflowProgressStepper
 * Displays the full workflow progress as a stepper with all stages
 */
export const WorkflowProgressStepper: React.FC<WorkflowProgressStepperProps> = ({
  variant = "horizontal",
  showLabels = true,
  className = "",
  ...workflowParams
}) => {
  const locale = useLocale() as "en" | "ar";
  const { currentStage, progress } = useWorkflowStage(workflowParams);
  const orderedStages = getOrderedStages();

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {orderedStages.map((stage, index) => {
          const IconComponent = ICON_MAP[stage.icon] || FileText;
          const isActive = stage.id === currentStage;
          const isCompleted = stage.order < progress.currentStageOrder;
          const isPending = stage.order > progress.currentStageOrder;

          return (
            <div key={stage.id} className="flex items-start gap-3">
              {/* Icon Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors
                    ${
                      isCompleted
                        ? "bg-green-500 border-green-500 text-white dark:bg-green-600 dark:border-green-600"
                        : isActive
                        ? `${stage.color === "blue" ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900 dark:text-blue-200" : ""}
                           ${stage.color === "orange" ? "border-orange-500 bg-orange-50 text-orange-700 dark:border-orange-400 dark:bg-orange-900 dark:text-orange-200" : ""}
                           ${stage.color === "purple" ? "border-purple-500 bg-purple-50 text-purple-700 dark:border-purple-400 dark:bg-purple-900 dark:text-purple-200" : ""}
                           ${stage.color === "yellow" ? "border-yellow-500 bg-yellow-50 text-yellow-700 dark:border-yellow-400 dark:bg-yellow-900 dark:text-yellow-200" : ""}
                           ${stage.color === "indigo" ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-900 dark:text-indigo-200" : ""}
                           ${stage.color === "green" ? "border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-900 dark:text-green-200" : ""}
                           ${stage.color === "teal" ? "border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-400 dark:bg-teal-900 dark:text-teal-200" : ""}
                           ${stage.color === "gray" ? "border-gray-500 bg-gray-50 text-gray-700 dark:border-gray-400 dark:bg-gray-900 dark:text-gray-200" : ""}`
                        : "border-gray-300 bg-gray-50 text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500"
                    }
                  `}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <IconComponent className="w-5 h-5" />
                  )}
                </div>
                {index < orderedStages.length - 1 && (
                  <div
                    className={`w-0.5 h-12 ${
                      isCompleted
                        ? "bg-green-500 dark:bg-green-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    }`}
                  />
                )}
              </div>

              {/* Stage Info */}
              {showLabels && (
                <div className="flex-1 pb-8">
                  <h4
                    className={`text-sm font-medium ${
                      isActive
                        ? "text-foreground"
                        : isPending
                        ? "text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {locale === "ar" ? stage.labelAr : stage.label}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {locale === "ar" ? stage.descriptionAr : stage.description}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal variant
  return (
    <div className={`w-full ${className}`}>
      {/* Progress Bar */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {orderedStages.map((stage, index) => {
            const IconComponent = ICON_MAP[stage.icon] || FileText;
            const isActive = stage.id === currentStage;
            const isCompleted = stage.order < progress.currentStageOrder;
            const isPending = stage.order > progress.currentStageOrder;

            return (
              <React.Fragment key={stage.id}>
                <div className="flex flex-col items-center gap-2 relative z-10">
                  {/* Icon Circle */}
                  <div
                    className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors bg-white dark:bg-gray-900
                      ${
                        isCompleted
                          ? "bg-green-500 border-green-500 text-white dark:bg-green-600 dark:border-green-600"
                          : isActive
                          ? `${stage.color === "blue" ? "border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-900 dark:text-blue-200" : ""}
                             ${stage.color === "orange" ? "border-orange-500 bg-orange-50 text-orange-700 dark:border-orange-400 dark:bg-orange-900 dark:text-orange-200" : ""}
                             ${stage.color === "purple" ? "border-purple-500 bg-purple-50 text-purple-700 dark:border-purple-400 dark:bg-purple-900 dark:text-purple-200" : ""}
                             ${stage.color === "yellow" ? "border-yellow-500 bg-yellow-50 text-yellow-700 dark:border-yellow-400 dark:bg-yellow-900 dark:text-yellow-200" : ""}
                             ${stage.color === "indigo" ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-900 dark:text-indigo-200" : ""}
                             ${stage.color === "green" ? "border-green-500 bg-green-50 text-green-700 dark:border-green-400 dark:bg-green-900 dark:text-green-200" : ""}
                             ${stage.color === "teal" ? "border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-400 dark:bg-teal-900 dark:text-teal-200" : ""}
                             ${stage.color === "gray" ? "border-gray-500 bg-gray-50 text-gray-700 dark:border-gray-400 dark:bg-gray-900 dark:text-gray-200" : ""}`
                          : "border-gray-300 bg-gray-50 text-gray-400 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500"
                      }
                    `}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <IconComponent className="w-5 h-5" />
                    )}
                  </div>

                  {/* Stage Label */}
                  {showLabels && (
                    <div className="text-center max-w-[80px]">
                      <p
                        className={`text-xs font-medium line-clamp-2 ${
                          isActive
                            ? "text-foreground"
                            : isPending
                            ? "text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {locale === "ar" ? stage.labelAr : stage.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Connecting Line */}
                {index < orderedStages.length - 1 && (
                  <div className="flex-1 h-0.5 -mx-5 relative top-[-2.5rem]">
                    <div
                      className={`h-full ${
                        isCompleted
                          ? "bg-green-500 dark:bg-green-600"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Progress Percentage */}
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">
          {progress.progressPercentage}% {locale === "ar" ? "مكتمل" : "Complete"}
        </p>
      </div>
    </div>
  );
};
