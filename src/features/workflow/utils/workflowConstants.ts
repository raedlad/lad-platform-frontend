/**
 * Workflow Constants
 * Defines the state machine transitions and workflow rules
 */

import { WorkflowStatus, WorkflowEvent, WorkflowTransition } from "../types/workflow";

// Valid workflow transitions
export const WORKFLOW_TRANSITIONS: WorkflowTransition[] = [
  {
    from: "draft",
    to: "receiving_bids",
    event: "PROJECT_PUBLISHED",
  },
  {
    from: "receiving_bids",
    to: "offer_accepted",
    event: "OFFER_ACCEPTED",
  },
  {
    from: "offer_accepted",
    to: "awaiting_contract_signature",
    event: "CONTRACT_CREATED",
  },
  {
    from: "awaiting_contract_signature",
    to: "contract_signed",
    event: "CONTRACT_FULLY_SIGNED",
  },
  {
    from: "contract_signed",
    to: "in_progress",
    event: "EXECUTION_STARTED",
  },
  {
    from: "in_progress",
    to: "completed",
    event: "EXECUTION_COMPLETED",
  },
];

// Status display names for UI
export const WORKFLOW_STATUS_LABELS: Record<WorkflowStatus, string> = {
  draft: "Draft",
  receiving_bids: "Receiving Bids",
  offer_accepted: "Offer Accepted",
  awaiting_contract_signature: "Awaiting Signatures",
  contract_signed: "Contract Signed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

// Status colors for UI
export const WORKFLOW_STATUS_COLORS: Record<WorkflowStatus, string> = {
  draft: "gray",
  receiving_bids: "blue",
  offer_accepted: "green",
  awaiting_contract_signature: "yellow",
  contract_signed: "purple",
  in_progress: "indigo",
  completed: "green",
  cancelled: "red",
};

// Event descriptions
export const WORKFLOW_EVENT_LABELS: Record<WorkflowEvent, string> = {
  PROJECT_PUBLISHED: "Project Published",
  OFFER_ACCEPTED: "Offer Accepted",
  CONTRACT_CREATED: "Contract Created",
  CONTRACT_SIGNED_BY_CLIENT: "Contract Signed by Client",
  CONTRACT_SIGNED_BY_CONTRACTOR: "Contract Signed by Contractor",
  CONTRACT_FULLY_SIGNED: "Contract Fully Signed",
  EXECUTION_STARTED: "Execution Started",
  EXECUTION_COMPLETED: "Execution Completed",
  PROJECT_CANCELLED: "Project Cancelled",
};

// Get next possible statuses from current status
export const getNextStatuses = (currentStatus: WorkflowStatus): WorkflowStatus[] => {
  return WORKFLOW_TRANSITIONS
    .filter((t) => t.from === currentStatus)
    .map((t) => t.to);
};

// Get required event for a transition
export const getTransitionEvent = (
  from: WorkflowStatus,
  to: WorkflowStatus
): WorkflowEvent | null => {
  const transition = WORKFLOW_TRANSITIONS.find(
    (t) => t.from === from && t.to === to
  );
  return transition?.event || null;
};

// Check if a transition is valid
export const isValidTransition = (
  from: WorkflowStatus,
  to: WorkflowStatus
): boolean => {
  return WORKFLOW_TRANSITIONS.some((t) => t.from === from && t.to === to);
};

// Get workflow transition by event
export const getTransitionByEvent = (
  event: WorkflowEvent
): WorkflowTransition | null => {
  return WORKFLOW_TRANSITIONS.find((t) => t.event === event) || null;
};
