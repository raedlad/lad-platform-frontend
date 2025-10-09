/**
 * Workflow Feature - Connector Module
 * Tracks project lifecycle stages across features (project, offers, contract)
 * No API calls - pure logic based on existing feature data
 */

// Types
export type {
  WorkflowStage,
  StageDefinition,
  WorkflowProgress,
  StageAction,
} from "./types/workflow";

export { WORKFLOW_STAGES, getOrderedStages, getStageById } from "./types/workflow";

// Utils
export {
  determineCurrentStage,
  calculateWorkflowProgress,
  canUserViewStage,
  getStageColorClass,
  getStageBorderColorClass,
  getStageBackgroundColorClass,
  formatStageDisplay,
} from "./utils/workflowUtils";

// Navigation Utils
export {
  getWorkflowRoute,
  getStageRoute,
  getFallbackRoute,
  navigateToStage,
  getStageActionText,
} from "./utils/workflowNavigation";
export type { NavigationParams, StageRoute } from "./utils/workflowNavigation";

// Hooks
export { useWorkflowStage } from "./hooks/useWorkflowStage";
export type { UseWorkflowStageParams, UseWorkflowStageReturn } from "./hooks/useWorkflowStage";
export { useWorkflowNavigation } from "./hooks/useWorkflowNavigation";
export type { UseWorkflowNavigationParams, UseWorkflowNavigationReturn } from "./hooks/useWorkflowNavigation";

// Components
export { WorkflowStageBadge } from "./components/WorkflowStageBadge";
export { WorkflowProgressStepper } from "./components/WorkflowProgressStepper";
export { WorkflowStageCard } from "./components/WorkflowStageCard";
