/**
 * Workflow Types
 * Defines the types for the workflow orchestrator that connects
 * project creation, offers, and contracts
 */

import { ProjectStatus } from "@/features/project/types/project";

// Workflow statuses matching the project lifecycle
export type WorkflowStatus =
  | "draft"
  | "receiving_bids"
  | "offer_accepted"
  | "awaiting_contract_signature"
  | "contract_signed"
  | "in_progress"
  | "completed"
  | "cancelled";

// Workflow transition events
export type WorkflowEvent =
  | "PROJECT_PUBLISHED"
  | "OFFER_ACCEPTED"
  | "CONTRACT_CREATED"
  | "CONTRACT_SIGNED_BY_CLIENT"
  | "CONTRACT_SIGNED_BY_CONTRACTOR"
  | "CONTRACT_FULLY_SIGNED"
  | "EXECUTION_STARTED"
  | "EXECUTION_COMPLETED"
  | "PROJECT_CANCELLED";

// Workflow state machine definition
export interface WorkflowTransition {
  from: WorkflowStatus;
  to: WorkflowStatus;
  event: WorkflowEvent;
  conditions?: WorkflowCondition[];
  actions?: WorkflowAction[];
}

// Conditions that must be met for a transition
export interface WorkflowCondition {
  type: "HAS_ACCEPTED_OFFER" | "HAS_CONTRACT" | "ALL_PARTIES_SIGNED" | "HAS_BOQ" | "HAS_DOCUMENTS";
  validate: (context: WorkflowContext) => boolean | Promise<boolean>;
}

// Actions to execute during a transition
export interface WorkflowAction {
  type: "CREATE_CONTRACT" | "NOTIFY_PARTIES" | "UPDATE_PROJECT" | "SEND_NOTIFICATION";
  execute: (context: WorkflowContext) => void | Promise<void>;
}

// Context passed through workflow transitions
export interface WorkflowContext {
  projectId: string;
  offerId?: string;
  contractId?: string;
  userId: string;
  userRole: "owner" | "contractor";
  metadata?: Record<string, any>;
}

// Workflow state for a project
export interface ProjectWorkflowState {
  projectId: string;
  currentStatus: WorkflowStatus;
  previousStatus?: WorkflowStatus;
  acceptedOfferId?: string;
  contractId?: string;
  lastTransitionAt: string;
  lastTransitionEvent?: WorkflowEvent;
  canTransitionTo: WorkflowStatus[];
  pendingActions: string[];
}

// Response from workflow operations
export interface WorkflowTransitionResult {
  success: boolean;
  newStatus: WorkflowStatus;
  previousStatus: WorkflowStatus;
  event: WorkflowEvent;
  message: string;
  context: WorkflowContext;
  timestamp: string;
}

// Workflow validation result
export interface WorkflowValidationResult {
  isValid: boolean;
  canTransition: boolean;
  missingConditions: string[];
  errors: string[];
  warnings: string[];
}

// Workflow history entry
export interface WorkflowHistoryEntry {
  id: string;
  projectId: string;
  fromStatus: WorkflowStatus;
  toStatus: WorkflowStatus;
  event: WorkflowEvent;
  triggeredBy: string;
  triggeredAt: string;
  metadata?: Record<string, any>;
}
