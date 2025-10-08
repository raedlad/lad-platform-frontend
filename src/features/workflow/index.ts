/**
 * Workflow Feature Export
 * Centralized exports for the workflow feature
 */

// Types
export type {
  WorkflowStatus,
  WorkflowEvent,
  WorkflowTransition,
  WorkflowCondition,
  WorkflowAction,
  WorkflowContext,
  ProjectWorkflowState,
  WorkflowTransitionResult,
  WorkflowValidationResult,
  WorkflowHistoryEntry,
} from "./types/workflow";

// Services
export { workflowApi } from "./services/workflowApi";
export { workflowOrchestrator } from "./services/workflowOrchestrator";

// Adapters
export { offersWorkflowAdapter } from "./adapters/offersWorkflowAdapter";
export { contractWorkflowAdapter } from "./adapters/contractWorkflowAdapter";

// Store
export { useWorkflowStore } from "./store/workflowStore";

// Hooks
export { useWorkflow } from "./hooks/useWorkflow";
export { useProjectWorkflow } from "./hooks/useProjectWorkflow";
export { useOfferWorkflow } from "./hooks/useOfferWorkflow";
export { useContractWorkflow } from "./hooks/useContractWorkflow";

// Utils
export {
  WORKFLOW_TRANSITIONS,
  WORKFLOW_STATUS_LABELS,
  WORKFLOW_STATUS_COLORS,
  WORKFLOW_EVENT_LABELS,
  getNextStatuses,
  getTransitionEvent,
  isValidTransition,
  getTransitionByEvent,
} from "./utils/workflowConstants";

// Components
export { ProjectStatusBadge, WorkflowStatusTracker, WorkflowActions } from "./components";
