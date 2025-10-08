/**
 * Workflow Store
 * Zustand store for managing workflow state
 */

import { create } from "zustand";
import {
  WorkflowStatus,
  WorkflowEvent,
  ProjectWorkflowState,
  WorkflowHistoryEntry,
  WorkflowTransitionResult,
} from "../types/workflow";
import { workflowApi } from "../services/workflowApi";
import { workflowOrchestrator } from "../services/workflowOrchestrator";

interface WorkflowStoreState {
  // State
  currentWorkflowState: ProjectWorkflowState | null;
  workflowHistory: WorkflowHistoryEntry[];
  isLoading: boolean;
  isTransitioning: boolean;
  error: string | null;

  // Actions
  setCurrentWorkflowState: (state: ProjectWorkflowState | null) => void;
  setWorkflowHistory: (history: WorkflowHistoryEntry[]) => void;
  setLoading: (loading: boolean) => void;
  setTransitioning: (transitioning: boolean) => void;
  setError: (error: string | null) => void;

  // API Actions
  fetchWorkflowState: (projectId: string) => Promise<void>;
  fetchWorkflowHistory: (projectId: string) => Promise<void>;
  transitionStatus: (
    projectId: string,
    toStatus: WorkflowStatus,
    event: WorkflowEvent,
    metadata?: Record<string, any>
  ) => Promise<boolean>;

  // Orchestrated Actions
  handleOfferAccepted: (
    projectId: string,
    offerId: string,
    userId: string
  ) => Promise<WorkflowTransitionResult>;
  handleContractCreated: (
    projectId: string,
    offerId: string,
    contractId: string,
    userId: string
  ) => Promise<WorkflowTransitionResult>;
  handleContractSigned: (
    projectId: string,
    contractId: string,
    signedBy: "client" | "contractor",
    userId: string
  ) => Promise<WorkflowTransitionResult>;
  handleExecutionStart: (
    projectId: string,
    contractId: string,
    userId: string
  ) => Promise<WorkflowTransitionResult>;

  // Utility
  canTransitionTo: (toStatus: WorkflowStatus) => boolean;
  getCurrentStatus: () => WorkflowStatus | null;
  reset: () => void;
}

const initialState = {
  currentWorkflowState: null,
  workflowHistory: [],
  isLoading: false,
  isTransitioning: false,
  error: null,
};

export const useWorkflowStore = create<WorkflowStoreState>((set, get) => ({
  ...initialState,

  // Setters
  setCurrentWorkflowState: (state) => set({ currentWorkflowState: state }),
  setWorkflowHistory: (history) => set({ workflowHistory: history }),
  setLoading: (isLoading) => set({ isLoading }),
  setTransitioning: (isTransitioning) => set({ isTransitioning }),
  setError: (error) => set({ error }),

  // Fetch workflow state
  fetchWorkflowState: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await workflowApi.getProjectWorkflowState(projectId);
      if (result.success && result.response) {
        set({ currentWorkflowState: result.response });
      } else {
        set({ error: result.message || "Failed to fetch workflow state" });
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch workflow state" });
    } finally {
      set({ isLoading: false });
    }
  },

  // Fetch workflow history
  fetchWorkflowHistory: async (projectId: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await workflowApi.getWorkflowHistory(projectId);
      if (result.success && result.response) {
        set({ workflowHistory: result.response });
      } else {
        set({ error: result.message || "Failed to fetch workflow history" });
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to fetch workflow history" });
    } finally {
      set({ isLoading: false });
    }
  },

  // Transition status
  transitionStatus: async (
    projectId: string,
    toStatus: WorkflowStatus,
    event: WorkflowEvent,
    metadata?: Record<string, any>
  ) => {
    set({ isTransitioning: true, error: null });
    try {
      const result = await workflowApi.transitionProjectStatus(
        projectId,
        toStatus,
        event,
        metadata
      );

      if (result.success && result.response) {
        // Update current state
        await get().fetchWorkflowState(projectId);
        return true;
      } else {
        set({ error: result.message || "Failed to transition status" });
        return false;
      }
    } catch (error: any) {
      set({ error: error.message || "Failed to transition status" });
      return false;
    } finally {
      set({ isTransitioning: false });
    }
  },

  // Orchestrated: Handle offer accepted
  handleOfferAccepted: async (
    projectId: string,
    offerId: string,
    userId: string
  ) => {
    set({ isTransitioning: true, error: null });
    try {
      const result = await workflowOrchestrator.handleOfferAccepted(
        projectId,
        offerId,
        userId
      );

      // Refresh workflow state
      await get().fetchWorkflowState(projectId);

      return result;
    } catch (error: any) {
      set({ error: error.message || "Failed to handle offer acceptance" });
      throw error;
    } finally {
      set({ isTransitioning: false });
    }
  },

  // Orchestrated: Handle contract created
  handleContractCreated: async (
    projectId: string,
    offerId: string,
    contractId: string,
    userId: string
  ) => {
    set({ isTransitioning: true, error: null });
    try {
      const result = await workflowOrchestrator.handleContractCreated(
        projectId,
        offerId,
        contractId,
        userId
      );

      // Refresh workflow state
      await get().fetchWorkflowState(projectId);

      return result;
    } catch (error: any) {
      set({ error: error.message || "Failed to handle contract creation" });
      throw error;
    } finally {
      set({ isTransitioning: false });
    }
  },

  // Orchestrated: Handle contract signed
  handleContractSigned: async (
    projectId: string,
    contractId: string,
    signedBy: "client" | "contractor",
    userId: string
  ) => {
    set({ isTransitioning: true, error: null });
    try {
      const result = await workflowOrchestrator.handleContractSigned(
        projectId,
        contractId,
        signedBy,
        userId
      );

      // Refresh workflow state
      await get().fetchWorkflowState(projectId);

      return result;
    } catch (error: any) {
      set({ error: error.message || "Failed to handle contract signing" });
      throw error;
    } finally {
      set({ isTransitioning: false });
    }
  },

  // Orchestrated: Handle execution start
  handleExecutionStart: async (
    projectId: string,
    contractId: string,
    userId: string
  ) => {
    set({ isTransitioning: true, error: null });
    try {
      const result = await workflowOrchestrator.handleExecutionStart(
        projectId,
        contractId,
        userId
      );

      // Refresh workflow state
      await get().fetchWorkflowState(projectId);

      return result;
    } catch (error: any) {
      set({ error: error.message || "Failed to start execution" });
      throw error;
    } finally {
      set({ isTransitioning: false });
    }
  },

  // Check if can transition to a status
  canTransitionTo: (toStatus: WorkflowStatus) => {
    const state = get().currentWorkflowState;
    if (!state) return false;
    return state.canTransitionTo.includes(toStatus);
  },

  // Get current status
  getCurrentStatus: () => {
    const state = get().currentWorkflowState;
    return state?.currentStatus || null;
  },

  // Reset
  reset: () => set(initialState),
}));
