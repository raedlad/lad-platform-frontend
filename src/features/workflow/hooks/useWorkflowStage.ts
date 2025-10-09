/**
 * useWorkflowStage Hook
 * Determines and provides current workflow stage information
 * This is a connector hook - no API calls, just derives stage from existing data
 */

import { useMemo } from "react";
import { useLocale } from "next-intl";
import {
  WorkflowStage,
  WorkflowProgress,
  StageDefinition,
  WORKFLOW_STAGES,
} from "../types/workflow";
import {
  determineCurrentStage,
  calculateWorkflowProgress,
  formatStageDisplay,
  getStageColorClass,
  getStageBorderColorClass,
  getStageBackgroundColorClass,
  canUserViewStage,
} from "../utils/workflowUtils";

export interface UseWorkflowStageParams {
  projectStatus: string;
  hasOffers?: boolean;
  offerAccepted?: boolean;
  hasContract?: boolean;
  contractStatus?: string;
  userRole?: "owner" | "contractor";
}

export interface UseWorkflowStageReturn {
  currentStage: WorkflowStage;
  stageDefinition: StageDefinition;
  progress: WorkflowProgress;
  display: {
    label: string;
    description: string;
    colorClass: string;
    borderColorClass: string;
    backgroundColorClass: string;
  };
  canView: boolean;
}

/**
 * Hook to get current workflow stage and related information
 * @param params - Project and related data to determine stage
 * @returns Current stage information and display utilities
 */
export const useWorkflowStage = (
  params: UseWorkflowStageParams
): UseWorkflowStageReturn => {
  const locale = useLocale() as "en" | "ar";

  const currentStage = useMemo(() => {
    return determineCurrentStage({
      projectStatus: params.projectStatus,
      hasOffers: params.hasOffers,
      offerAccepted: params.offerAccepted,
      hasContract: params.hasContract,
      contractStatus: params.contractStatus,
    });
  }, [
    params.projectStatus,
    params.hasOffers,
    params.offerAccepted,
    params.hasContract,
    params.contractStatus,
  ]);

  const stageDefinition = useMemo(() => {
    return WORKFLOW_STAGES[currentStage];
  }, [currentStage]);

  const progress = useMemo(() => {
    return calculateWorkflowProgress(currentStage);
  }, [currentStage]);

  const display = useMemo(() => {
    const formattedDisplay = formatStageDisplay(currentStage, locale);
    return {
      ...formattedDisplay,
      colorClass: getStageColorClass(currentStage),
      borderColorClass: getStageBorderColorClass(currentStage),
      backgroundColorClass: getStageBackgroundColorClass(currentStage),
    };
  }, [currentStage, locale]);

  const canView = useMemo(() => {
    if (!params.userRole) return true;
    return canUserViewStage(currentStage, params.userRole);
  }, [currentStage, params.userRole]);

  return {
    currentStage,
    stageDefinition,
    progress,
    display,
    canView,
  };
};
