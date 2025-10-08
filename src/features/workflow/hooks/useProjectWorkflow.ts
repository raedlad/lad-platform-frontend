/**
 * useProjectWorkflow Hook
 * Specialized hook for project-specific workflow operations
 */

import { useCallback } from "react";
import { useWorkflow } from "./useWorkflow";
import { toast } from "sonner";

interface UseProjectWorkflowOptions {
  projectId: string;
  onStatusChange?: (newStatus: string) => void;
  onError?: (error: string) => void;
}

export const useProjectWorkflow = ({
  projectId,
  onStatusChange,
  onError,
}: UseProjectWorkflowOptions) => {
  const workflow = useWorkflow({
    projectId,
    autoFetch: true,
    fetchHistory: false,
  });

  // Handle offer acceptance with notifications
  const acceptOfferWithWorkflow = useCallback(
    async (offerId: string, userId: string) => {
      try {
        const result = await workflow.acceptOffer(offerId, userId);

        if (result.success) {
          toast.success(result.message || "Offer accepted successfully");
          onStatusChange?.(result.newStatus);
          return result;
        } else {
          throw new Error(result.message || "Failed to accept offer");
        }
      } catch (error: any) {
        const errorMsg = error.message || "Failed to accept offer";
        toast.error(errorMsg);
        onError?.(errorMsg);
        throw error;
      }
    },
    [workflow, onStatusChange, onError]
  );

  // Handle contract signing with notifications
  const signContractWithWorkflow = useCallback(
    async (
      contractId: string,
      signedBy: "client" | "contractor",
      userId: string
    ) => {
      try {
        const result = await workflow.signContract(contractId, signedBy, userId);

        if (result.success) {
          toast.success(result.message || "Contract signed successfully");
          onStatusChange?.(result.newStatus);
          return result;
        } else {
          throw new Error(result.message || "Failed to sign contract");
        }
      } catch (error: any) {
        const errorMsg = error.message || "Failed to sign contract";
        toast.error(errorMsg);
        onError?.(errorMsg);
        throw error;
      }
    },
    [workflow, onStatusChange, onError]
  );

  // Handle execution start with notifications
  const startExecutionWithWorkflow = useCallback(
    async (contractId: string, userId: string) => {
      try {
        const result = await workflow.startExecution(contractId, userId);

        if (result.success) {
          toast.success(result.message || "Project execution started");
          onStatusChange?.(result.newStatus);
          return result;
        } else {
          throw new Error(result.message || "Failed to start execution");
        }
      } catch (error: any) {
        const errorMsg = error.message || "Failed to start execution";
        toast.error(errorMsg);
        onError?.(errorMsg);
        throw error;
      }
    },
    [workflow, onStatusChange, onError]
  );

  return {
    ...workflow,
    acceptOfferWithWorkflow,
    signContractWithWorkflow,
    startExecutionWithWorkflow,
  };
};
