/**
 * Contract Workflow Adapter
 * Connects the contract feature with the workflow system
 */

import { workflowOrchestrator } from "../services/workflowOrchestrator";
import { contractService } from "@/features/contract/services/contractApi";
import { WorkflowTransitionResult } from "../types/workflow";

export class ContractWorkflowAdapter {
  /**
   * Create contract and trigger workflow transition
   * Called after offer acceptance to initialize contract
   */
  async createContractWithWorkflow(
    projectId: string,
    offerId: string,
    contractId: string,
    userId: string
  ): Promise<{
    contractCreated: boolean;
    workflowTransition: WorkflowTransitionResult;
  }> {
    try {
      // Step 1: Contract should already be created by backend after offer acceptance
      // This method just triggers the workflow transition

      // Step 2: Trigger workflow transition
      const workflowResult = await workflowOrchestrator.handleContractCreated(
        projectId,
        offerId,
        contractId,
        userId
      );

      return {
        contractCreated: true,
        workflowTransition: workflowResult,
      };
    } catch (error: any) {
      console.error("Error in createContractWithWorkflow:", error);
      throw new Error(
        error.message || "Failed to create contract and update workflow"
      );
    }
  }

  /**
   * Sign contract and trigger workflow transition
   */
  async signContractWithWorkflow(
    projectId: string,
    contractId: number,
    signedBy: "client" | "contractor",
    userId: string
  ): Promise<{
    contractSigned: boolean;
    workflowTransition: WorkflowTransitionResult;
  }> {
    try {
      // Step 1: Sign the contract via contract service
      const signedContract = await contractService.signContract(
        contractId,
        signedBy
      );

      if (!signedContract) {
        throw new Error("Failed to sign contract");
      }

      // Step 2: Trigger workflow transition
      const workflowResult = await workflowOrchestrator.handleContractSigned(
        projectId,
        contractId.toString(),
        signedBy,
        userId
      );

      return {
        contractSigned: true,
        workflowTransition: workflowResult,
      };
    } catch (error: any) {
      console.error("Error in signContractWithWorkflow:", error);
      throw new Error(
        error.message || "Failed to sign contract and update workflow"
      );
    }
  }

  /**
   * Check if contract can be signed based on workflow state
   */
  async canSignContract(projectId: string): Promise<boolean> {
    try {
      const validation = await workflowOrchestrator.validateTransition(
        projectId,
        "contract_signed"
      );

      return validation.canTransition;
    } catch (error: any) {
      console.error("Error checking if contract can be signed:", error);
      return false;
    }
  }

  /**
   * Handle both parties signing and move to execution
   */
  async handleFullySignedContract(
    projectId: string,
    contractId: string,
    userId: string
  ): Promise<WorkflowTransitionResult> {
    try {
      // This is called when both parties have signed
      // Trigger execution start workflow
      const workflowResult = await workflowOrchestrator.handleExecutionStart(
        projectId,
        contractId,
        userId
      );

      return workflowResult;
    } catch (error: any) {
      console.error("Error handling fully signed contract:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const contractWorkflowAdapter = new ContractWorkflowAdapter();
