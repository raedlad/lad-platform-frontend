/**
 * useContractWorkflow Hook
 * Specialized hook for contract operations with workflow integration
 */

import { useState, useCallback } from "react";
import { contractWorkflowAdapter } from "../adapters/contractWorkflowAdapter";
import { toast } from "sonner";

interface UseContractWorkflowOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const useContractWorkflow = (
  options: UseContractWorkflowOptions = {}
) => {
  const { onSuccess, onError } = options;
  const [isSigning, setIsSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sign contract with automatic workflow transition
   */
  const signContractWithWorkflow = useCallback(
    async (
      projectId: string,
      contractId: number,
      signedBy: "client" | "contractor",
      userId: string
    ) => {
      setIsSigning(true);
      setError(null);

      try {
        const result = await contractWorkflowAdapter.signContractWithWorkflow(
          projectId,
          contractId,
          signedBy,
          userId
        );

        if (result.contractSigned && result.workflowTransition.success) {
          toast.success(
            result.workflowTransition.message ||
              "Contract signed and workflow updated"
          );
          onSuccess?.();
          return result;
        } else {
          throw new Error("Failed to complete workflow transition");
        }
      } catch (err: any) {
        const errorMsg = err.message || "Failed to sign contract";
        setError(errorMsg);
        toast.error(errorMsg);
        onError?.(errorMsg);
        throw err;
      } finally {
        setIsSigning(false);
      }
    },
    [onSuccess, onError]
  );

  /**
   * Create contract after offer acceptance
   */
  const createContractWithWorkflow = useCallback(
    async (
      projectId: string,
      offerId: string,
      contractId: string,
      userId: string
    ) => {
      setError(null);

      try {
        const result = await contractWorkflowAdapter.createContractWithWorkflow(
          projectId,
          offerId,
          contractId,
          userId
        );

        if (result.contractCreated && result.workflowTransition.success) {
          toast.success(
            result.workflowTransition.message || "Contract created successfully"
          );
          onSuccess?.();
          return result;
        } else {
          throw new Error("Failed to create contract");
        }
      } catch (err: any) {
        const errorMsg = err.message || "Failed to create contract";
        setError(errorMsg);
        toast.error(errorMsg);
        onError?.(errorMsg);
        throw err;
      }
    },
    [onSuccess, onError]
  );

  /**
   * Check if contract can be signed
   */
  const canSignContract = useCallback(async (projectId: string) => {
    try {
      return await contractWorkflowAdapter.canSignContract(projectId);
    } catch (err: any) {
      console.error("Error checking if contract can be signed:", err);
      return false;
    }
  }, []);

  return {
    signContractWithWorkflow,
    createContractWithWorkflow,
    canSignContract,
    isSigning,
    error,
    setError,
  };
};
