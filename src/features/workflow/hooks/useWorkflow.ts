/**
 * useWorkflow Hook
 * Main hook for managing project workflow and status transitions
 */

import { useEffect } from "react";
import { useWorkflowStore } from "../store/workflowStore";
import { WorkflowStatus, WorkflowEvent } from "../types/workflow";

interface UseWorkflowOptions {
  projectId?: string;
  autoFetch?: boolean;
  fetchHistory?: boolean;
}

export const useWorkflow = (options: UseWorkflowOptions = {}) => {
  const { projectId, autoFetch = false, fetchHistory = false } = options;

  const {
    currentWorkflowState,
    workflowHistory,
    isLoading,
    isTransitioning,
    error,
    fetchWorkflowState,
    fetchWorkflowHistory,
    transitionStatus,
    handleOfferAccepted,
    handleContractCreated,
    handleContractSigned,
    handleExecutionStart,
    canTransitionTo,
    getCurrentStatus,
    setError,
    reset,
  } = useWorkflowStore();

  // Auto-fetch workflow state on mount
  useEffect(() => {
    if (projectId && autoFetch) {
      fetchWorkflowState(projectId);
      if (fetchHistory) {
        fetchWorkflowHistory(projectId);
      }
    }
  }, [projectId, autoFetch, fetchHistory]);

  // Helper: Transition to a specific status
  const transitionTo = async (
    toStatus: WorkflowStatus,
    event: WorkflowEvent,
    metadata?: Record<string, any>
  ) => {
    if (!projectId) {
      throw new Error("Project ID is required for status transition");
    }
    return transitionStatus(projectId, toStatus, event, metadata);
  };

  // Helper: Accept offer and trigger workflow
  const acceptOffer = async (offerId: string, userId: string) => {
    if (!projectId) {
      throw new Error("Project ID is required");
    }
    return handleOfferAccepted(projectId, offerId, userId);
  };

  // Helper: Create contract and trigger workflow
  const createContract = async (
    offerId: string,
    contractId: string,
    userId: string
  ) => {
    if (!projectId) {
      throw new Error("Project ID is required");
    }
    return handleContractCreated(projectId, offerId, contractId, userId);
  };

  // Helper: Sign contract and trigger workflow
  const signContract = async (
    contractId: string,
    signedBy: "client" | "contractor",
    userId: string
  ) => {
    if (!projectId) {
      throw new Error("Project ID is required");
    }
    return handleContractSigned(projectId, contractId, signedBy, userId);
  };

  // Helper: Start execution and trigger workflow
  const startExecution = async (contractId: string, userId: string) => {
    if (!projectId) {
      throw new Error("Project ID is required");
    }
    return handleExecutionStart(projectId, contractId, userId);
  };

  // Helper: Refresh workflow state
  const refresh = async () => {
    if (!projectId) return;
    await fetchWorkflowState(projectId);
    if (fetchHistory) {
      await fetchWorkflowHistory(projectId);
    }
  };

  // Helper: Check if can transition to status
  const canTransition = (toStatus: WorkflowStatus) => {
    return canTransitionTo(toStatus);
  };

  return {
    // State
    currentWorkflowState,
    workflowHistory,
    currentStatus: getCurrentStatus(),
    isLoading,
    isTransitioning,
    error,

    // Actions
    transitionTo,
    acceptOffer,
    createContract,
    signContract,
    startExecution,

    // Utilities
    canTransition,
    refresh,
    setError,
    reset,
  };
};
