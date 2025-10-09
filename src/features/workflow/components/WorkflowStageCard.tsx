"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { WorkflowStageBadge } from "./WorkflowStageBadge";
import { WorkflowProgressStepper } from "./WorkflowProgressStepper";
import { UseWorkflowStageParams } from "../hooks/useWorkflowStage";

interface WorkflowStageCardProps extends UseWorkflowStageParams {
  title?: string;
  showStepper?: boolean;
  stepperVariant?: "horizontal" | "vertical";
  className?: string;
}

/**
 * WorkflowStageCard
 * Complete card component showing current stage and optional full progress stepper
 */
export const WorkflowStageCard: React.FC<WorkflowStageCardProps> = ({
  title,
  showStepper = false,
  stepperVariant = "horizontal",
  className = "",
  ...workflowParams
}) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          {title || "Project Stage"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Current Stage</p>
          <WorkflowStageBadge {...workflowParams} showDescription={true} />
        </div>
        {showStepper && (
          <div className="pt-4 border-t">
            <WorkflowProgressStepper
              {...workflowParams}
              variant={stepperVariant}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};
