/**
 * Workflow Utilities
 * Pure functions to determine current workflow stage based on project/offer/contract data
 * No API calls - just logic based on existing feature data
 */

import {
  WorkflowStage,
  WorkflowProgress,
  WORKFLOW_STAGES,
  getOrderedStages,
} from "../types/workflow";

/**
 * Determine the current workflow stage based on project status and related data
 * This is a pure function that acts as a connector between features
 */
export const determineCurrentStage = (params: {
  projectStatus: string;
  hasOffers?: boolean;
  offerAccepted?: boolean;
  hasContract?: boolean;
  contractStatus?: string;
}): WorkflowStage => {
  const {
    projectStatus,
    hasOffers = false,
    offerAccepted = false,
    hasContract = false,
    contractStatus,
  } = params;

  // Project Closed
  if (projectStatus === "closed_completed" || projectStatus === "cancelled") {
    return "project_closed";
  }

  // Project Completion
  if (projectStatus === "completed") {
    return "project_completion";
  }

  // Project Execution
  if (projectStatus === "in_progress" || projectStatus === "contract_signed") {
    return "project_execution";
  }

  // Contract Signing
  if (
    projectStatus === "awaiting_contract_signature" ||
    (hasContract &&
      (contractStatus === "Approved - Awaiting Signatures" ||
        contractStatus === "Awaiting Contractor Signature" ||
        contractStatus === "Awaiting Client Review" ||
        contractStatus === "Awaiting Contractor Review"))
  ) {
    return "contract_signing";
  }

  // Contract Negotiation
  if (
    projectStatus === "offer_accepted" ||
    (offerAccepted && hasContract) ||
    (hasContract &&
      (contractStatus === "Waiting for Contract Draft" ||
        contractStatus === "Awaiting Client Modification"))
  ) {
    return "contract_negotiation";
  }

  // Offer Review
  if (hasOffers && !offerAccepted) {
    return "offer_review";
  }

  // Awaiting Offers
  if (
    projectStatus === "published" ||
    projectStatus === "receiving_bids"
  ) {
    return "awaiting_offers";
  }

  // Project Creation (default/draft state)
  return "project_creation";
};

/**
 * Calculate workflow progress based on current stage
 */
export const calculateWorkflowProgress = (
  currentStage: WorkflowStage
): WorkflowProgress => {
  const orderedStages = getOrderedStages();
  const currentStageDefinition = WORKFLOW_STAGES[currentStage];
  const currentStageOrder = currentStageDefinition.order;
  const totalStages = orderedStages.length;
  const completedStages = currentStageOrder - 1;
  const progressPercentage = Math.round((completedStages / totalStages) * 100);

  const nextStageDefinition = orderedStages.find(
    (stage) => stage.order === currentStageOrder + 1
  );
  const previousStageDefinition = orderedStages.find(
    (stage) => stage.order === currentStageOrder - 1
  );

  return {
    currentStage,
    currentStageOrder,
    totalStages,
    completedStages,
    progressPercentage,
    nextStage: nextStageDefinition?.id,
    previousStage: previousStageDefinition?.id,
    isComplete: currentStage === "project_closed",
  };
};

/**
 * Check if a user role can view a specific stage
 */
export const canUserViewStage = (
  stage: WorkflowStage,
  userRole: "owner" | "contractor"
): boolean => {
  const stageDefinition = WORKFLOW_STAGES[stage];
  return stageDefinition.allowedRoles.includes(userRole);
};

/**
 * Get stage color class for UI
 */
export const getStageColorClass = (stage: WorkflowStage): string => {
  const stageDefinition = WORKFLOW_STAGES[stage];
  const colorMap: Record<string, string> = {
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    orange: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    purple: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    indigo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    teal: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

  return colorMap[stageDefinition.color] || colorMap.gray;
};

/**
 * Get stage border color class for progress indicators
 */
export const getStageBorderColorClass = (stage: WorkflowStage): string => {
  const stageDefinition = WORKFLOW_STAGES[stage];
  const colorMap: Record<string, string> = {
    blue: "border-blue-500 dark:border-blue-400",
    orange: "border-orange-500 dark:border-orange-400",
    purple: "border-purple-500 dark:border-purple-400",
    yellow: "border-yellow-500 dark:border-yellow-400",
    indigo: "border-indigo-500 dark:border-indigo-400",
    green: "border-green-500 dark:border-green-400",
    teal: "border-teal-500 dark:border-teal-400",
    gray: "border-gray-500 dark:border-gray-400",
  };

  return colorMap[stageDefinition.color] || colorMap.gray;
};

/**
 * Get stage background color class for progress bars
 */
export const getStageBackgroundColorClass = (stage: WorkflowStage): string => {
  const stageDefinition = WORKFLOW_STAGES[stage];
  const colorMap: Record<string, string> = {
    blue: "bg-blue-500 dark:bg-blue-400",
    orange: "bg-orange-500 dark:bg-orange-400",
    purple: "bg-purple-500 dark:bg-purple-400",
    yellow: "bg-yellow-500 dark:bg-yellow-400",
    indigo: "bg-indigo-500 dark:bg-indigo-400",
    green: "bg-green-500 dark:bg-green-400",
    teal: "bg-teal-500 dark:bg-teal-400",
    gray: "bg-gray-500 dark:bg-gray-400",
  };

  return colorMap[stageDefinition.color] || colorMap.gray;
};

/**
 * Format stage for display
 */
export const formatStageDisplay = (
  stage: WorkflowStage,
  locale: "en" | "ar" = "en"
): {
  label: string;
  description: string;
} => {
  const stageDefinition = WORKFLOW_STAGES[stage];
  return {
    label: locale === "ar" ? stageDefinition.labelAr : stageDefinition.label,
    description:
      locale === "ar"
        ? stageDefinition.descriptionAr
        : stageDefinition.description,
  };
};
