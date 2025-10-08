/**
 * Workflow Orchestrator
 * Main business logic for orchestrating transitions between
 * project, offers, and contracts
 */

import {
  WorkflowStatus,
  WorkflowEvent,
  WorkflowContext,
  WorkflowTransitionResult,
  WorkflowValidationResult,
} from "../types/workflow";
import { workflowApi } from "./workflowApi";
import {
  isValidTransition,
  getTransitionEvent,
  WORKFLOW_TRANSITIONS,
} from "../utils/workflowConstants";

export class WorkflowOrchestrator {
  /**
   * Orchestrate offer acceptance workflow
   * When an offer is accepted, this triggers contract creation
   * and updates project status
   */
  async handleOfferAccepted(
    projectId: string,
    offerId: string,
    userId: string
  ): Promise<WorkflowTransitionResult> {
    const context: WorkflowContext = {
      projectId,
      offerId,
      userId,
      userRole: "owner",
      metadata: {
        action: "offer_accepted",
        timestamp: new Date().toISOString(),
      },
    };

    try {
      // Step 1: Validate current state allows offer acceptance
      const validation = await this.validateOfferAcceptance(projectId);
      if (!validation.canTransition) {
        throw new Error(
          validation.errors.join(", ") || "Cannot accept offer at this time"
        );
      }

      // Step 2: Trigger workflow event for offer acceptance
      const transitionResult = await workflowApi.triggerWorkflowEvent(
        projectId,
        "OFFER_ACCEPTED",
        {
          offerId,
          acceptedBy: userId,
          acceptedAt: new Date().toISOString(),
        }
      );

      if (!transitionResult.success) {
        throw new Error(transitionResult.message || "Failed to update workflow");
      }

      // Step 3: The backend should handle contract creation automatically
      // or we trigger it explicitly here
      await this.initiateContractCreation(projectId, offerId, context);

      return {
        success: true,
        newStatus: "offer_accepted",
        previousStatus: "receiving_bids",
        event: "OFFER_ACCEPTED",
        message: "Offer accepted successfully. Contract creation initiated.",
        context,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error("Error in handleOfferAccepted:", error);
      throw error;
    }
  }

  /**
   * Orchestrate contract creation workflow
   * After offer acceptance, create contract and update status
   */
  async handleContractCreated(
    projectId: string,
    offerId: string,
    contractId: string,
    userId: string
  ): Promise<WorkflowTransitionResult> {
    const context: WorkflowContext = {
      projectId,
      offerId,
      contractId,
      userId,
      userRole: "owner",
      metadata: {
        action: "contract_created",
        timestamp: new Date().toISOString(),
      },
    };

    try {
      // Trigger workflow event for contract creation
      const transitionResult = await workflowApi.triggerWorkflowEvent(
        projectId,
        "CONTRACT_CREATED",
        {
          contractId,
          offerId,
          createdBy: userId,
          createdAt: new Date().toISOString(),
        }
      );

      if (!transitionResult.success) {
        throw new Error(transitionResult.message || "Failed to update workflow");
      }

      return {
        success: true,
        newStatus: "awaiting_contract_signature",
        previousStatus: "offer_accepted",
        event: "CONTRACT_CREATED",
        message: "Contract created. Awaiting signatures from both parties.",
        context,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error("Error in handleContractCreated:", error);
      throw error;
    }
  }

  /**
   * Orchestrate contract signing workflow
   * Handles both client and contractor signatures
   */
  async handleContractSigned(
    projectId: string,
    contractId: string,
    signedBy: "client" | "contractor",
    userId: string
  ): Promise<WorkflowTransitionResult> {
    const context: WorkflowContext = {
      projectId,
      contractId,
      userId,
      userRole: signedBy === "client" ? "owner" : "contractor",
      metadata: {
        action: "contract_signed",
        signedBy,
        timestamp: new Date().toISOString(),
      },
    };

    try {
      // Determine which event to trigger
      const event =
        signedBy === "client"
          ? "CONTRACT_SIGNED_BY_CLIENT"
          : "CONTRACT_SIGNED_BY_CONTRACTOR";

      // Trigger the signing event
      const eventResult = await workflowApi.triggerWorkflowEvent(
        projectId,
        event,
        {
          contractId,
          signedBy,
          signedAt: new Date().toISOString(),
        }
      );

      // Check if both parties have signed
      // This would typically come from the contract service
      const bothPartiesSigned = await this.checkBothPartiesSigned(contractId);

      if (bothPartiesSigned) {
        // Trigger full signature event
        const fullSignatureResult = await workflowApi.triggerWorkflowEvent(
          projectId,
          "CONTRACT_FULLY_SIGNED",
          {
            contractId,
            fullySignedAt: new Date().toISOString(),
          }
        );

        if (fullSignatureResult.success) {
          return {
            success: true,
            newStatus: "contract_signed",
            previousStatus: "awaiting_contract_signature",
            event: "CONTRACT_FULLY_SIGNED",
            message: "Contract fully signed by both parties. Project ready to start.",
            context,
            timestamp: new Date().toISOString(),
          };
        }
      }

      return {
        success: true,
        newStatus: "awaiting_contract_signature",
        previousStatus: "awaiting_contract_signature",
        event,
        message: `Contract signed by ${signedBy}. Awaiting signature from other party.`,
        context,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error("Error in handleContractSigned:", error);
      throw error;
    }
  }

  /**
   * Orchestrate project execution start
   * After contract is fully signed, project can start execution
   */
  async handleExecutionStart(
    projectId: string,
    contractId: string,
    userId: string
  ): Promise<WorkflowTransitionResult> {
    const context: WorkflowContext = {
      projectId,
      contractId,
      userId,
      userRole: "owner",
      metadata: {
        action: "execution_started",
        timestamp: new Date().toISOString(),
      },
    };

    try {
      const transitionResult = await workflowApi.triggerWorkflowEvent(
        projectId,
        "EXECUTION_STARTED",
        {
          startedBy: userId,
          startedAt: new Date().toISOString(),
        }
      );

      if (!transitionResult.success) {
        throw new Error(transitionResult.message || "Failed to start execution");
      }

      return {
        success: true,
        newStatus: "in_progress",
        previousStatus: "contract_signed",
        event: "EXECUTION_STARTED",
        message: "Project execution started successfully.",
        context,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      console.error("Error in handleExecutionStart:", error);
      throw error;
    }
  }

  /**
   * Validate if offer can be accepted in current state
   */
  private async validateOfferAcceptance(
    projectId: string
  ): Promise<WorkflowValidationResult> {
    try {
      // Get current project state
      const stateResult = await workflowApi.getProjectWorkflowState(projectId);

      if (!stateResult.success || !stateResult.response) {
        return {
          isValid: false,
          canTransition: false,
          missingConditions: ["Cannot retrieve project state"],
          errors: ["Failed to validate project state"],
          warnings: [],
        };
      }

      const currentStatus = stateResult.response.currentStatus;

      // Check if transition is valid
      if (!isValidTransition(currentStatus, "offer_accepted")) {
        return {
          isValid: false,
          canTransition: false,
          missingConditions: [],
          errors: [
            `Cannot accept offer from status: ${currentStatus}. Project must be in 'receiving_bids' status.`,
          ],
          warnings: [],
        };
      }

      return {
        isValid: true,
        canTransition: true,
        missingConditions: [],
        errors: [],
        warnings: [],
      };
    } catch (error: any) {
      return {
        isValid: false,
        canTransition: false,
        missingConditions: [],
        errors: [error.message || "Validation failed"],
        warnings: [],
      };
    }
  }

  /**
   * Initiate contract creation after offer acceptance
   * This can be called to trigger contract generation
   */
  private async initiateContractCreation(
    projectId: string,
    offerId: string,
    context: WorkflowContext
  ): Promise<void> {
    try {
      // This would typically call the contract service to create a draft contract
      // For now, we just log and the backend should handle this
      console.log("Initiating contract creation for:", {
        projectId,
        offerId,
        context,
      });

      // The backend API should automatically create a contract when offer is accepted
      // If not, we can call the contract creation API here
      // await contractApi.createFromOffer(projectId, offerId);
    } catch (error: any) {
      console.error("Error initiating contract creation:", error);
      // Don't throw - contract creation failure shouldn't fail the offer acceptance
    }
  }

  /**
   * Check if both parties have signed the contract
   */
  private async checkBothPartiesSigned(contractId: string): Promise<boolean> {
    try {
      // This would call the contract service to check signatures
      // For now, return false and let the backend handle the logic
      // In a real implementation:
      // const contract = await contractApi.getContract(contractId);
      // return contract.clientSigned && contract.contractorSigned;
      return false; // Backend will handle full signature detection
    } catch (error: any) {
      console.error("Error checking contract signatures:", error);
      return false;
    }
  }

  /**
   * Validate a transition before executing it
   */
  async validateTransition(
    projectId: string,
    toStatus: WorkflowStatus
  ): Promise<WorkflowValidationResult> {
    try {
      const result = await workflowApi.validateTransition(projectId, toStatus);

      if (!result.success || !result.response) {
        return {
          isValid: false,
          canTransition: false,
          missingConditions: ["Validation failed"],
          errors: [result.message || "Cannot validate transition"],
          warnings: [],
        };
      }

      return {
        isValid: result.response.can_transition,
        canTransition: result.response.can_transition,
        missingConditions: result.response.reasons || [],
        errors: result.response.can_transition ? [] : result.response.reasons,
        warnings: [],
      };
    } catch (error: any) {
      return {
        isValid: false,
        canTransition: false,
        missingConditions: [],
        errors: [error.message || "Validation error"],
        warnings: [],
      };
    }
  }
}

// Export singleton instance
export const workflowOrchestrator = new WorkflowOrchestrator();
