/**
 * Workflow Status Tracker Component
 * Displays the project workflow progress through different stages
 */

"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { useWorkflow, WORKFLOW_TRANSITIONS, WORKFLOW_STATUS_LABELS } from "../index";
import { WorkflowStatus } from "../types/workflow";

interface WorkflowStatusTrackerProps {
  projectId: string;
  showTitle?: boolean;
}

export const WorkflowStatusTracker: React.FC<WorkflowStatusTrackerProps> = ({
  projectId,
  showTitle = true,
}) => {
  const { currentStatus, isLoading } = useWorkflow({
    projectId,
    autoFetch: true,
  });

  const statuses: WorkflowStatus[] = [
    "draft",
    "receiving_bids",
    "offer_accepted",
    "awaiting_contract_signature",
    "contract_signed",
    "in_progress",
  ];

  const getStatusIndex = (status: WorkflowStatus) => {
    return statuses.indexOf(status);
  };

  const currentIndex = currentStatus ? getStatusIndex(currentStatus) : -1;

  const isStatusComplete = (status: WorkflowStatus) => {
    if (!currentStatus) return false;
    return getStatusIndex(status) <= currentIndex;
  };

  const isStatusCurrent = (status: WorkflowStatus) => {
    return status === currentStatus;
  };

  if (isLoading) {
    return (
      <Card>
        {showTitle && (
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      {showTitle && (
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
        </CardHeader>
      )}
      <CardContent className="pt-6">
        <div className="space-y-4">
          {statuses.map((status, index) => {
            const isComplete = isStatusComplete(status);
            const isCurrent = isStatusCurrent(status);
            const isLast = index === statuses.length - 1;

            return (
              <div key={status} className="relative">
                <div className="flex items-start gap-3">
                  {/* Status Icon */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isComplete
                        ? "bg-green-100 dark:bg-green-900"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>

                  {/* Status Label */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${
                        isCurrent
                          ? "text-blue-600 dark:text-blue-400"
                          : isComplete
                          ? "text-gray-900 dark:text-gray-100"
                          : "text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      {WORKFLOW_STATUS_LABELS[status]}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Current Stage
                      </p>
                    )}
                  </div>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={`ml-4 w-0.5 h-8 mt-1 ${
                      isComplete
                        ? "bg-green-200 dark:bg-green-800"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
