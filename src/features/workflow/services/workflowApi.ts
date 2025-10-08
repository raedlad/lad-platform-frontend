/**
 * Workflow API Service
 * Handles API calls for workflow status updates and transitions
 */

import { api } from "@/lib/api";
import {
  WorkflowStatus,
  WorkflowEvent,
  WorkflowTransitionResult,
  ProjectWorkflowState,
  WorkflowHistoryEntry,
} from "../types/workflow";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  response?: T;
  data?: T;
}

export const workflowApi = {
  /**
   * Get current workflow state for a project
   */
  getProjectWorkflowState: async (
    projectId: string
  ): Promise<ApiResponse<ProjectWorkflowState>> => {
    try {
      const response = await api.get(`/projects/${projectId}/workflow/state`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to get workflow state:", error);
      // Return a default state if API fails
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to get workflow state",
      };
    }
  },

  /**
   * Transition project to a new status
   */
  transitionProjectStatus: async (
    projectId: string,
    toStatus: WorkflowStatus,
    event: WorkflowEvent,
    metadata?: Record<string, any>
  ): Promise<ApiResponse<WorkflowTransitionResult>> => {
    try {
      const response = await api.post(`/projects/${projectId}/workflow/transition`, {
        to_status: toStatus,
        event,
        metadata,
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to transition status:", error);
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to transition status",
      };
    }
  },

  /**
   * Update project status directly (legacy support)
   */
  updateProjectStatus: async (
    projectId: string,
    status: WorkflowStatus
  ): Promise<ApiResponse<any>> => {
    try {
      const response = await api.patch(`/projects/owner/${projectId}`, {
        status,
      });
      return {
        success: true,
        message: "Status updated successfully",
        data: response.data,
      };
    } catch (error: any) {
      console.error("Failed to update project status:", error);
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to update status",
      };
    }
  },

  /**
   * Get workflow history for a project
   */
  getWorkflowHistory: async (
    projectId: string
  ): Promise<ApiResponse<WorkflowHistoryEntry[]>> => {
    try {
      const response = await api.get(`/projects/${projectId}/workflow/history`);
      return response.data;
    } catch (error: any) {
      console.error("Failed to get workflow history:", error);
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to get workflow history",
        response: [],
      };
    }
  },

  /**
   * Trigger workflow event
   */
  triggerWorkflowEvent: async (
    projectId: string,
    event: WorkflowEvent,
    metadata?: Record<string, any>
  ): Promise<ApiResponse<WorkflowTransitionResult>> => {
    try {
      const response = await api.post(`/projects/${projectId}/workflow/events`, {
        event,
        metadata,
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to trigger workflow event:", error);
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to trigger event",
      };
    }
  },

  /**
   * Validate if a transition is possible
   */
  validateTransition: async (
    projectId: string,
    toStatus: WorkflowStatus
  ): Promise<ApiResponse<{ can_transition: boolean; reasons: string[] }>> => {
    try {
      const response = await api.post(`/projects/${projectId}/workflow/validate`, {
        to_status: toStatus,
      });
      return response.data;
    } catch (error: any) {
      console.error("Failed to validate transition:", error);
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to validate transition",
        response: {
          can_transition: false,
          reasons: ["Validation failed"],
        },
      };
    }
  },
};
