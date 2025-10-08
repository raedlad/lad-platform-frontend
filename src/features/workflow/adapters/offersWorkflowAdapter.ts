/**
 * Offers Workflow Adapter
 * Connects the offers feature with the workflow system
 */

import { workflowOrchestrator } from "../services/workflowOrchestrator";
import { individualOffersApi } from "@/features/offers/services/individualOffersApi";
import { WorkflowTransitionResult } from "../types/workflow";

export class OffersWorkflowAdapter {
  /**
   * Accept an offer and trigger workflow transition
   * This handles both the offer acceptance and status update
   */
  async acceptOfferWithWorkflow(
    projectId: string,
    offerId: string,
    userId: string
  ): Promise<{
    offerAccepted: boolean;
    workflowTransition: WorkflowTransitionResult;
  }> {
    try {
      // Step 1: Accept the offer via offers API
      const updatedOffer = await individualOffersApi.acceptOffer(offerId);

      if (!updatedOffer) {
        throw new Error("Failed to accept offer");
      }

      // Step 2: Trigger workflow transition
      const workflowResult = await workflowOrchestrator.handleOfferAccepted(
        projectId,
        offerId,
        userId
      );

      return {
        offerAccepted: true,
        workflowTransition: workflowResult,
      };
    } catch (error: any) {
      console.error("Error in acceptOfferWithWorkflow:", error);
      throw new Error(
        error.message || "Failed to accept offer and update workflow"
      );
    }
  }

  /**
   * Check if offer can be accepted based on workflow state
   */
  async canAcceptOffer(projectId: string, offerId: string): Promise<boolean> {
    try {
      // Validate via workflow orchestrator
      const validation = await workflowOrchestrator.validateTransition(
        projectId,
        "offer_accepted"
      );

      return validation.canTransition;
    } catch (error: any) {
      console.error("Error checking if offer can be accepted:", error);
      return false;
    }
  }

  /**
   * Get offer acceptance validation errors
   */
  async getOfferAcceptanceValidation(
    projectId: string
  ): Promise<{ canAccept: boolean; errors: string[] }> {
    try {
      const validation = await workflowOrchestrator.validateTransition(
        projectId,
        "offer_accepted"
      );

      return {
        canAccept: validation.canTransition,
        errors: validation.errors,
      };
    } catch (error: any) {
      return {
        canAccept: false,
        errors: [error.message || "Validation failed"],
      };
    }
  }
}

// Export singleton instance
export const offersWorkflowAdapter = new OffersWorkflowAdapter();
