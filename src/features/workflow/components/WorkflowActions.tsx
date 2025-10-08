/**
 * Workflow Actions Component
 * Provides contextual actions based on current workflow status
 */

"use client";

import React from "react";
import { Button } from "@/shared/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Clock, FileSignature, Play, AlertCircle } from "lucide-react";
import { useWorkflow, WORKFLOW_STATUS_LABELS } from "../index";
import { WorkflowStatus } from "../types/workflow";

interface WorkflowActionsProps {
  projectId: string;
  onAction?: (action: string, status: WorkflowStatus) => void;
  currentUserRole?: "owner" | "contractor";
}

export const WorkflowActions: React.FC<WorkflowActionsProps> = ({
  projectId,
  onAction,
  currentUserRole = "owner",
}) => {
  const { currentStatus, canTransition, isTransitioning } = useWorkflow({
    projectId,
    autoFetch: true,
  });

  if (!currentStatus) {
    return null;
  }

  const getAvailableActions = () => {
    const actions: React.ReactNode[] = [];

    // Based on current status and user role, show appropriate actions
    switch (currentStatus) {
      case "draft":
        if (currentUserRole === "owner") {
          actions.push(
            <Alert key="draft-info" className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Complete project details and publish to start receiving bids.
              </AlertDescription>
            </Alert>
          );
        }
        break;

      case "receiving_bids":
        if (currentUserRole === "owner") {
          actions.push(
            <Alert key="receiving-info" className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <Clock className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Your project is live! Review and accept offers from contractors.
              </AlertDescription>
            </Alert>
          );
        } else {
          actions.push(
            <Alert key="contractor-info" className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Submit your offer to be considered for this project.
              </AlertDescription>
            </Alert>
          );
        }
        break;

      case "offer_accepted":
        actions.push(
          <Alert key="offer-accepted" className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20">
            <CheckCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              Offer accepted! Contract is being prepared. You'll be notified when ready for review.
            </AlertDescription>
          </Alert>
        );
        break;

      case "awaiting_contract_signature":
        actions.push(
          <Alert key="awaiting-signature" className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
            <FileSignature className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <AlertDescription className="text-orange-800 dark:text-orange-200">
              Contract is ready for signature. Both parties need to sign to proceed.
            </AlertDescription>
          </Alert>
        );
        break;

      case "contract_signed":
        if (canTransition("in_progress")) {
          actions.push(
            <div key="start-execution" className="flex items-center gap-3">
              <Alert className="flex-1 border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                <CheckCircle className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <AlertDescription className="text-purple-800 dark:text-purple-200">
                  Contract fully signed! Ready to start project execution.
                </AlertDescription>
              </Alert>
              {currentUserRole === "owner" && (
                <Button
                  onClick={() => onAction?.("start_execution", "in_progress")}
                  disabled={isTransitioning}
                  className="gap-2"
                >
                  <Play className="h-4 w-4" />
                  Start Project
                </Button>
              )}
            </div>
          );
        } else {
          actions.push(
            <Alert key="signed-info" className="border-green-200 bg-green-50 dark:bg-green-900/20">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Contract fully signed by both parties. Project is ready to begin.
              </AlertDescription>
            </Alert>
          );
        }
        break;

      case "in_progress":
        actions.push(
          <Alert key="in-progress" className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <Play className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              Project is currently in progress. Track milestones and payments in the execution tab.
            </AlertDescription>
          </Alert>
        );
        break;

      case "completed":
        actions.push(
          <Alert key="completed" className="border-green-200 bg-green-50 dark:bg-green-900/20">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              Project completed successfully! Thank you for using our platform.
            </AlertDescription>
          </Alert>
        );
        break;

      case "cancelled":
        actions.push(
          <Alert key="cancelled" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This project has been cancelled.
            </AlertDescription>
          </Alert>
        );
        break;
    }

    return actions;
  };

  const availableActions = getAvailableActions();

  if (availableActions.length === 0) {
    return null;
  }

  return <div className="space-y-3">{availableActions}</div>;
};
